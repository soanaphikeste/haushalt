/*
 * Includes
 */
var fs = require("fs"); //Import tools for manipulating filesystem

/*
 * Manages all households
 */

Households = {
	changed: true,
	households : {},
	load : function() {
		fs.readdir("households", function(err, files) {
			if(!err) {
				for(var i = 0; i < files.length; i++) {
					fs.readFile(files[i], function(err, data) {
						if(!err) {
							var obj = JSON.parse(data);
							households[obj.name] = obj;
							console.log("Household \"" + obj.name + "\" successfully loaded from file " + files[i]);
						}
						else {
							console.log("Unable to load household at file " +  files[i]);
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
				fs.writeFile("households/" + name + ".json", JSON.stringify(this.households[name]), function(err) {
					if(err) {
						console.log("Error saving household " + name);
					}
				});
			}
		}
	},
	register: function(name, password) {
		households[name] = new Household(name, password);
	},
	checkLogin : function(name, password) {
		return households[name] !== undefined && households[name].checkPassword(password);
	},
	getHousehold : function(name) {
		return households[name];
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
 * One single household
 */
function Household(name, password) {
	this.name = name;
	this.password = password;
	this.changed = true;
}

Household.prototype = {
	checkPassword : function(password) {
		return this.password === password;
	},
	hasChanged : function() {
		return this.changed; //TODO: Determine better way of recognizing changes to this object
	},
	triggerChange : function() {
		this.changed = true;
		Households.triggerChange();
	}
};

/*
 * Exports
 */
module.exports = Households;
