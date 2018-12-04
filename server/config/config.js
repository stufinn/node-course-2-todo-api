var env = process.env.NODE_ENV || 'development'; //sets to development by default bc if we're on development it won't be set, but it will be set in production (Heroku) and test environments (see package.json test script)
console.log('env ******', env);

if (env === 'development') {
    //set up mongodb URL
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/ToDoApp';
} else if (env === 'test') {
    // set up a custom database URL
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/ToDoAppTest';
}