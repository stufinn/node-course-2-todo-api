var env = process.env.NODE_ENV || 'development'; //sets to development by default bc if we're on development it won't be set, but it will be set in production (Heroku) and test environments (see package.json test script)
console.log('env ******', env);

// When using heroku, env is automatically set by heroku to production so neither of these if statements will run.
// The environment varable process.env.NODE_ENV is set in the package.json file's scripts section
if (env === 'development') {
    //set up mongodb URL
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/ToDoApp';
} else if (env === 'test') {
    // set up a custom database URL
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/ToDoAppTest';
}

//what about moduk.exports?  looks like server.js just req'd the whole file