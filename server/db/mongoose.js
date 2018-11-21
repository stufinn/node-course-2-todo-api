const mongoose  = require('mongoose');

//add the built-in promise library  - mongoose supports _callbacks_ by default
//"promises are easier to chain and scale"
//this line just needs to be in server.js
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/ToDoApp').then( () => {
    console.log('Connected to mongoDB server');
}, (e) => {
    console.log('Unable to connect to server', e);
});

module.exports = {mongoose};