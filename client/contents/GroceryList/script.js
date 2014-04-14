Content.define({
	heading : "Einkaufsliste",
	onAttached : function(node) {
		var table = node.find("table");
		Websocket.send("GetGroceries", {}, function(obj) {
			for(var g in obj.groceries) {
				var grocery = obj.groceries[g];
				table.append("<tr><td>" + grocery.name + "</td><td>x" + grocery.amount + "</td><td>" + grocery.user + "</td></tr>");
			}
		});
		node.find(":button").click(function() {
			Websocket.send("AddGrocery", {
				name : node.find("input[name='name']").val(),
				amount : node.find("input[name='amount']").val(),
			});
		});
	}
	//TODO: Clear handler in onDetached()
});
