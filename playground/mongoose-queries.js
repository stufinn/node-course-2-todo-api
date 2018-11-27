const {ObjectID} = require('mongodb'); //import the ObjectID method from mongodb
const {mongoose} = require('./../server/db/mongoose.js');
//import ToDo mongoose model
const {ToDo} = require('./../server/models/todo.js');
//import User mongoose model
const{User} = require('./../server/models/user');

var id = '5bfd7dafc50e340b1b37b3be11';


//ObjectID method from mongodb has a property called .isValid()
// if (!ObjectID.isValid(id)) {
//   console.log('ID is not valid');
// };


//find() returns an array
//  ToDo.find({
//    _id:id
//  }).then( (todos) => {
//    if (todos.length == 0) {
//      return console.log('Returned empty array');
//    }
//    console.log('Todos:', JSON.stringify(todos, undefined, 2));
//  });

// //  findOne returns ONE item, not an array
//  ToDo.findOne({
//   _id:id
// }).then( (todo) => {
//   if (!todo) {
//     return console.log('ID not found');
//   }
//   console.log('Todo:',JSON.stringify(todo, undefined, 2));
// });

// ToDo.findById(id).then( (todo) => {
//   if (!todo) {
//     return console.log('ID not found');
//   }
//   console.log('Todo By Id:',JSON.stringify(todo, undefined, 2));
// }).catch( (e) => {
//   console.log('There was an error!', e.message);
// });

//challege: query the User's collection
//load in the User mongoose model
//query one of the ids
//handle three cases
//1. Query works but there's no user
//2. Handle case where user was found
//3. handle any errors that have occurred
//don't need to use .isVald() for this one

var userId = '5bfd86eb10cd9aedbe0dfbae';

if (!ObjectID.isValid(userId)) {
  return console.log(`ID ${userId} is not valid`);
}

User.findById(userId).then( (user) => {
  if(!user) {
    return console.log(' User was not found');
  }
  console.log('User by ID:', JSON.stringify(user, undefined, 2));
}).catch( (e) => console.log('There was an error', e.message));