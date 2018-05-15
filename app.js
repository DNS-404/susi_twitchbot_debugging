var tmi = require('tmi.js');
//var request = require('request');

//const userChannel = 'dns4044';
//const port1 = process.env.PORT || 80;
var ans;

var options = {
	options: {
		debug: true
	},
	connection: {
		//port: port1,
		cluster: "aws",
		reconnect: true
	},
	identity: {
		username: "susiaibot",
		password: 'oauth:u5et9ynm3m9l3iauj9xv0ambzuo9qk'
	},
	channels: ["dns4044"]
};

// Connecting to IRC
var client = new tmi.client(options);
client.connect();

client.on('chat', function(channel, userstate, message, self){
	client.action("dns4044", message);
});

client.on('connected', function(address, port){
	client.action("dns4044", "Hi I'm SUSI.");
});








/*
client.on('chat', function(channel, userstate, message, self) {
	// setting options to make a successful call to SUSI API
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
	})
	//console.log(ans);
});

client.on('connected', function(address, port) {
	client.action(userChannel, "Welcome, I'm SUSI.");
});*/
