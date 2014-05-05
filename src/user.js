function User(household, name, password) {
	this.data = { //Everything in this subobject will be saved. Everything else will NOT!
		name : name,
		password : password
	};
	this.household = household;
	this.sockets = [];
}

User.prototype = {
	checkPassword : function(password) {
		return this.data.password === password;
	},
	registerClient : function(socket) {
		var self = this;
		this.sockets.push(socket);
		socket.addCloseListener(function() {
			var index = self.sockets.indexOf(socket);
			self.sockets.splice(index, 1);
		});
		socket.addListener("AddGrocery", function(obj) {
			self.household.addGrocery(obj.name, obj.amount, self);
		});
		socket.addListener("CheckGrocery", function(obj) {
			self.household.checkGrocery(obj.index);
		});
		socket.addListener("UncheckGrocery", function(obj) {
			self.household.uncheckGrocery(obj.index);
		});
		socket.addListener("ClearGrocery", function(obj) {
			self.household.clearGrocery();
		});
		socket.addListener("AddRecipe", function(obj) {
			obj.author = self.data.name;
			self.household.addRecipe(obj);
		});
		socket.addListener("GetGroceries", function(obj) {
			var list = [];
			for(var g in self.household.data.groceries) {
				var grocery = self.household.data.groceries[g];
				list.push({
					name : grocery.name,
					amount: grocery.amount,
					user: grocery.user,
					checked : grocery.checked
				});
			}
			return {
				groceries : list
			};
		});
	},
	broadcast : function(request, obj) {
		for(var socket in this.sockets) {
			this.sockets[socket].send(request, obj);
		}
	}
};

/*
 * Exports
 */
 
module.exports = User;
