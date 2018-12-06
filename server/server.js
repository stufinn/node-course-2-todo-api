require('./config/config')

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

//desructuring vvv
const {ObjectID} = require('mongodb'); //import ObjectID module from mongoDB library
const {mongoose} = require('./db/mongoose');
const {ToDo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();
const port = process.env.PORT;

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
        res.send({todo});
    }).catch( (e) => {
        //don't send the error object here in .send() because it could include private information
        res.status(400).send();
        console.log('Some kind of error occurred', e.message);
    });
});

//DELETE route

app.delete('/todos/:id', (req, res) => {
    
    //get the ID
    //req.params is where all of our url parameters are stored
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    ToDo.findByIdAndRemove(id).then( (todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }).catch( (e) => {
        res.status(400).send();
        console.log('Some kind of error occured', e.message);
    });

    //validate the ID --> not valid? return a 404

    //remove todo by ID
        //success
            //if no doc, send 404
            //if doc, send doc back with a 200
        //error - 400 with empty body
});


//Update todo items
//REVIEW THIS

app.patch('/todos/:id', (req,res) => {
    var id = req.params.id;
    // _.pick() method specifies which of the properties we want associate with the body variable and therefore, the only ones that the user can manipulate (and can't add new ones)
    //e.g. the can't edit "completedAt"
    var body = _.pick(req.body, ['text', 'completed']);
    
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    //check the completed value, and if needed set "completedAt"
    // console.log(req);
    // console.log(req.body);


    if (_.isBoolean(body.completed) && body.completed) { // i.e. is body.completed a boolean AND is it true
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null; //removes value from the DB
    }

    ToDo.findByIdAndUpdate(id, {
        $set: body
    }, {
        new: true
    }).then( (todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }).catch( (e) => {
        res.status(400).send();
    });

});

// POST /users
//add a new user

app.post('/users', (req,res) => {

    var body = _.pick(req.body, ['email', 'password']);

    // var user = new User({
    //     email: body.email,
    //     password: body.password
    // });

    //alternative to above:

    var user = new User(body);

    // User.findByToken
    // user.generateAuthToken

    user.save().then( () => {
        //added return bc we're expecting a chaining promise
        return user.generateAuthToken();
        // res.status(200).send(user);
    }).then( (token) => {

        // *** send token back as an http response header ***
        res.header('x-auth', token).send(user);
    }).catch( (e) => {
        res.status(400).send(e);
    });
});

app.listen(port, () => {
    console.log(`Started up on port ${port}`);
});

module.exports = {app};