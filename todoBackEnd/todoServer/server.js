const express      = require('express'),
      app          = express(),
      mongoDb      = require('mongodb'),
      MongoClient  = mongoDb.MongoClient,
      todoDbClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true }),
      bodyParser   = require('body-parser'),
      bcrypt       = require('bcrypt');

let dbClient;

todoDbClient.connect((err, client) => {
  if (err) return console.log(err);

  const db = client.db('todoDB'),
        listItemCollection = db.collection('listItem'),
        usersCollection = db.collection('users');

  app.locals.listItemCollection = listItemCollection;
  app.locals.usersCollection = usersCollection;
  dbClient = client;

  app.listen(3001, () => {
    console.log('Server is runing!');
  });
});

app.use((req, res, next) => { // permission for cross-domain requests
  res.append('Access-Control-Allow-Origin', ['*']);
  next();
});

app.use(bodyParser.text());

app.post('/', (req, res) => { // handler for send of all todo items
  if (!req.body) return res.sendStatus(400);

  const listItemCollection = req.app.locals.listItemCollection,
        userId = req.body;

  listItemCollection.find({userId}).toArray((err, todoItems) => {
    if (err) return console.log(err);

    res.send(todoItems);
  });
});

app.get('/add/:element', (req, res) => { // handler fot add new todo item in DB

  const newElem = JSON.parse(req.params.element),
        listItemCollection = req.app.locals.listItemCollection;

  listItemCollection.insertOne(newElem, (err, result) => {
    if (err) return console.log(err);

    const [addedItem] = result.ops;

    res.send(addedItem);
  });
});

app.get('/delete/:idToDelete', (req, res) => { // handler for delete item from DB
  const listItemCollection = req.app.locals.listItemCollection,
        elementId  = new mongoDb.ObjectID(req.params.idToDelete);

  listItemCollection.deleteOne({_id: elementId}, (err, result) => {
    if (err) return console.log(err);
  });
});

app.get('/update/:idToUpdate', (req, res) => { // handler for update todo item

  const listItemCollection = req.app.locals.listItemCollection,
        newElem    = JSON.parse(req.params.idToUpdate),
        newElemId  = new mongoDb.ObjectID(newElem._id);

  listItemCollection.updateOne(
    {_id: newElemId},
    {$set: {done: newElem.done, important: newElem.important}}
  );
});

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
process.on("SIGINT", () => {
  dbClient.close();
  process.exit();
});
