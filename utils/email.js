import nodemailer from "nodemailer"

const sendEmail = async (options) => {
    // 1) Create a transporter. A service thatsend an email
    const transporter = nodemailer.createTransport({
        service: process.env.MAIL_PROD_HOST,
        auth: {
            user: process.env.MAIL_PROD_USER,
            pass: process.env.MAIL_PROD_PASSWORD,
        },
    });
    // 2) Define email options
    const mailOptions = {
        from: "Ndungutse <dav.ndungutse@gmail.com>",
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    // 3) Send email
    await transporter.sendMail(mailOptions);
};

export default sendEmail