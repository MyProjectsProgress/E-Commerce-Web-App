const jwt = require('jsonwebtoken');

// to create token we pass data, the secret key and the expiration time
// each user has unique id and also the secret key both make token unique
const createToken = async (payLoad) => {
    return jwt.sign({ userId: payLoad }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE_TIME });
};

module.exports = createToken;