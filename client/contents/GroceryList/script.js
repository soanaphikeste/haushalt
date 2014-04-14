Content.define({
	rows : [],
	heading : "Einkaufsliste",
	disabledCSS : {
		"text-decoration": "line-through",
		"color" : "grey",
		"background-color" : "lightgrey"
	},
	normalCSS : {
		"text-decoration": "",
		"color" : "",
		"background-color" : ""
	},
	drawEntry : function(name, amount, user, index, checked) {
		var self = this;
		var checkbox = $("<input type='checkbox'/>").click(function() {
			if(this.checked) {
				Websocket.send("CheckGrocery", {
					index: index
				});
			}
			else {
				Websocket.send("UncheckGrocery", {
					index: index
				});
			}
		});
		var row = $("<tr></tr>")
			.append("<td>" + name + "</td>")
			.append("<td>" + amount + "</td>")
			.append("<td>" + user + "</td>")
			.append($("<td></td>").append(checkbox));
		if(checked) {
			row.css(this.disabledCSS);
			checkbox.attr({"checked": true});
		}
		this.table.append(row);
		this.rows[index] = row;
	},
	onAttached : function(node) {
		this.rows = [];
		$("#colname").html(User.name);
		var self = this;
		this.table = node.find("table");
		Websocket.send("GetGroceries", {}, function(obj) {
			for(var g in obj.groceries) {
				var grocery = obj.groceries[g];
				self.drawEntry(grocery.name, grocery.amount, grocery.user, g, grocery.checked);
			}
		});
		Websocket.addListener("GroceryAdd", function(obj) {
			self.drawEntry(obj.name, obj.amount, obj.user);
			return {};
		});
		Websocket.addListener("GroceryCheck", function(obj) {
			var row = self.rows[obj.index];
			row.css(self.disabledCSS);
			return {};
		});
		Websocket.addListener("GroceryUncheck", function(obj) {
			var row = self.rows[obj.index];
			row.css(self.normalCSS);
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
		this.rows = [];
		Websocket.removeListener("GroceryAdd");
		Websocket.removeListener("GroceryCheck");
	}
});
