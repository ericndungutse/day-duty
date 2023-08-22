import crypto from 'crypto'

const createToken = () => {
    const token = crypto.randomInt(999999).toString();

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