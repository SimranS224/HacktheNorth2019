const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const fs = require('fs');
const nconf = require('nconf');
nconf.file({file:'./config/config.json'});
const firebaseController = require('./controllers/firebaseController');

// use bodyParser middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/user/:userId', firebaseController.getUser);

app.post('/user/:username', firebaseController.createUser);

app.patch('/user/:userId', firebaseController.incrementScore);

app.put('/user/:userId', firebaseController.updateUser);

app.listen(8000, () => {
  console.log('Hack the North 2019 app listening on port 8000!')	
});