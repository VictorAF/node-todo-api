// const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'TodoApp';



MongoClient.connect(url, { useNewUrlParser: true }, (err, client)=>{
  if (err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  const db = client.db(dbName);

  db.collection('Todos').findOneAndUpdate({
    _id: new ObjectID('5b5b35da1de8d15ec1d6a095')
  }, {
    $set: {
      completed: true
    }
  }, {
    returnOriginal: false
  }).then((result)=>{
    console.log(result);
  });

  client.close();
});
