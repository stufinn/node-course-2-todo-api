const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  });
});

var hashedPassword = '$2a$10$K7Sr1Fy3HLICepB6rd1sn.zZX9qKRL1H4g5FFt0ljLH14oAdayEje';

//lets you know if the plan value and the hashed value are equal to each other
// cpmare takes the hashedPassword that would be stored in the db, and takes the salt. It then applies the salt to the new plaintext pswd that we provide it here, and creates a new hash. If this new hash is the same as the hashed password, then we're good.

//What salting does is it makes each pswd + salt combination unique, so that even if someone decoded the pswd for one user, that knwoledge would not allow the intruder to decode other messages, because each of the salts is unique.  Prevents a brute-force attack.
bcrypt.compare('123abc!', hashedPassword, (err, result) => {
  console.log(result); // T or F
});

// var data = {
//   id: 10
// };

// var token = jwt.sign(data, '123abc');

// console.log(token);

// var decoded = jwt.verify(token, '123abc');

// console.log(decoded);
// jwt.verify



// var message = "I am user number 3";

// //result of hashing is actually an object but we'll convert it to a string
// var hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hashed message: ${hash}`);

// var data = {
//   id: 4
// };

// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data + 'somesecret')).toString()
// };

// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHash = SHA256(JSON.stringify(token.data + 'somesecret')).toString();

// if (resultHash === token.hash) {
//   console.log('data was not changed');
// } else {
//   console.log('Data was changed. Do not trust!');
// }