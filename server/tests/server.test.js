const expect = require('expect'); /* https://github.com/mjackson/expect */
const request = require('supertest'); /* https://www.npmjs.com/package/supertest */

const {app} = require('./../server');
const {ToDo} = require('./../models/todo');

//"testing lifecycle method", i.e. Hooks: https://mochajs.org/#hooks
//lets us run code before every single test case
// this makes sure database is empty or populated with sample data
//Is this a root level hook?: https://mochajs.org/#root-level-hooks
//YES - will run before every test case
const sampleTodo = [{
    text:"First sample todo"
  },
  {
    text:"Second sample todo"
  },
  {
    text:"Third sample todo"
}];

beforeEach( 'clear todos data for test', (done) => {
    ToDo.remove({}).then( () => {
      return ToDo.insertMany(sampleTodo);
    }).then( () => done() );
});

// End of lifecycle method

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';

        //using supertest
        request(app)
          .post('/todos')
          .send({text}) //ES6 syntax to send the contents of "text" in an object with a property of the same name.  Also, supertest *will convert this to JSON automatically*
          .expect(200)
          .expect( (res) => {
            expect(res.body.text).toBe(text)
          })
          //we want to check what got stored in the mongoDB collection
          //callback fxn allows us to do a few things
          .end( (error, res) => {  // https://www.npmjs.com/package/supertest
            if (error) {
                return done(error);
            }
            //fetch all the todos from the database and check that the number we expect are actually there
            //ToDo.find fetches every single todo inside of the _collection_
            ToDo.find({text}) //fetch ALL todos from the DB
                .then( (todos) => {
                  expect(todos.length).toBe(1);
                  expect(todos[0].text).toBe(text);
                  done(); //wraps up the test case
                })
                .catch( (e) => done(e));//this will catch any erros that occur inside of our callback
          });
    });

    it('should not create todo with invalid body data', (done) => {
        
        request(app)
        .post('/todos')
        .send({}) //pass in nothing at all
        .expect(400) //expect 400 error
        .end( (err, res) => {
          if (err) {
            return done(err);
            }
          ToDo.find().then( (todos) => {
            expect(todos.length).toBe(3); //make some assumptions about the database (should be 0) //** the lifecycle method will erase the database before each test */
            done();
          }).catch( (e) => done(e) );
        });
    });
});

describe('GET /todos route', () => {
  it('should get all todos', (done) => {
    request(app)
    .get('/todos')
    .expect(200)
    .expect( (res) => {
      expect(res.body.todos.length).toBe(3);
    })
    .end(done);

  });
});