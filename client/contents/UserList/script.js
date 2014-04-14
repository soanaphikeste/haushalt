Content.define({
	heading : "Familienmitglieder",
	onAttached : function(node) {
		var table = node.find("table");
		Websocket.send("ListUsers", {}, function(obj) {
			for(var i = 0; i < obj.users.length; i++) {
				table.append("<tr><td>" + obj.users[i].name + "</td></tr>");
			}
		});
	}
});
