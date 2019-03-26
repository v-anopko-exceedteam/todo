const express      = require('express'),
      app          = express(),
      MongoClient  = require('mongodb').MongoClient,
      todoDbClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });

let dbClient;

todoDbClient.connect((err, client) => {
  if (err) return console.log(err);

  const db = client.db('todoDB'),
        collection = db.collection('listItem');

  app.locals.collection = collection;
  dbClient = client;

  app.listen(3001, () => {
    console.log('Server is runing!');
  });
});

app.use((req, res, next) => { // permission for cross-domain requests
  res.append('Access-Control-Allow-Origin', ['*']);
  next();
});

app.get('/', (req, res) => { // handler for send of all todo items
  const collection = req.app.locals.collection;

  collection.find().toArray((err, todoItems) => {
    if (err) return console.log(err);

    res.send(todoItems);
  });
});

app.get('/add/:element', (req, res) => { // handler fot add new todo item in DB
  const newElem    = JSON.parse(req.params.element),
        collection = req.app.locals.collection;

  collection.insertOne(newElem);
});

process.on("SIGINT", () => {
  dbClient.close();
  process.exit();
});
