var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userShema = mongoose.Shema({
  local: {
    name: {type:String, required: true},
    password: String
  },
});

userShema.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8),null);
};

userShema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userShema);
