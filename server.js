/*
 * Imports 
 */
var fs = require("fs"); //Import tools for manipulating filesystem
var WebServer = require("./webserver");
var WebsocketServer = require("./websocketserver");
var Client = require("./client");
var Households = require("./households");

var portWebserver = 8080;
var portWebsocket = 5560;

/*
 * Server
 */
var Server = {
	clients : [],
	start : function() {
		WebServer.start(portWebserver);
		WebsocketServer.start(portWebsocket, this);
		Households.load();
		Households.init();
	},
	newClient : function(conn) {
		this.clients.push(new Client(conn, this));
	},
	deleteClient : function(client) {
		//TODO: Remove this client from the list of active clients
	},
	households: Households
};
/*
 * Main
 */
Server.start();
