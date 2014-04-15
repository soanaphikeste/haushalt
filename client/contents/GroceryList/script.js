Content.define({
	rows : [],
	groceries : [],
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
		var row = $("<tr></tr>")
			.append("<td>" + name + "</td>")
			.append("<td>" + amount + "</td>")
			.append("<td>" + user + "</td>");
		row.index = index;
		var checkbox = $("<input type='checkbox'/>").click(function() {
			if(this.checked) {
				Websocket.send("CheckGrocery", {
					index: row.index
				});
			}
			else {
				Websocket.send("UncheckGrocery", {
					index: row.index
				});
			}
		});
		
		row.append($("<td></td>").append(checkbox));
		if(checked) {
			row.css(this.disabledCSS);
			checkbox.attr({"checked": true});
		}
		this.table.append(row);
		this.rows[index] = row;
	},
	onAttached : function(node) {
		$("#colname").html(User.name);
		var self = this;
		this.table = node.find("table");
		Websocket.send("GetGroceries", {}, function(obj) {
			for(var g in obj.groceries) {
				var grocery = obj.groceries[g];
				self.drawEntry(grocery.name, grocery.amount, grocery.user, g, grocery.checked);
			}
			self.groceries = obj.groceries;
		});
		Websocket.addListener("GroceryAdd", function(obj) {
			self.drawEntry(obj.name, obj.amount, obj.user, self.groceries.length, obj.checked);
			self.groceries.push(obj);
		});
		Websocket.addListener("GroceryCheck", function(obj) {
			var row = self.rows[obj.index];
			row.css(self.disabledCSS);
			row.find("input[type='checkbox']").attr({"checked": true});
			self.groceries[obj.index].checked = true;
		});
		Websocket.addListener("GroceryUncheck", function(obj) {
			var row = self.rows[obj.index];
			row.css(self.normalCSS);
			row.find("input[type='checkbox']").attr({"checked": false});
			self.groceries[obj.index].checked = false;
		});
		Websocket.addListener("GroceryClear", function(obj) {
			var tmpGroc = self.groceries;
			var tmpRows = self.rows;
			self.groceries = [];
			self.rows = [];
			for(var g in tmpGroc) {
				var row = tmpRows[g];
				var groc = tmpGroc[g];
				if(groc.checked) {
					(function(row) {
						setTimeout(function() {
							row.remove();
						}, 200);
						row.css({"opacity" : "0"});
					})(row);
				}
				else {
					self.groceries.push(groc);
					self.rows.push(row);
					row.index = self.groceries.length - 1;
				}
			}
		});
		node.find("#add").click(function() {
			Websocket.send("AddGrocery", {
				name : node.find("input[name='name']").val(),
				amount : node.find("input[name='amount']").val(),
			});
		});
		node.find("#clear").click(function() {
			Websocket.send("ClearGrocery", { });
		});
	},
	onDetached : function() {
		this.rows = [];
		this.groceries = [];
		Websocket.removeListener("GroceryAdd");
		Websocket.removeListener("GroceryCheck");
	}
});
