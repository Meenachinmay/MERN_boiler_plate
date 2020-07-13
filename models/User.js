const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_WORK_FACTOR = 10;

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 3,
    },
    lastName: {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 3
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        min: 6,
        required: true
    },
    role: {
        type: Number,
        default: 0
    },
    token: {
        type: String,
    },
    tokenExp: {
        type: Number
    }
});

//https://stackoverflow.com/questions/14588032/mongoose-password-hashing
userSchema.pre('save', function(next) {
    const user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

// userSchema.methods.generateToken = (callback) => {
//     var user = this;
    
//     var token = jwt.sign({data: user._id},'secret', { expiresIn: 60*60 });

//     user.token = token;

//     user.save((err, user) => {
//         if (err) return callback(err);
//         callback(null, user);
//     });
// }

const User = mongoose.model('User', userSchema);

module.exports = { User }