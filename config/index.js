require('dotenv').config();

const Config = {
    ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    MONGO: {
        URI: process.env.MONGODB_URI,
        DEBUG: process.env.MONGODB_DEBUG
    },
    SESSION: {
        SECRET: process.env.SESSION_SECRET,
        MAX_AGE: process.env.SESSION_MAX_AGE
    }
};

module.exports = Config;
