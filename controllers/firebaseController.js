const firebase = require('firebase');
const nconf = require('nconf');
const app = firebase.initializeApp(nconf.get('firebaseConfig'));

function getUser(req, res) {
	console.log('Fetching details for user with ID#' + req.params.userId);
	return firebase.database().ref('/users/' + req.params.userId).once('value')
		.then((snapshot) => {
	  		res.send(snapshot.val());
		})
		.catch((err) => {
			console.log(`ERR: Fetching user with ID#${req.params.userId} failed with error ${err}`);
		});
}

function createUser(req, res) {
	const username = req.params.username;
	console.log('Creating user with username ' + username);

	const postBody = {
		username: username,
		score: 0,
		action: ''
	};
	// get a new key for POST
	const newPostKey = firebase.database().ref().child('users').push().key;

	// create list of items to update
	let updates = {};
	updates['/users/' + newPostKey] = postBody;

  	return firebase.database().ref().update(updates)
  		.then(() => {
  			res.status(201).send();
  		})
  		.catch((err) => {
  			console.log(`ERR: Creation of user with username ${req.params.username} failed with error + ${err}`);
  			res.status(500).send();
  		});
}

async function incrementScore(req, res) {
	const userId = req.params.userId;
	console.log('Incrementing score for user with ID#' + userId);
	let initialData;	// stores initial data prior to incrementing of score
	await firebase.database().ref('/users/' + userId).once('value')
		.then((snapshot) => {
	  		initialData = snapshot.val()
		})
		.catch((err) => {
			console.log(`ERR: Fetching user with ID#${userId} failed with error ${err}`);
			res.status(500).send();
		});

	// create list of items to update
	let updates = {};
	updates['/users/' + userId] = {...initialData, score: initialData.score + 1};
	return firebase.database().ref().update(updates)
		.then(() => {
			res.status(200).send();
		})
		.catch((err) => {
			console.log(`ERR: Creation of user with username ${req.params.username} failed with error + ${err}`);
  			res.status(500).send();
		});
}

function updateUser(req, res) {
	const userId = req.params.userId;
	console.log('Updating user with ID#' + userId);
	const updateBody = req.body;
	// create list of items to update
	let updates = {};
	updates['/users/' + userId] = updateBody;
	return firebase.database().ref().update(updates)
		.then(() => {
			res.status(200).send();
		})
		.catch((err) => {
			console.log(`ERR: Creation of user with username ${req.params.username} failed with error + ${err}`);
  			res.status(500).send();
		});
}

module.exports = {
	getUser: getUser,
	createUser: createUser,
	incrementScore: incrementScore,
	updateUser: updateUser
};