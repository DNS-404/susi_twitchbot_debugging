var tmi = require('tmi.js');
var request = require('request');
const express = require('express');

const app = express();

const userChannel = process.env.CHANNEL;
//const port1 = process.env.PORT || 80;

setInterval(function() {
		http.get(process.env.HEROKU_URL);
	}, 300000);

var ans;

var options = {
	options: {
		debug: true
	},
	connection: {
		//port: 6667,
		reconnect: true
	},
	identity: {
		username: process.env.USERNAME,
		password: process.env.OAUTH_TOKEN
	},
	channels: [userChannel]
};

var client = new tmi.client(options);
// Connect the client to the server
client.connect();

client.on('chat', function(channel, userstate, message, self){

	// Setting options to make a successful call to SUSI API
	var options1 = {
		method: 'GET',
		url: 'http://api.susi.ai/susi/chat.json',
		qs:
		{
			timezoneOffset: '-300',
			q: message
		}
	};

	request(options1, function(error, response, body) {
		if (error) throw new Error(error);
		ans = (JSON.parse(body)).answers[0].actions[0].expression;
		client.action(userChannel, ans);
	});
	//client.action(userChannel, message);
});

client.on('connected', function(address, port){
	//console.log(`Address: ${address}, Port: ${port}`);
	console.log("Heroku port: " + process.env.PORT);
	console.log("App port: " + port);
	client.action(userChannel, "Welcome, I'm SUSI bot.");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
   console.log(`listening on ${port}`);
});
