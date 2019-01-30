const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {ToDo} = require('./../../models/todo');
const {User} = require('./../../models/user');


const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
  _id: userOneId, // user with a valid authentication token
  email: 'stu@example.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'},'abc123').toString()  // see lec 93 @ 6:25
  }]
},{
  _id: userTwoId,  // user without a valid authentication token
  email: 'finn@example.com',
  password: 'userTwoPass'
}];


const todos = [{
  text:"First sample todo",
  _id: new ObjectID()
},
{
  text:"Second sample todo",
  _id: new ObjectID(),
  completed: true,
  completedAt: 333
},
{
  text:"Third sample todo",
  _id: new ObjectID()
}];

const populateTodos = (done) => {
  ToDo.remove({}).then( () => {
    return ToDo.insertMany(todos);
  }).then( () => done() );
};

const populateUsers = (done) => {
  User.remove({}).then( () => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    // Promise.all --> callback won't get fired until the whole array of promises are fulfilled
    return Promise.all([userOne, userTwo])
  }).then( () => done() );
};

module.exports = {todos, populateTodos, users, populateUsers};