import crypto from 'crypto'

const createToken = () => {
    const token = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");


    return {
        plainToken: token,
        hashedToken
    };
};

export default createToken