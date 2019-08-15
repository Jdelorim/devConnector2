const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');

const PORT = process.env.PORT|| 4001;

app.use(cors());
app.use(bodyParser.json());

if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}
app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
})

app.listen(PORT,function(){
    console.log(`server is running on port: ${PORT}`);
});
