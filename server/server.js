var express = require('express');
var bodyParser = require('body-parser');

//desructuring vvv
const {ObjectID} = require('mongodb'); //import ObjectID module from mongoDB library
var {mongoose} = require('./db/mongoose');
var {ToDo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

//configure middleware
//with this, can send json data to our application
app.use(bodyParser.json());

//Route to POST todos
app.post('/todos', (req,res) => {
    // console.log(req.body);
    var todo = new ToDo({
        text: req.body.text
    });

    todo.save().then( (doc)=> {
        // console.log(doc);
        // send doc back!
        res.status(200).send(doc);
    }, (e) => {
        // console.log('Could not save todo', e);
        res.status(400).send(e);
    });
});

//Route to GET todos (i.e. list all)

app.get('/todos', (req,res) => {
    ToDo.find().then( (todos) => {
        //could just send todos as an array(?) but better to send as an object b/c you can add custom properties on later
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });

});

// GET /todos/1234324
// :id creates an id variable, created on the _request_ object
app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    // res.send(id);
    // If ID is invalid, returns a 404 status an empty response body
    if (!ObjectID.isValid(id)) {
        // console.log('Invalid ID');
        return res.status(404).send();
    }
    // res.send(id);

    ToDo.findById(id).then( (todo) => {
        if (!todo) { //i.e. if no todo was returned...
            // console.log('The ToDo was not found');
            return res.status(404).send();
        }
        //if a todo is returned, send back the todo as the body of the response
        // console.log('User by ID:', JSON.stringify(todo, undefined, 2));
        res.send(todo);
    }).catch( (e) => {
        //don't send the error object here in .send() because it could include private information
        res.status(400).send();
        console.log('Some kind of error occurred', e.message);
    });
});

app.listen(3000, () => {
    console.log('Express app is running on port 3000');
});

module.exports = {app};