const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', {useNewUrlParser: true}, (err, client) => {
    if (err) {
        return console.log('Unable to connect to the MongoDB server', err);
    }
    console.log('Connected to the MongoDB server');

    const db = client.db('ToDoApp');

    // db.collection('ToDos').deleteMany({text: 'Eat lunch'}).then((result) => {
    //     console.log(result);
    // });

    // db.collection('ToDos').deleteOne({text: 'Eat lunch'}).then((result) => {
    //     console.log(JSON.stringify(result, undefined, 2) );
    // });

    // db.collection('ToDos').findOneAndDelete({completed:false}).then( (result) => {
    //     console.log(result);
    // });

    // CHALLENGE:

    // db.collection('Users').findOneAndDelete({_id: new ObjectID('5bf30be9b2649a1ddfb9fda0')}).then( (result) => {
    //     console.log(JSON.stringify(result, undefined, 2));
    // });

    db.collection('Users').deleteMany({name:'Stu'}).then( (result) => {
        console.log(JSON.stringify(result, undefined, 2));
    });
   
    //findone and delete
    //allows you to delete one and returns those values

     //close connection with MongoDB server
    // db.close()

});