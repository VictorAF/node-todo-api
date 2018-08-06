require('./config/config');

const _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');


var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// POST /todos
app.post('/todos', authenticate, (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then((doc)=>{
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  })
});

// GET /todos
app.get('/todos', authenticate, (req, res) =>{
  Todo.find({_creator: req.user._id}).then((todos) =>{
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

// GET /todos/1234123
app.get('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;

  //Valid id using isValid
  if(!ObjectID.isValid(id)){
    return res.status(404).send(); //Send empty body
  }
    // 404 - send back empty send

  //findById
  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo) =>{
    if(!todo){
      return res.status(404).send({});
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
    //Success
      //if todo - send it back
      //if no todo - send back 404 with empty body
    //error
      //400 - and send empty body back
});

app.delete('/todos/:id', authenticate,(req, res) =>{
  var id = req.params.id;

  //Valid id using isValid
  if(!ObjectID.isValid(id)){
    return res.status(404).send(); //Send empty body
  }
    // 404 - send back empty send

  //findById
  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((todo) =>{
    if(!todo){
      return res.status(404).send({});
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.patch('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  //Valid id using isValid
  if(!ObjectID.isValid(id)){
    return res.status(404).send(); //Send empty body
  }

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  } else{
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

// POST /users

app.post('/users', (req, res) => {

  var user_body = _.pick(req.body, ['email', 'password']);
  var user = new User(user_body);

  user.save().then(() =>{
    return user.generateAuthToken(); // the same above
    // res.send(created_user);
  }).then((token)=>{
    res.header('x-auth', token).send(user); //the same above
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

// POST /users/login {email, password}
// We are not using authenticate, because you don't have a token, you want one
app.post('/users/login', (req, res) =>{
  var user_body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(user_body.email, user_body.password).then((user)=>{
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e)=>{
    res.status(400).send();
  });

});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  })
});

module.exports = {app};

// newTodo.save().then((doc)=>{
//   console.log('Saved todo', doc);
// }, (e) => {
//   console.log('Unable to save todo');
// });

// otherTodo.save().then((doc) => {
//   console.log(JSON.stringify(doc, undefined, 2));
// }, (e) => {
//   console.log('Unable to save', e);
// });
