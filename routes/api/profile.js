const router = require('express').Router();

module.exports = (app) => {
    router.get('/test',(req,res)=>{
        
        res.json({msg: 'Profile helloooo'});
    })
}