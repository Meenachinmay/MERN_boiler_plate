const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const config = require('./config/keys');

const { User } = require('./models/User');

// connect the mongodb database
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    })
    .then(() => console.log('Database is connected'))
    .catch((error) => console.error(error));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

// New user registration
app.post('/api/users/register', (req,res) => {
    // check if email already exists
    
    const newUser = new User(req.body);

    newUser.save((err, newlyCreatedUser) => {
        if (err) return res.status(400).json({ success: false, errors: err});     
        return res.status(200).json({
            success: true,
            userData: newlyCreatedUser
        });
    });

});


// Login user
app.post('/api/user/login', (req, res) => {
    // find email
    User.findOne({email: req.body.email}, (err, user) => {
        if (err) console.error(err);
        if (!user){
            return res.status(400).json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            })
        }

        // compare password
        bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
            if (err) console.error(err);
            if (!isMatch){
                return res.status(400).json({loginSuccess: false, message: "Wrong password"});
            }
        });

        // generate token
        jwt.sign({_id: user._id}, config.JWT_TOKEN_SECRET,(err, token) => {
            if (err) console.error(err);
            return res.cookie("x_auth", token).status(200).json({
                loginSuccess: true,
                token: token
            });
        });
    });
});

// port to listen
app.listen(5000);