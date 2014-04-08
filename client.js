module.exports = function(socket) {
	socket.addListener("Hallo", function(obj) {
		return obj;
	});
};
