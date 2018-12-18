//load in mongoose library (not file we created)
const mongoose = require('mongoose');
const validator = require('validator');

const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

//make new user model with email property
//require and trim
//set type = string
//min length of 1
//create one with and without an email property

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {  // https://mongoosejs.com/docs/validation.html
            validator: validator.isEmail,
            },
            message: props => `${props.value} is not a valid email!`
        },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.pre('save', function (next) {
    //get access to individual document
    var user = this;
    //need to check if the password is modified.  The user may have changed something else
    if (user.isModified('password')) {
        //access password with user.password
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                // assign the hash to user.password
                user.password = hash;
                console.log('hashed password:', hash);
                console.log(user.password);
                next();  //need to call this in order to move on to save!
            });
        });
    } else {
        next();
        // console.log('No hashing yet!')
    }
    // next();

    
});

// overrides default behavhiour to limit/dictate what gets sent back to user
//i.e. only send back email and user id
//this customizes what gets send back whenever a model gets stringified, *which happens whenever res.send() is called*
//see: https://javascript.info/json#custom-tojson
UserSchema.methods.toJSON = function () {
    var user = this;
    // convert a mongoose variable and convert it to a _regular_ object where only the properties available on the _document_ exist
    var userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email']);

};

//this is an "instance" method. i.e. it occurs on a single instance of our User model, instead of having access to all of them (see .statics() below)
UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access }, 'abc123').toString();

    // user.tokens.push({access,token}); //this approach with push doesn't work consisitently across mongodb versions
    //this line (below) works better with .concat
    user.tokens = user.tokens.concat([{access, token}]);

    // .save() returns a promise
    //r eview this in Lec 90 at 8:45
    //use return so that  server.js can add onto (?use?) the promise
    return user.save().then( () => {
        return token;
    });
};

///UserSchema.statics is like UserSchema.methods but it creates a "model method" as opposted to an "instance method"

UserSchema.statics.findByToken = function (token) {
    var User = this;  //binds the whole _model_ (with all the instances, so we can search them) as opposed to the specific instance
    var decoded; // will store the decoded jwt value (in hashing.js)

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        // i.e. returns a promise that is always going to reject
        
        return Promise.reject(); // less verbose than code immediately below
        //could passin with a value to use as the 'e' argument in server.js
        
        // return new Promise((resolve, reject) => {
        //     reject();
        // });
    }
    //success case
    //User.findOne returns a promise.  In order for us to chain on that in server.js, whe need to 'return' this function with the included promise
    return User.findOne({
        //querying our "nested object properties"
        '_id': decoded._id,
        'tokens.token': token,  //'' required when there's a . in the value. added to _id key for consistency
        'tokens.access': 'auth'
    });

};


var User = mongoose.model('User', UserSchema);

// var newUser = new User({
//     email: '    '
// });

// newUser.save().then( (doc)=> {
//     console.log('New user saved!', doc);
// }, (error) => {
//     console.log('Unable to save user', error);
// });

module.exports = {User};