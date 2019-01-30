// import user model from users.js
var {User} = require('./../models/user');


//create middleware for finding user by token
var authenticate = (req, res, next) => {
  var token = req.header('x-auth');

  User.findByToken(token).then( (user) => {

      if (!user) {
          //if the token was ok, but no user was found with matching properties
          return Promise.reject();
      }
      // if all goes well and we have a valid user
     //  res.send(user);
      // Instead of of sending the user, the middleware will modify the request object.  Therefore we will be able to use the modified request object inside of the route down below
     //we are modifying the request object
     //we'll be able to use the modifie
     //we want to use the modified
     //set request properties
     req.user = user; // set request.user equal to the user we just found
     req.token = token; // set equal to the token up above
     next(); // allows the route below to execute
  }).catch( (e) => {
      // failed to authorize. Send error status with empty body
      res.status(401).send();
      // next not called in here b/c we don't want to continue down below if the authentication fails
  });
};

module.exports = {authenticate};