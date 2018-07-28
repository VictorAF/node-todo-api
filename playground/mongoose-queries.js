const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '5b5bc6e0d242653a9771e484';
var user_id = '5b5b63f5dff7512f72c3eb5c'

if(!ObjectID.isValid(id)){
  console.log('ID not valid');
}

Todo.find({
  _id: id
}).then((todos) => {
  console.log('Todos ', todos);
});

Todo.findOne({
  _id: id
}).then((todo) => {
  console.log('Todo ', todo);
});

Todo.findById(id).then((todo) => {
  if(!todo){
    return console.log('Id not found');
  }
  console.log('Todo by id ', todo);
}).catch((e) => console.log(e));

//User.findById
User.findById(user_id).then((user) => {
  if(!user){
    return console.log('User id not found');
  }
  console.log(JSON.stringify(user, undefined, 2));
}).catch((e) => console.log(e));
