Content.define({
	heading : "Rezept Hinzufügen",
	onAttached : function(node) {
		var ings = [];
		var ingredients = node.find("#ingredients");
		function fillForm(html) {
			var vnode = $(html);
			var title = vnode.find("h1").html();
			vnode.find("table.incredients").find("tr.ingredient").each(function(index) {
				console.log($(this));
				var ing = ings[ings.length - 1];
				var nameDiv = $(this).find("td.name");
				console.log(nameDiv);
				var name;
				var a = nameDiv.find("a");
				if(a.length > 0) {
					name = a.html();
				}
				else {
					name = nameDiv.html();
				}
				ing.name.val(name.trim());
				ing.amount.val($(this).find("td.amount").html().trim());
				addIngredient();
			});
			var description = vnode.find("#rezept-zubereitung").html();
			/*while((res = r.exec(table))) {
				
				
				ing.amount.val(res[1].trim());
			}*/
			node.find("input[name='name']").val(title.trim());
			node.find("textarea").val(description.trim());
			//console.log(ingredients);
		};
		
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
		node.find("#parse").click(function() {
			var url = node.find("input[name='url']").val();
			Websocket.send("ScrapeChefkoch", {url:url}, function(obj) {
				fillForm(replaceAll(obj.data, "\n", ""));
			});
		});
	}
});
