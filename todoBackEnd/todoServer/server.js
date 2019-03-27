const express      = require('express'),
      app          = express(),
      mongoDb      = require('mongodb'),
      MongoClient  = mongoDb.MongoClient,
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

  collection.insertOne(newElem, (err, result) => {
    if (err) return console.log(err);

    const [addedItem] = result.ops;

    res.send(addedItem);
  });
});

app.get('/delete/:idToDelete', (req, res) => { // handler for delete item from DB
  const collection = req.app.locals.collection,
        elementId  = new mongoDb.ObjectID(req.params.idToDelete);

  collection.deleteOne({_id: elementId}, (err, result) => {
    if (err) return console.log(err);
  });
});

app.get('/update/:idToUpdate', (req, res) => { // handler for update todo item
  const collection = req.app.locals.collection,
        newElem    = JSON.parse(req.params.idToUpdate),
        newElemId  = new mongoDb.ObjectID(newElem._id);

  collection.updateOne(
    {_id: newElemId},
    {$set: {done: newElem.done, important: newElem.important}}
  );
});

process.on("SIGINT", () => {
  dbClient.close();
  process.exit();
});
