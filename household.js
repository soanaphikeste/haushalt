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
		password : password,
		groceries : []
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
		return this.changed; 
	},
	triggerChanged : function() {
		this.changed = true;
		Households.triggerChanged();
	},
	addGrocery : function(name, amount, user) {
		var obj = {
			name: name,
			amount: amount, 
			user: user,
			checked : false
		};
		this.data.groceries.push(obj);
		this.broadcast("GroceryAdd", {
			name : name,
			amount : amount,
			user : user.data.name,
			checked: false
		});
		this.triggerChanged();
	},
	checkGrocery : function(index) {
		this.data.groceries[index].checked = true;
		this.broadcast("GroceryCheck", {
			index: index
		});
		this.triggerChanged();
	},
	clearGrocery : function() {
		this.data.groceries = [];
		this.broadcast("GroceryClear", { });
		this.triggerChanged();
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
			this.users[name] = new User(this, name, password);
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
	},
	broadcast : function(request, obj) {
		for(var socket in this.sockets) {
			//console.log(this.sockets[socket]);
			this.sockets[socket].send(request, obj);
		}
	}
	
};

module.exports = Household;
