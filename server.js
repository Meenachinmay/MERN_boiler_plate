const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const config = require('./config/keys');

const { User } = require('./models/User');
const { auth } = require('./middlewares/auth');

// connect the mongodb database
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
    })
    .then(() => console.log('Database is connected'))
    .catch((error) => console.error(error));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

// middleware route
app.get('/api/user/auth', auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastName: req.user.lastName,
        role: req.user.role

    });
});

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
        jwt.sign({data: user._id}, config.JWT_TOKEN_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) console.error(err);
            
            // save this token to the database
            user.token = token;
            
            user.save((err, tokenSaved) => {
                if (err) console.error(err);
                return res.cookie("x_auth", token).status(200).json({
                    loginSuccess: true,
                    token: token
                });
            });
        });
    });
});


// Logout user
app.get('/api/user/logout', auth, (req,res) => {
    User.findOneAndUpdate({"_id": req.user._id}, {"token": ""}, (err, doc) => {
        if (err) return res.status(400).json({
            success: false, err
        })
        return res.status(200).json({
            success: true
        })
    });
});

// port to listen
app.listen(5000);