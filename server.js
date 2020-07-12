const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { User } = require('./models/User');

// connect the mongodb database
mongoose.connect('mongodb://localhost:27017/mern-boilerplate', {
    useNewUrlParser: true,
    useUnifiedTopology: true
    })
    .then(() => console.log('Database is connected'))
    .catch((error) => console.error(error));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

app.post('/api/users/register', (req,res) => {
    const newUser = new User(req.body);

    newUser.save((err, userData) => {
        if (err) return res.json({ success: false, err});
        else return res.status(200).json({message: "User is registered successfully!"});
    });
    
});

app.get('/', (req, res) => {
    res.send('Hello world');
});

// port to listen
app.listen(5000);