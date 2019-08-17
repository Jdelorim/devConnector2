const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const User = require('../../models/User');
const bcyrpt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

router.post('/register',(req,res) => {
    const { errors, isValid } = validateRegisterInput(req.body);
    if(!isValid) {
        return res.status(400).json(errors);
    }   

    User.findOne({ email: req.body.email })
        .then(data => {
            if(data) {
                errors.email = 'Email already exists';
                return res.status(400).json({email: 'Email already exists'});
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200',
                    r: 'pg',
                    d: 'mm'
                });
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar: avatar,
                    password: req.body.password
                });
                bcyrpt.genSalt(10, (err, salt) =>{
                    bcyrpt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    })
                })
            }
        })
});

router.post('/login', (req, res) => {
    const {errors, isValid} = validateLoginInput(req.body);
    if(!isValid) {
        return res.status(400).json(errors);
    }
   const {email, password} = req.body;
   User.findOne({email})
        .then(data => {
            if(!data) {
                errors.email = 'User not found';
                return res.status(404).json({errors});
            }
            bcyrpt.compare(password, data.password)
                .then(isMatch => {
                    if(isMatch) {
                        const payload = { id: data.id, name: data.name, avatar: data.avatar }
                       jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600*4 }, (err, token) => {
                           res.json({
                               success: true,
                               token: 'Bearer ' + token
                           });
                        });
                    } else {
                        errors.password = 'Password incorrect';
                        return res.status(400).json({errors});
                    }
                });
        });
});

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ id: req.user.id, name: req.user.name, email: req.user.email });
});


module.exports = router;