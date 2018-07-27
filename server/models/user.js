var mongoose = require('mongoose');
// USER
// email - require it - trim it - set type - set min lenght of 1
var User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    minLenght: 1,
    trim: true
  }
});

module.exports = {User};
