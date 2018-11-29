const expect = require('expect'); /* https://github.com/mjackson/expect */
const request = require('supertest'); /* https://www.npmjs.com/package/supertest */

const{ObjectID} = require('mongodb');
const {app} = require('./../server');
const {ToDo} = require('./../models/todo');

//"testing lifecycle method", i.e. Hooks: https://mochajs.org/#hooks
//lets us run code before every single test case
// this makes sure database is empty or populated with sample data
//Is this a root level hook?: https://mochajs.org/#root-level-hooks
//YES - will run before every test case
const sampleTodo = [{
    text:"First sample todo",
    _id: new ObjectID()
  },
  {
    text:"Second sample todo",
    _id: new ObjectID(),
    completed: true,
    completedAt: 333
  },
  {
    text:"Third sample todo",
    _id: new ObjectID()
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
            ToDo.find({text}) //fetch only  todo with text from above
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
        .end( (err, res) => {  //function in end() allows us to run a function _asychronously_
          if (err) {
            return done(err);
            }
          ToDo.find().then( (todos) => {
            expect(todos.length).toBe(3); //make some assumptions about the database (should be 0) //** the lifecycle method will erase and repopulate the database BEFORE EACH TEST */
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

describe('GET /todos/:id', () => {

  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${sampleTodo[0]._id.toHexString()}`) // get ID from first item in todos object and convert ID to a string with .toHexString() method
      .expect(200)
      .expect( (res) => {
        // console.log(res.body);
        expect(res.body.todo.text).toBe(sampleTodo[0].text);
      })
      .end(done);
    });

    it('should return 404 if an ID is valid but it is not found', (done) => {
      request(app)
        .get(`/todos/${new ObjectID().toHexString()}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 if invalid ID is provided', (done) => {
      request(app)
        .get(`/todos/12345`)
        .expect(404)
        .end(done);
    });

});

describe('DELETE /todos/:id', () => {

  it('should delete a todo by id', (done) => {
    var hexID = sampleTodo[1]._id.toHexString();
    request(app)
    .delete(`/todos/${hexID}`) // get ID from _second_ item in todos object and convert ID to a string with .toHexString() method
    .expect(200)
    .expect( (res) => {
      expect(res.body.todo._id).toBe(hexID);
      // expect(res.length).toBe(1);
    })
    .end( (error, res) => {
      if (error) {
        return done(error);
      }
      //query db to confirm that the item doesn't exist there anymore
      ToDo.findById(hexID).then( (todo) => {
        expect(todo).toNotExist();
        done();
      }).catch( (e) => done(e) );
    });
  });

  it('should return 404 if todo not found', (done) => {
    var newID = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${newID}`) //try to delete item with a valid, but non-existent ID
      .expect(404)
      .end(done);
  });

  it('should return 404 if todo not valid', (done) => {
    request(app)
      .delete(`/todos/1245abc`) //try to delete item with an ivalid, but non-existent ID
      .expect(404)
      .end(done);
  });

});

  describe('PATCH /todos/:id', () => {

    it('Should update todo', (done) => {
      //get id of first item
      var hexID = sampleTodo[0]._id.toHexString();
      request(app)
        .patch(`/todos/${hexID}`)
        //send data in request body
        //update text, set completed to true
        .send({ text: "test text", completed: true })
        //200
        .expect(200)
        //custom insertion verifies that text == text I sent
        //verify compelted is True
        //verify completed in a number
        .expect( (res) => {
          expect(res.body.todo.text).toBe("test text");
          expect(res.body.todo.completed).toBe(true);
          // console.log('Completed at:',res.body.todo.completedAt);
          expect(res.body.todo.completedAt).toBeA('number');
        }).end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
      var hexID = sampleTodo[1]._id.toHexString();
      request(app)
      // grab ID of second todo item
        .patch(`/todos/${hexID}`)
        //update text to something different
        //set completed to false
        .send({text: 'something different', completed: false})
        //expect 200
        .expect(200)
        .expect( (res) => {
          //text is change, completed false, completed at is null (.toNotExist)
          expect(res.body.todo.text).toBe('something different');
          expect(res.body.todo.completed).toBe(false);
          expect(res.body.todo.completedAt).toNotExist();
        }).end(done);

    });
      
      
      
      
      

  });