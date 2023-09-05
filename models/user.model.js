import crypto from 'crypto'
import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name.'],
    },

    email: {
        type: String,
        required: [true, 'Please provide your email.'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email.'],
    },

    photo: { type: String, default: 'default.jpg' },

    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user',
    },

    activationToken: String,

    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
    },


    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function (val) {
                return val === this.password;
            },
            message: 'Passwords are not equal',
        },
    },

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: false,
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
});

userSchema.pre('save', async function (next) {
    // CHECK IF PASSWORD WAS MODIFIED
    // IF NO, Return AND GO OVER
    if (!this.isModified('password')) return next();

    // IF YES HASH THE PASSWORD
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;

    next();
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function (next) {
    this.select("-updatedAt -createdAt")
    next();
});

userSchema.methods.comparePasswords = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedPasswordAt = parseInt(this.passwordChangedAt.getTime() / 1000);
        // Return true or false
        return JWTTimestamp < changedPasswordAt;
    }
    // Not changed
    return false;
};

userSchema.methods.createpasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model('User', userSchema);

export default User