const express      = require('express'),
      app          = express(),
      mongoDb      = require('mongodb'),
      MongoClient  = mongoDb.MongoClient,
<<<<<<< HEAD
      todoDbClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });
=======
      todoDbClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true }),
      bodyParser   = require('body-parser'),
      bcrypt       = require('bcrypt');
>>>>>>> fd085e04da32cadfdeefdab376484fb59f027bb1

let dbClient;

todoDbClient.connect((err, client) => {
  if (err) return console.log(err);

  const db = client.db('todoDB'),
<<<<<<< HEAD
        collection = db.collection('listItem');

  app.locals.collection = collection;
=======
        listItemCollection = db.collection('listItem'),
        usersCollection = db.collection('users');

  app.locals.listItemCollection = listItemCollection;
  app.locals.usersCollection = usersCollection;
>>>>>>> fd085e04da32cadfdeefdab376484fb59f027bb1
  dbClient = client;

  app.listen(3001, () => {
    console.log('Server is runing!');
  });
});

app.use((req, res, next) => { // permission for cross-domain requests
  res.append('Access-Control-Allow-Origin', ['*']);
  next();
});

<<<<<<< HEAD
app.get('/', (req, res) => { // handler for send of all todo items
  const collection = req.app.locals.collection;

  collection.find().toArray((err, todoItems) => {
=======
app.use(bodyParser.text());

app.post('/', (req, res) => { // handler for send of all todo items
  if (!req.body) return res.sendStatus(400);

  const listItemCollection = req.app.locals.listItemCollection,
        userId = req.body;

  listItemCollection.find({userId}).toArray((err, todoItems) => {
>>>>>>> fd085e04da32cadfdeefdab376484fb59f027bb1
    if (err) return console.log(err);

    res.send(todoItems);
  });
});

app.get('/add/:element', (req, res) => { // handler fot add new todo item in DB
<<<<<<< HEAD
  const newElem    = JSON.parse(req.params.element),
        collection = req.app.locals.collection;

  collection.insertOne(newElem, (err, result) => {
=======

  const newElem = JSON.parse(req.params.element),
        listItemCollection = req.app.locals.listItemCollection;

  listItemCollection.insertOne(newElem, (err, result) => {
>>>>>>> fd085e04da32cadfdeefdab376484fb59f027bb1
    if (err) return console.log(err);

    const [addedItem] = result.ops;

    res.send(addedItem);
  });
});

app.get('/delete/:idToDelete', (req, res) => { // handler for delete item from DB
<<<<<<< HEAD
  const collection = req.app.locals.collection,
        elementId  = new mongoDb.ObjectID(req.params.idToDelete);

  collection.deleteOne({_id: elementId}, (err, result) => {
=======
  const listItemCollection = req.app.locals.listItemCollection,
        elementId  = new mongoDb.ObjectID(req.params.idToDelete);

  listItemCollection.deleteOne({_id: elementId}, (err, result) => {
>>>>>>> fd085e04da32cadfdeefdab376484fb59f027bb1
    if (err) return console.log(err);
  });
});

app.get('/update/:idToUpdate', (req, res) => { // handler for update todo item
<<<<<<< HEAD
  const collection = req.app.locals.collection,
        newElem    = JSON.parse(req.params.idToUpdate),
        newElemId  = new mongoDb.ObjectID(newElem._id);

  collection.updateOne(
=======

  const listItemCollection = req.app.locals.listItemCollection,
        newElem    = JSON.parse(req.params.idToUpdate),
        newElemId  = new mongoDb.ObjectID(newElem._id);

  listItemCollection.updateOne(
>>>>>>> fd085e04da32cadfdeefdab376484fb59f027bb1
    {_id: newElemId},
    {$set: {done: newElem.done, important: newElem.important}}
  );
});

<<<<<<< HEAD
=======
// sign in and registration

app.post('/registration', (req, res) => {
  if (!req.body) return response.sendStatus(400);

  const usersCollection = req.app.locals.usersCollection,
        userInfo  = JSON.parse(req.body),
        {login: userLogin,
         name: userName,
         secret: userSecret} = userInfo,
         registrationError = {showMessage: true, success: false, registrationDescription: 'Во время регистрации произошла ошибка.'};

  usersCollection.findOne({login: userLogin})
                 .then((findResult) => {
                    if (findResult) {
                      return res.send({showMessage: true, success: false, registrationDescription: `Пользователь с логином "${userLogin}" уже зарегистрирован.`});
                    } else {
                      bcrypt.genSalt(10, (err, salt) => {
                        if (err) return res.send(registrationError);

                        bcrypt.hash(userSecret, salt, (err, hash) => {
                          if (err) return res.send(registrationError);

                          usersCollection.insertOne({...userInfo, secret: hash})
                                         .then((insertResult) => res.send({showMessage: true, success: true, registrationDescription: 'Регистрация прошла успешно.'}))
                                         .catch((insertErr) => res.send(registrationError));
                        });
                      });
                    }
                 })
                 .catch((findErr) => res.send(registrationError));
});

app.post('/sign_in', (req, res) => {
  if (!req.body) return response.sendStatus(400);

  const {login, secret}      = JSON.parse(req.body),
        usersCollection      = req.app.locals.usersCollection,
        signInError          = {userId: '', showMessage: true, success: false, signInDescription: 'При входе в систему произошла ошибка.'},
        loginOrPasswordError = {userId: '', showMessage: true, success: false, signInDescription: 'Неправильно введен логин или пароль.'};

  usersCollection.findOne({login: login})
                 .then(({_id, name, login, secret: secretFromDB}) => {
                   if (secret) {
                     bcrypt.compare(secret, secretFromDB, function(err, compareResult) {
                        if (err) return res.send(signInError);

                        if (compareResult) {
                          return res.send({userId: _id, showMessage: false, success: true, signInDescription: ''});
                        } else {
                          return res.send(loginOrPasswordError);
                        }
                     });
                   } else {
                     return res.send(loginOrPasswordError);
                   }
                 })
                 .catch((err) => res.send(signInError));
});
>>>>>>> fd085e04da32cadfdeefdab376484fb59f027bb1
process.on("SIGINT", () => {
  dbClient.close();
  process.exit();
});
