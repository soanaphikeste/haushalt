/*
 * Includes
 */
var User = require("./user");
/*
 * One single household
 */
function Household(name, password) {
	this.data = { //Everything in this subobject will be saved. Everything else will NOT!
		name : name,
		password : password
	};
	this.changed = true;
	this.users = {}; //Will be saved
	this.sockets = [];
}

Household.prototype = {
	checkPassword : function(password) {
		return this.data.password === password;
	},
	hasChanged : function() {
		return this.changed; //TODO: Determine better way of recognizing changes to this object
	},
	triggerChanged : function() {
		this.changed = true;
		Households.triggerChanged();
	},
	registerClient : function(socket) {
		this.sockets.push(socket);
		var self = this;
		socket.addListener("AddUser", function(obj) {
			var okay;
			if(self.addUser(obj.name, obj.password))
				okay = true;
			else
				okay = false;
			return {
				okay: okay
			}
		});
		socket.addListener("LoginUser", function(obj) {
			var okay;
			if(self.loginUser(obj.name, obj.password, socket))
				okay = true;
			else
				okay = false;
			return {
				okay: okay
			}
		});
		socket.addListener("ListUsers", function(obj) {
			var users = [];
			for(var name in self.users) {
				users.push({
					name : self.users[name].data.name
				});
			}
			return {
				users : users
			}
		});
	},
	addUser : function(name, password) {
		if(this.users[name] !== undefined) {
			return false;
		}
		else {
			this.users[name] = new User(name, password);
			this.triggerChanged();
			return true;
		}
	},
	loginUser : function(name, password, socket) {
		if(this.users[name] !== undefined && this.users[name].checkPassword(password)) {
			this.users[name].registerClient(socket);
			return true;
		}
		else {
			return false;
		}
	}
	
};

module.exports = Household;
