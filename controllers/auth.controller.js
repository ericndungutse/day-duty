import crypto from "crypto";
import jwt from "jsonwebtoken";

import AppError from '../utils/AppError.js'
import sendEmail from "../utils/email.js";
import User from '../models/user.model.js'
import createToken from "../utils/token.js";

const signToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const signInUser = (user, status, res) => {
    const token = signToken(user._id);

    user.password = undefined;
    res.status(status).json({
        status: "success",
        token,
        data: {
            user,
        },
    });
};

export const signup = async (req, res, next) => {
    try {
        const { name, email, password, passwordConfirm } = req.body;
        const user = await User.create({ name, email, password, passwordConfirm });

        if (user) {
            const { plainToken: activationToken, hashedToken } = createToken()
            user.activationToken = hashedToken
            await user.save({ validateModifiedOnly: true });

            const accountActivationLink = `${process.env.BACKEND_URL}/auth/activate-account?token=${activationToken}`;
            const message = `Welcome to DayDuty! Clink on this link, ${accountActivationLink} to activate your account. `;

            try {
                await sendEmail({
                    email: user.email,
                    subject: "Account Activation Link",
                    message,
                });

                res.status(201).json({
                    status: "success",
                    message: "Link to activate your account has been sent! Check your email to activate.",
                });
            } catch (err) {

                // DELETE USER IF SENDING EMAIL FAILS
                await User.findByIdAndDelete(user._id)
                return next(
                    new AppError(
                        "There was an error sgining up. Try again later!",
                        500
                    )
                );
            }
        }

    } catch (error) {
        next(error);
    }
};


// Sign in
export const signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }, "id password email active").exec();

        if (user && !user.active)
            return next(new AppError("Your account is not activated! Check your email to activate your", 403));

        if (!email || !password)
            return next(new AppError("Please provide email and password", 400));

        if (!user || !(await user.comparePasswords(password, user.password)))
            return next(new AppError("Email or password is incorrect", 403));


        // Sign In User
        signInUser(user, 200, res);
    } catch (error) {
        next(error);
    }
};

export const updatePassword = async (req, res, next) => {
    try {
        //  1) Get userfrom collection
        const user = await User.findById(req.user._id).select("+password");
        if (!user) return next(new AppError(`User doesn't exist.`, 404));

        // 2) Check if posted current password is
        if (
            !(await user.comparePasswords(req.body.currentPassword, user.password))
        ) {
            return next(new AppError("Your current password is wrong", 401));
        }

        if (req.body.password !== req.body.confirmPassword) {
            return next(
                new AppError("New password and confirm password are not the same", 401)
            );
        }

        // 3) If correct, update the password
        user.password = req.body.password;
        user.confirmPassword = req.body.confirmPassword;
        await user.save();

        res.status(200).json({
            status: "success",
            message: "Password changed successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user)
            return next(new AppError("There is no user with that email", 404));

        const resetCode = user.createPasswordResetToken();
        await user.save({ validateModifiedOnly: true });

        // Send it to the use's email
        const resetUrl = `https://ndungutse.netlify.app/reset-password.html?token=${resetCode}`;

        const message = `Forgot your password? use this link "${resetUrl}" to reset your password. If you did not forgot your password, please ignore this email!`;

        try {
            await sendEmail({
                email: user.email,
                subject: "Password reset link. (Valid for 10 min)",
                message,
            });

            res.status(200).json({
                status: "success",
                message: "Link to reset password was sent to your email.",
            });
        } catch (err) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;

            user.save({ validateBeforeSave: false });
            console.log(err);
            return next(
                new AppError(
                    "There was an error sending the email. Try again later!",
                    500
                )
            );
        }
    } catch (error) {
        next(error);
    }
};

// Reset Password
export const resetPassword = async (req, res, next) => {
    try {
        // 1) Get user based on the token.
        const hashedToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetTokenExpiresIn: { $gt: Date.now() },
        });

        // 2) If token has not expired and user exist, set the new password.
        if (!user)
            return next(
                new AppError(
                    "Link to reset password has expired. Please request a new link!",
                    400
                )
            );

        // 3) Update password changed at.
        user.password = req.body.password;
        user.confirmPassword = req.body.confirmPassword;
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpiresIn = undefined;

        await user.save();

        // 4) Log the user in.
        signInUser(user, 200, res);
    } catch (error) {
        next(error);
    }
};