// define dependencies
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();

var encryptor = require('simple-encryptor')('SHH ITS A SECRET');

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync(process.env.NODE_ENV + '-db.json');
const db = low(adapter)

db.defaults({ users: [] }).write();

// configure bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(
  session({
    secret: "SHHH THIS IS A SECRET",
    resave: true,
    saveUninitialized: false
  })
);

app.post('/api/account', (req, res) => {
  let {email, fname, lname, password, dance, comments } = req.body;
  email = email.toLowerCase().trim();
  password = encryptor.encrypt(password);

  let user = {
    email,
    fname,
    lname,
    password,
    dance,
    comments
  }

  if (db.get('users').find({email: email}).value()) {
    res.status(400).send("User exists");
  } else {
    db.get('users').push(user).write();
    req.session.user = {
      email: email
    };
    req.session.user.expires = new Date(
      Date.now() + 3 * 24 * 3600 * 1000
    );
    res.send({success: true});
  }
})

app.post('/api/login', (req, res) => {
  let {email, password} = req.body;
  email = email.toLowerCase().trim();

  var foundUser = db.get('users').find({email}).value();
  if (foundUser && password  === encryptor.decrypt(foundUser.password)) {
    req.session.user = {
      email: email
    };
    req.session.user.expires = new Date(
      Date.now() + 3 * 24 * 3600 * 1000
    );
    res.send({success: true});
  } else {
    res.status(400).send("Invalid username/password");
  }
})

const authenticate = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(400).send('Unauthorized');
  }
}

app.get('/api/profile', authenticate, (req, res) => {
  let user = db.get('users').find({email: req.session.user.email}).value();
  res.send(user);
})

app.put('/api/profile', authenticate, (req, res) => {
  let {fname, lname, dance, comments, password} = req.body;

  let toAssign = {fname, lname, dance, comments};
  if (password !== "") {
    toAssign.password = encryptor.encrypt(password);
  }

  db.get('users').find({email: req.session.user.email}).assign(toAssign).write();

  res.send({success: true})
});

app.all('/api/logout', authenticate, (req, res) => {
  delete req.session.user; // any of these works
  	req.session.destroy(); // any of these works
    res.status(200).send('logout successful')
})

app.all('/api/amiloggedin', (req, res) => {
    res.status(200).send({success: req.session.user})
});

module.exports = app;
