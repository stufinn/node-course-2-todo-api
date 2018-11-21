var express = require('express');
var bodyParser = require('body-parser');

//desructuring vvv
var {mongoose} = require('./db/mongoose');
var {ToDo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

//configure middleware
//with this, can send json data to our application
app.use(bodyParser.json());

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
    })

});

app.listen(3000, () => {
    console.log('Express app is running on port 3000');
});