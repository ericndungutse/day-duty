import nodemailer from "nodemailer"

const sendEmail = async (options) => {
    // 1) Create a transporter. A service thatsend an email
    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASSWORD,
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