function User(name, password) {
	this.data = { //Everything in this subobject will be saved. Everything else will NOT!
		name : name,
		password : password
	};
	this.sockets = [];
}

User.prototype = {
	checkPassword : function(password) {
		return this.data.password === password;
	},
	registerClient : function(socket) {
		this.sockets.push(socket);
	}
};

/*
 * Exports
 */
 
module.exports = User;
