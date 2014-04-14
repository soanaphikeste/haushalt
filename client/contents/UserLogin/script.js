Content.define({
	heading : "Als Familienmitglied anmelden",
	onAttached : function(node) {
		node.find(":button").click(function() {
			Websocket.send("LoginUser", {
				name: node.find("input[name='name']").val(),
				password: node.find("input[name='password']").val()
			}, function(response) {
				alert(response.okay);
				if(response.okay) {
					enterUserState();
				}
			});
		});
	}
});
