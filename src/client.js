module.exports = function(socket, server) {
	socket.addListener("Register", function(obj) {
		if(server.households.register(obj.name, obj.password)) {
			return {
				okay: true
			};
		}
		else {
			return {
				okay: false
			};
		}
	});
	socket.addListener("Login", function(obj) {
		if(server.households.checkLogin(obj.name, obj.password)) {
			server.households.getHousehold(obj.name).registerClient(socket);
			return {
				okay: true
			};
		}
		else {
			return {
				okay: false
			};
		}
	});
};
