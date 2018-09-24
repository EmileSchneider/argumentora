var mongoose = require('mongoose');

var argumentSchema = mongoose.Schema({
  author : {
    first_name : String,
    last_name : String
  },
  title : String,
  argument : String
})

module.exports = mongoose.model('Argument', argumentSchema);
