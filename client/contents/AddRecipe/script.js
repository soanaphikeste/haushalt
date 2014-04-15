Content.define({
	heading : "Rezept Hinzufügen",
	onAttached : function(node) {
		var ings = [];
		var ingredients = node.find("#ingredients");
		function addIngredient() {
			var ingredient = $("<tr></tr>").appendTo(ingredients);
			ings.push({
				name : $("<input size='50' type='text'>").appendTo($("<td></td>").appendTo(ingredient)),
				amount : $("<input size='10' type='text'>").appendTo($("<td></td>").appendTo(ingredient)),
				pp : $("<input type='checkbox'>").appendTo($("<td></td>").appendTo(ingredient)).attr({"checked" : true}),
			});
		};
		node.find("#new").click(addIngredient);
		addIngredient();
		node.find("#add").click(function() {
			var portions = node.find("input[name='portions']").val()
			var obj = {
				name : node.find("input[name='name']").val(),
				description : node.find("textarea").val(),
				ingredients : []
			};
			for(var i in ings) {
				var ing = ings[i];
				var amount = ing.amount.val();
				var regexp = /([0-9.,]*)(.*)/;
				amount = regexp.exec(amount);
				obj.ingredients.push({
					name : ing.name.val(),
					amount : amount[1] / portions,
					suffix : amount[2],
					pp : ing.pp.attr("checked") == "checked",
				});
			}
			Websocket.send("AddRecipe", obj);
		});
	}
});
