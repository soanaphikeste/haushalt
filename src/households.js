/*
 * Includes
 */
var fs = require("fs"); //Import tools for manipulating filesystem
var Household = require("./household");
var User = require("./user");
/*
 * Manages all households
 */

Households = {
	changed: true,
	households : {},
	load : function() {
		fs.readdir("households", function(err, files) {
			if(!err) {
				console.log(files);
				for(var i = 0; i < files.length; i++) {
					fs.readFile("households/" + files[i], function(err, data) {
						if(!err) {
							var obj = JSON.parse(data);
							var hhold = new Household();
							for(var key in obj.household) {
								hhold.data[key] = obj.household[key];
							}
							for(var i = 0; i < obj.users.length; i++) {
								var user = new User(hhold);
								user.data = obj.users[i];
								hhold.users[user.data.name] = user;
							}
							Households.households[hhold.data.name] = hhold;
							console.log("Household \"" + hhold.data.name + "\" successfully loaded");
						}
						else {
							console.log("Unable to load household");
						}
					});
				}
			}
			else {
				console.log("Could not load existing households");
			}
		});
	},
	save : function() {
		fs.mkdir("households", function(err) {});
		for(var name in this.households) {
			if(this.households[name].hasChanged()) {
				var obj = {
					household : this.households[name].data,
					users : []
				};
				for(var nick in this.households[name].users) {
					obj.users.push(this.households[name].users[nick].data);
				}
				fs.writeFile("households/" + name + ".json", JSON.stringify(obj), function(err) {
					if(err) {
						console.log("Error saving household " + name);
					}
				});
			}
		}
	},
	register: function(name, password) {
		if(this.households[name] === undefined) {
			this.households[name] = new Household(name, password);
			this.triggerChanged();
			return true;
		}
		else
			return false;
	},
	checkLogin : function(name, password) {
		return this.households[name] !== undefined && this.households[name].checkPassword(password);
	},
	getHousehold : function(name) {
		return this.households[name];
	},
	triggerChanged : function() {
		this.changed = true;
	}, 
	init : function() {
		this.initPeriodicSaver();
	},
	initPeriodicSaver : function() {
		setInterval(function() {
			if(Households.changed) {
				Households.changed = false;
				Households.save();
			}
		}, 2000);
	}
};


/*
 * Exports
 */
module.exports = Households;
