/*
 * Includes
 */
var fs = require("fs"); //Import tools for manipulating filesystem

/*
 * One single household
 */
function Household(name, password) {
	this.data = { //Everything in this subobject will be saved. Everything else will NOT!
		name : name,
		password : password
	};
	this.changed = true;
}

Household.prototype = {
	checkPassword : function(password) {
		return this.data.password === password;
	},
	hasChanged : function() {
		return this.changed; //TODO: Determine better way of recognizing changes to this object
	},
	triggerChange : function() {
		this.changed = true;
		Households.triggerChange();
	},
	registerClient : function(socket) {
		
	}
};

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
							hhold.data = obj;
							Households.households[obj.name] = hhold;
							console.log("Household \"" + obj.name + "\" successfully loaded");
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
				fs.writeFile("households/" + name + ".json", JSON.stringify(this.households[name].data), function(err) {
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
