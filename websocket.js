function Websocket(host)
{
	this.host = host;
	this.socket;
	this.opened = false;
	this.requestStack = {};
	this.openStack = [];
	this.connect();
}

Websocket.prototype.addHandler = function(request, func)
{
	this.requestStack[request] = func;
};
Websocket.prototype.addOpenHandler = function(func)
{
	this.openStack.push(func);
};

Websocket.prototype.connect = function()
{
	var self = this;
	console.log("Connecting to " + this.host);
	var me = this;
	this.socket = new WebSocket(this.host); 
	this.socket.onopen		= function(evt) 
	{ 
		console.log("Websocket opened!");
        self.opened = true;
		for(var i = 0; i < self.openStack.length; i++)
			self.openStack[i]();
	};
	this.socket.onmessage	= function(evt) 
	{ 
		me.onMessage(evt);
	};
};

Websocket.prototype.onClose = function(evt)
{
	console.log("Websocket was closed!");
};

Websocket.prototype.onMessage = function(evt)
{
	var obj = JSON.parse(evt.data);
	if(this.requestStack[obj.requestID] !== undefined)
	{
		this.requestStack[obj.requestID](obj);
	}
};

Websocket.prototype.send = function(request, object)
{
	object.requestID = request;
	object = JSON.stringify(object);
	this.socket.send(object);
};
