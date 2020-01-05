var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
username:  String,
password: String,
date: Number
});

var userModel = mongoose.model('users', userSchema);

module.exports=userModel;

