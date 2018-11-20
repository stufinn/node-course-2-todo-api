const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', {useNewUrlParser: true}, (err, client) => {
    if (err) {
        return console.log('Unable to connect to the MongoDB server');
    }
    console.log('Connected to the MongoDB server');

    const db = client.db('ToDoApp');


    //toArray() returns a promise
    
    // db.collection('ToDos').find({
    //     _id: new ObjectID('5bf308a021b6bc1dc261ab6a')
    // }).toArray().then( (docs) => {
    //     console.log('Incomplete ToDos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('Unable to fetch todos', err);
    // });

    // db.collection('ToDos').countDocuments().then( (count) => {
    //     console.log(`ToDos count: ${count}`);
        
    // }, (err) => {
    //     console.log('Unable to fetch todos', err);
    // });

    db.collection('Users').find({name:'Stu'}).toArray().then( (docs) => {
        console.log('Entries for Stu');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch user data');
    });

    //close connection with MongoDB server
    // db.close()
});





