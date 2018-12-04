const mongoose  = require('mongoose');

//add the built-in promise library  - mongoose supports _callbacks_ by default
//"promises are easier to chain and scale"
//this line just needs to be in server.js
mongoose.Promise = global.Promise;

// { useMongoClient: true } added to options option b/c of the following error msg
// (node:23200) DeprecationWarning: `open()` is deprecated in mongoose >= 4.11.0, use `openUri()` instead, or set the `useMongoClient` option if using `connect()` or `createConnection()`. See http://mongoosejs.com/docs/4.x/docs/connections.html#use-mongo-client

mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true}).then( () => {
    console.log('Mongoose is connected to the mongoDB server');
}, (e) => {
    console.log('Mongoose is unable to connect to server', e);
});

module.exports = {mongoose};