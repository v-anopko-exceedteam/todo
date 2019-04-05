const express      = require('express'),
      app          = express(),
      mongoDb      = require('mongodb'),
      MongoClient  = mongoDb.MongoClient,
      todoDbClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true }),
      bodyParser   = require('body-parser'),
      bcrypt       = require('bcrypt'),
      jwt          = require('jsonwebtoken'),
      secretKey    = 'h4J8u8H3';

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
  if (!req.body) return res.sendStatus(302);

  const listItemCollection = req.app.locals.listItemCollection,
        userId = req.body;

  listItemCollection.find({userId}).toArray((err, todoItems) => {
    if (err) return console.log(err);

    res.send(todoItems);
  });
});

app.post('/check_token', (req, res) => { // handler for send of all todo items
  if (!req.body || typeof req.body !== 'string') return res.send({message: 'Token is undefind'});

  const usersCollection = req.app.locals.usersCollection,
        token = req.body,
        userId = new mongoDb.ObjectID(jwt.verify(token, secretKey).userId);

  usersCollection.findOne({_id: userId})
                 .then((user) => {
                    if (user) {
                      res.send({userId: user._id});
                    } else {
                      res.send('');
                    }
                 })
                 .catch((err) => res.send(''));
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

    res.send(true);
  });
});

app.get('/update/:idToUpdate', (req, res) => { // handler for update todo item

  const listItemCollection = req.app.locals.listItemCollection,
        newElem    = JSON.parse(req.params.idToUpdate),
        newElemId  = new mongoDb.ObjectID(newElem._id);

  try {
    listItemCollection.updateOne(
      {_id: newElemId},
      {$set: {done: newElem.done, important: newElem.important}}
    );

    res.send(true);
  } catch (err) {
    res.send(err);
  }
});

// sign in and registration

app.post('/registration', (req, res) => {
  if (!req.body) return response.sendStatus(400);

  const usersCollection = req.app.locals.usersCollection,
        userInfo  = JSON.parse(req.body),
        {login: userLogin,
         name: userName,
         secret: userSecret} = userInfo,
         registrationError = {showMessage: true, success: false, registrationDescription: 'An error occurred during registration.'};

  usersCollection.findOne({login: userLogin})
                 .then((findResult) => {
                    if (findResult) {
                      return res.send({showMessage: true, success: false, registrationDescription: `User with login "${userLogin}" is already registered.`});
                    } else {
                      bcrypt.genSalt(10, (err, salt) => {
                        if (err) return res.send(registrationError);

                        bcrypt.hash(userSecret, salt, (err, hash) => {
                          if (err) return res.send(registrationError);

                          usersCollection.insertOne({...userInfo, secret: hash})
                                         .then((insertResult) => res.send({showMessage: true, success: true, registrationDescription: 'Registration completed successfully.'}))
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
        signInError          = {userId: '', showMessage: true, success: false, signInDescription: 'Error log in.'},
        loginOrPasswordError = {userId: '', showMessage: true, success: false, signInDescription: 'Incorrect username or password.'};

  usersCollection.findOne({login: login})
                 .then(({_id, name, login, secret: secretFromDB}) => {
                   if (secret) {
                     bcrypt.compare(secret, secretFromDB, function(err, compareResult) {
                        if (err) return res.send(signInError);

                        if (compareResult) {
                          const token = jwt.sign({ userId: _id }, secretKey, { expiresIn: 60 * 60 });

                          return res.send({userId: _id, showMessage: false, success: true, signInDescription: '', token: token});
                        } else {
                          return res.send(loginOrPasswordError);
                        }
                     });
                   } else {
                     return res.send(loginOrPasswordError);
                   }
                 })
                 .catch((err) => res.send(loginOrPasswordError));
});

process.on("SIGINT", () => {
  dbClient.close();
  process.exit();
});
