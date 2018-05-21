var tmi = require('tmi.js');
var request = require('request');
const express = require('express');
var http = require('http');

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
	var b = message.split('@'); //split at '@'
	if(b[1]){
		var a = b[1].substring(0, (process.env.USERNAME).length);

		if(a === process.env.USERNAME){ //SUSI is tagged
			// Setting options to make a successful call to SUSI API
			var options1 = {
				method: 'GET',
				url: 'http://api.susi.ai/susi/chat.json',
				qs:
				{
					timezoneOffset: '-300',
					q: b[1].substring((process.env.USERNAME).length + 1, b[1].length)
				}
			};

			request(options1, function(error, response, body) {
				if (error) throw new Error(error);
				if((JSON.parse(body)).answers[0])
					ans = userstate['display-name'] + " " + (JSON.parse(body)).answers[0].actions[0].expression;
				else
					ans = userstate['display-name'] + " Sorry, I could not understand what you just said."
				client.action(userChannel, ans);
			});
			//client.action(userChannel, message);
		}
	}
});

client.on('connected', function(address, port){
	//console.log(`Address: ${address}, Port: ${port}`);
	console.log("Heroku port: " + process.env.PORT);
	console.log("App port: " + port);
	client.action(userChannel, `Hi, I'm SUSI bot. To talk to me, please use '@${process.env.USERNAME}'`);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
   console.log(`listening on ${port}`);
});
