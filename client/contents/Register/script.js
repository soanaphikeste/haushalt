Content.define({
	heading : "Registrieren",
	onAttached : function(node) { 
		node.find(":button").click(function() {
			Websocket.send("Register", {
				name: node.find("input[name='name']").val(),
				password: node.find("input[name='password']").val()
			}, function(response) {
				alert(response.okay);
			});
		});
	},
});
