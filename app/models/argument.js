var mongoose = require('mongoose');

var argumentSchema = mongoose.Schema({
  author : {
    email : String,
  },
  title : String,
  argument : String
})

module.exports = mongoose.model('Argument', argumentSchema);
