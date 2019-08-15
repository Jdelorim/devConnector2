const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const User = require('../../models/User');
const bcyrpt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

router.get('/test',(req,res) => {
    res.json({msg: 'users helloooo'});
});

router.post('/register',(req,res) => {
    User.findOne({ email: req.body.email })
        .then(data => {
            if(data) {
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
   const {email, password} = req.body;
   User.findOne({email})
        .then(data => {
            if(!data) {
                return res.status(404).json({eamil: 'User not found'});
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
                        return res.status(400).json({password: 'Password incorrect'});
                    }
                });
        })
})


module.exports = router;