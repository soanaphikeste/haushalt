Content.define({
	heading : "Einkaufsliste",
	drawEntry : function(name, amount, user) {
		this.table.append("<tr><td>" + name + "</td><td>x" + amount + "</td><td>" + user + "</td></tr>");
	},
	onAttached : function(node) {
		var self = this;
		this.table = node.find("table");
		Websocket.send("GetGroceries", {}, function(obj) {
			for(var g in obj.groceries) {
				var grocery = obj.groceries[g];
				self.drawEntry(grocery.name, grocery.amount, grocery.user);
			}
		});
		Websocket.addListener("GroceryAdd", function(obj) {
			self.drawEntry(obj.name, obj.amount, obj.user);
			return {};
		});
		node.find(":button").click(function() {
			Websocket.send("AddGrocery", {
				name : node.find("input[name='name']").val(),
				amount : node.find("input[name='amount']").val(),
			});
		});
	},
	onDetached : function() {
		Websocket.removeListener("GroceryAdd");
	}
});
