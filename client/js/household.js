Household = {
	loggedIn : function(name) {
		this.name = name;
		Menu.clear();
		var management = new MenuEntry("Verwaltung");
		var users = new MenuEntry("Familienmitglieder");
		var add = new MenuEntry("Hinzufügen", function() {
			Content.setContent("UserAdd");
		});
		var login = new MenuEntry("Anmelden", function() {
			Content.setContent("UserLogin");
		});
		var list = new MenuEntry("Anzeigen", function() {
			Content.setContent("UserList");
		});
		users.addEntry(add);
		users.addEntry(login);
		users.addEntry(list);
		management.addEntry(users);
		Menu.addEntry(management);
		Menu.refresh();
		Content.setInfo("Familie " + name);
		User.checkCookieLogin();
	},
	login : function(name, password) {
		console.log(name, password);
		Websocket.send("Login", {
			name: name,
			password: password
		}, function(response) {
			if(response.okay) {
				setCookie("HouseholdName", name, 365);
				setCookie("HouseholdPassword", password, 365);
				Household.loggedIn(name);
			}
			else {
				deleteCookie("HouseholdName");
				deleteCookie("HouseholdPassword");
			}
			alert(response.okay);
		});	
	},
	checkCookieLogin : function() {
		var name = getCookie("HouseholdName");
		var password = getCookie("HouseholdPassword");
		if(name !== undefined && password !== undefined) {
			this.login(name, password);
		}
	}
};
