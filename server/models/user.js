//load in mongoose library (not file we created)
const mongoose = require('mongoose');

//make new user model with email property
//require and trim
//set type = string
//min length of 1
//create one with and without an email property

var User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }
});

// var newUser = new User({
//     email: '    '
// });

// newUser.save().then( (doc)=> {
//     console.log('New user saved!', doc);
// }, (error) => {
//     console.log('Unable to save user', error);
// });

module.exports = {User};