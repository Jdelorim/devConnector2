const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const User = require('../../models/User');
const bcyrpt = require('bcryptjs');

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

module.exports = router;