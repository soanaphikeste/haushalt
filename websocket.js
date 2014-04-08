Websocket = function(ws) {
	var self = this;
	this.socket = ws;
	this.socket.on('message', function(msg) {
		var obj = JSON.parse(msg);
		if(obj._type == "Request") {
			if(self.requests[obj._requestID] !== undefined) {
				var answer = self.requests[obj._requestID](obj);
				if(answer === undefined) answer = {};
				answer._responseID = obj._responseID;
				answer._type = "Response";
				self.socket.send(JSON.stringify(answer));
			}
		}
		else if(obj._type == "Response") {
			if(self.responses[obj._responseID] !== undefined) {
				self.responses[obj._responseID](obj);
			}
		}
	});
	this.socket.on('open', function(e) {
		for(var i = 0; i < self.openStack.length; i++) {
			self.openStack[i]();
		}
	});
};

Websocket.prototype = {
	openStack : [],
	requests: {},
	responses : {},
	counter : 0,
	addOpenListener : function(listener) {
		this.openStack.push(listener);
	},
	addListener : function(request, listener) {
		this.requests[request] = listener;
	},
	send : function(request, obj, listener) {
		this.responses[this.counter] = listener;
		obj._requestID = request;
		obj._type = "Request";
		obj._responseID = this.counter;
		obj = JSON.stringify(obj);
		this.socket.send(obj);
	}
};

module.exports = Websocket;
