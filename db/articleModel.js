var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var articleSchema = new Schema({
title:  String,
content: String,
date: Number,
author: String
});

var articleModel = mongoose.model('articles', articleSchema);

module.exports=articleModel;