//load in mongoose library (not file we created)
const mongoose = require('mongoose');

const validator = require('validator');

const jwt = require('jsonwebtoken');
const _ = require('lodash');

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

// overrides default behavhiour to limit/dictate what gets sent back to user
//i.e. only send back email and user id
UserSchema.methods.toJSON = function () {
    var user = this;
    // convert a mongoose variable and convert it to a _regular_ object where only the properties available on the _document_ exist
    var userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email']);

};

//this is an "instance" method.  
UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access }, 'abc123').toString();

    // user.tokens.push({access,token}); //this approach with push doesn't work consisitently across mongodb versions
    //this line (below) works better with .concat
    user.tokens = user.tokens.concat([{access, token}]);

    // .save() returns a promise
    //r eview this in Lec 90 at 8:45
    //use return so that  server.js can add onto the promise
    return user.save().then( () => {
        return token;
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