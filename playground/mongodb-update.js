const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('Unable to connect to the database MongoDB server');
    }    
    console.log('Connected to MongoDB server');

    const db = client.db('ToDoApp');

    // db.collection('ToDos').findOneAndUpdate({
    //     _id: new ObjectID('5bf453d3910fe420a1e29ce9')
    // }, {
    //     //mongo db update operators: https://docs.mongodb.com/manual/reference/operator/update/set/#up._S_set
    //     $set: {
    //         completed: false
    //     }
    // }, {
    //     //should be returnNew: true?
    //     returnOriginal:false
    // }).then( (result) => {
    //     console.log(result);
    // });

    db.collection('Users').findOneAndUpdate({
        name: 'Stu'
    },{
        $set: {
            name: 'Frank'
        },
            $inc: {
                age: 1
            }
    }, {
        returnOriginal: false
    }).then( (result) => {
        console.log(result);
    });

    // db.collection('Users').findOneAndUpdate({
    //     name: 'Stu'
    // }, {
    //     $inc: {
    //         age: 1
    //     }
    // }, {
    //     returnOriginal: false
    // }).then( (result) => {
    //     console.log(result);
    // });
    

});