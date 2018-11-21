//load in mongoose library (not file we created)
const mongoose = require('mongoose');

//create a model
//see options for this in mongoose documentation
var ToDo = mongoose.model('ToDo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});

//creating a new todo
//run the model as a constructor function
// var newTodo = new ToDo({
//     text: "Cook dinner"
// });

//save to mongoDB database
// .save() reurns a promise
// newTodo.save().then( (doc) => {
//     console.log('Saved todo', doc);
// }, (e) => {
//     console.log('Unable to save todo');
// });

// var anotherToDo = new ToDo({
//     text:'  Eat another lunch  ',
//     // completed: true,
//     // completedAt: 1500,
// });

// anotherToDo.save().then( (doc) => {
//     console.log('Saved the new todo', JSON.stringify(doc, undefined, 2));
// }, (e) => {
//     console.log('Unable to save the new todo', e);
// });

module.exports = {ToDo};