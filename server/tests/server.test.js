const expect = require('expect'); /* https://github.com/mjackson/expect */
const request = require('supertest'); /* https://www.npmjs.com/package/supertest */

const {app} = require('./../server');
const {ToDo} = require('./../models/todo');

//"testing lifecycle method", i.e. Hooks: https://mochajs.org/#hooks
//lets us run code before every single test case
// this makes sure database is empty
//Is this a root level hook?: https://mochajs.org/#root-level-hooks
//YES - will run before every test case
beforeEach( 'clear todos data for test', (done) => {
    ToDo.remove({}).then( () => done() );
});

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
          .end( (error, res) => {  // https://www.npmjs.com/package/supertest
            if (error) {
                return done(error);
            }
            //fetch all the todos from the database and check that the number we expect are actually there
            //ToDo.find fetches every single todo inside of the _collection_
            ToDo.find().then( (todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch( (e) => done(e));
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
            expect(todos.length).toBe(0); //make some assumptions about the database (should be 0) //** the lifecycle method will erase the database before each test */
            done();
          }).catch( (e) => done(e) );
        });
        
        
        done();
    });
});