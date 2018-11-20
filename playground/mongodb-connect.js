// const MongoClient = require('mongodb').MongoClient;

//using destructuring instead of alternative above
const {MongoClient, ObjectID} = require('mongodb');

//in V2 of mongo, callback function needed (err, db) - no requires (err, client)
MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
    if (err) {
        //using return just prevents the rest of the fxn from executing ***
        // alternatively can use else clause
        return console.log('Unable to connect to the database MongoDB server');
    }
    console.log('Connected to MongoDB server');

    // get reference for todo app database
    const db = client.db('ToDoApp');

    // db.collection('ToDos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if(err) {
    //         return console.log('Unable to insert ToDo', err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    // Insert new doc into the Users collection (name, age, location)
    //error hangling and print to screen

    db.collection('Users').insertOne({
        name: 'Stu',
        age: 37,
        location: 'Sioux Lookout, ON'
    }, (err,result) => {
        if (err) {
            return console.log('Unable to add user to the collection', err);
        }
        console.log(result.ops[0]._id.getTimestamp());
    });

    //close connection with MongoDB server
    client.close();
});