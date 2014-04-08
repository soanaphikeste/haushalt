module.exports = function(socket, server) {
	socket.addListener("Register", function(obj) {
		if(server.households.register(obj.name, obj.password)) {
			return {
				succeeded: true
			};
		}
		else {
			return {
				succeeded: false
			};
		}
	});
	socket.addListener("Login", function(obj) {
		if(server.households.checkLogin(obj.name, obj.password)) {
			server.households.getHousehold(obj.name).registerClient(socket);
			return {
				succeeded: true
			};
		}
		else {
			return {
				succeeded: false
			};
		}
	});
};
