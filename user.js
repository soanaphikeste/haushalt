function User(household, name, password) {
	this.data = { //Everything in this subobject will be saved. Everything else will NOT!
		name : name,
		password : password
	};
	this.household = household;
	this.sockets = [];
}

User.prototype = {
	var self = this;
	checkPassword : function(password) {
		return this.data.password === password;
	},
	registerClient : function(socket) {
		this.sockets.push(socket);
		socket.addListener("AddGrocery", function(obj) {
			self.household.addGrocery(obj.name, obj.amount, self, undefined);
			return { }
		});
		socket.addListener("CheckGrocery", function(obj) {
			self.household.checkGrocery(obj.index);
			return { }
		});
		socket.addListener("ClearGrocery", function(obj) {
			self.household.checkGrocery(obj.index);
			return { }
		});
	},
	broadcast : function(request, obj) {
		for(var socket in this.sockets) {
			socket.send(request, obj);
		}
	}
};

/*
 * Exports
 */
 
module.exports = User;
