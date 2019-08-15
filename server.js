const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');

const PORT = process.env.PORT|| 4001;

app.use(cors());
app.use(bodyParser.json());
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/devconnector2', { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}

require('./routes/api/posts')(app);
require('./routes/api/users')(app);
require('./routes/api/profile')(app);

app.listen(PORT,function(){
    console.log(`server is running on port: ${PORT}`);
});
