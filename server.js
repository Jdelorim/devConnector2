const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');


const PORT = process.env.PORT|| 4001;

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/devconnector2', { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

app.use(passport.initialize());
require('./config/passport.js')(passport);

if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}


app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

app.listen(PORT,function(){
    console.log(`server is running on port: ${PORT}`);
});
