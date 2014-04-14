User = {
	loggedIn : function(name) {
		this.name = name;
		var grocery = new MenuEntry("Einkaufen", function() {
			Content.setContent("GroceryList");
		});
		Menu.addEntry(grocery);
		Menu.refresh();
		Content.setInfo("Familie " + Household.name + ", " + name);
	},
	login : function(name, password) {
		Websocket.send("LoginUser", {
			name: name,
			password: password
		}, function(response) {
			alert(response.okay);
			if(response.okay) {
				setCookie("UserName", name, 365);
				setCookie("UserPassword", password, 365);
				User.loggedIn(name);
			}
			else {
				deleteCookie("UserName");
				deleteCookie("UserPassword");
			}
		});	
	},
	checkCookieLogin : function() {
		var name = getCookie("UserName");
		var password = getCookie("UserPassword");
		if(name !== undefined && password !== undefined) {
			this.login(name, password);
		}
	}
};
