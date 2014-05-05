Content.define({
	heading : "Rezepte",
	onAttached : function(node) {
		Websocket.send("ListRecipes", { }, function(obj) {
			function indexOfPhonetic(s1, s2) {
				var s1 = replaceAll(replaceAll(replaceAll(s1.toLowerCase(), " ", ""), "-", ""), "_", "");
				var s2 = replaceAll(replaceAll(replaceAll(s2.toLowerCase(), " ", ""), "-", ""), "_", "");
				return s1.indexOf(s2);
			}
			function countWhitespaces(string) {
				var ws = 0;
				for(var i = 0; i < string.length; i++) {
					var c = string.charAt(i);
					if(c == ' ' || c == '-' || c == '_') 
						ws++;
				}
				return ws;
			};
			function display(list, high) {
				var string = "";
				for(var i = 0; i < list.length; i++) {
					var elem = list[i];
					if(high !== undefined) {
						var index;
						if((index = indexOfPhonetic(elem, high)) !== -1) {
							var middle = elem.substring(index, high.length + index);
							var whitespaces = countWhitespaces(middle);
							middle = elem.substring(index, high.length + index + whitespaces);
							elem = elem.substring(0, index) + "<span style='background: white; color: red;'>" + middle + 
							"</span>" + elem.substring(index + high.length + whitespaces, elem.length);
						}
					}
					string += elem + (i == list.length - 1 ? "" : ", ");
				}
				node.find("#list").html(string);
			}
			var list = obj.list;
			display(list);
			var search = node.find("input[name='search']");
			search.keyup(function() {
				var text = search.val();
				var nlist = [];
				for(var i = 0; i < list.length; i++) {
					if(indexOfPhonetic(list[i], text) !== -1) {
						nlist.push(list[i]);
					}
				}
				display(nlist, text);
			});
		});
	}
});
