var serverUrl = process.argv[2] || "localhost";
var startup = require('./app/startup.js');
startup.initialize(serverUrl);
