function MenuEntry(string, method, sub) {
	this.method = method;
	this.string = string;
	if(sub === undefined)
		this.sub = [];
	else
		this.sub = sub;
}

MenuEntry.prototype =  {
	addEntry : function(entry) {
		this.sub.push(entry);
	}
};

Menu = 
{
	entries : [],
	refresh: function()  {
		var main = new MenuEntry("Hallo");
		main.addEntry(new MenuEntry("Hallo2"));
		Menu.entries.push(main);
		Menu.redraw();
	},
	addEntry : function(entry) {
		this.entries.push(entry);
	},
	redraw : function() {
		var root = $("#navigation");
		root.html("");
		function recurse(root, subs) {
			if(subs.length == 0) return;
			var list = $("<ul></ul>").appendTo(root);
			for(var i = 0; i < subs.length; i++) {
				var url = $("<a href='#'>" + subs[i].string + "</a>");
				if(subs[i].method !== undefined) {
					url.click(subs[i].method);
				}
				var elem = $("<div></div>").appendTo($("<li></li>").appendTo(list));
				elem.append(url);
				recurse(elem, subs[i].sub);
			}
		};
		recurse(root, Menu.entries);
	}
};
