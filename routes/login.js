const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../utils/auth');
const Users = mongoose.model('user');


router.post('/login', auth.optional, (req, res, next) => {
    const { body: { email, password } } = req;

    if(!email) {
        return res.status(422).json({
            errors: {
                email: 'is required',
            },
        });
    }

    if(!password) {
        return res.status(422).json({
            errors: {
                password: 'is required',
            },
        });
    }

    return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
        if(err) {
            return next(err);
        }

        if(passportUser) {
            const user = passportUser;
            user.token = passportUser.generateJWT();

            return res.json({ user: user.toAuthJSON() });
        }

        return status(400).info;
    })(req, res, next);
});

module.exports = router;
