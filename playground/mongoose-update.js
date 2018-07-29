const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}) -> everything removed

// Todo.remove({}).then((result) => {
//   console.log(result);
// });

//Todo.findOneAndRemove()
//Todo.findByIdAndRemove

// Todo.findByIdAndRemove('5b5c83ab72dc4eb260726a9f').then((todo) => {
//   console.log(todo);
// });
