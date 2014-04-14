Content.define({
	heading : "Als Familienmitglied anmelden",
	onAttached : function(node) {
		node.find(":button").click(function() {
			var name = node.find("input[name='name']").val();
			var password = node.find("input[name='password']").val();
			User.login(name, password);
		});
	}
});
