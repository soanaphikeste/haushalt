Content.define({
	heading : "Login",
	onAttached : function(node) {
		node.find(":button").click(function() {
			Websocket.send("Login", {
				name: node.find("input[name='name']").val(),
				password: node.find("input[name='password']").val()
			}, function(response) {
				if(response.okay) {
					enterHouseholdState();
				}
				alert(response.okay);
			});
		});
	}
});
