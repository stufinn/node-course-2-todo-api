const {ObjectID} = require('mongodb'); //import the ObjectID method from mongodb
const {mongoose} = require('./../server/db/mongoose.js');
//import ToDo mongoose model
const {ToDo} = require('./../server/models/todo.js');
//import User mongoose model
const{User} = require('./../server/models/user');

var id = '5bfd7dafc50e340b1b37b3be11';

// ToDo.remove({}).then( (result) => {
//   console.log(result);
// });

// ToDo.findOneAndRemove()
// ToDo.findByIdAndRemove()

ToDo.findByIdAndRemove('5bfed4d12a569c03e56ce4f1').then((todo) => {
  console.log(todo);
});

ToDo.findOneAndRemove({_id: '5bfed4d12a569c03e56ce4f1'}).then((todo)=> {
  console.log(todo);
}); 