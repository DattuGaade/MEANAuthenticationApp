const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// User Schema
const UserSchema = mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const User = module.exports = mongoose.model('User',UserSchema);
//arg1-'collection name'(i.e. table-name),arg2-schema name created above and
//also return reference for table/collection to work with them later

module.exports.getUserById = function(id,callback){
  User.findById(id,callback);
}

module.exports.getUserByUserName = function(username,callback){
  const query = {username:username};
  User.findOne(query,callback);
}

module.exports.addUser = function(newUser,callback) {
  bcrypt.genSalt(10,(err,salt) => {
    bcrypt.hash(newUser.password, salt, (err,hash) => {
      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);//Saving data to database
    });
  });
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null,isMatch);
  });
}
