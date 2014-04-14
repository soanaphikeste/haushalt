Content.define({
	heading : "Familienmitglied Hinzufügen",
	onAttached : function(node) {
		node.find(":button").click(function() {
			Websocket.send("AddUser", {
				name: node.find("input[name='name']").val(),
				password: node.find("input[name='password']").val()
			}, function(response) {
				alert(response.okay);
			});
		});
	}
});
