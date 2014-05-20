var units = {
	mass : [{
		aliases : ['g', 'gram', 'gramm', 'grams'],
		name : "Gramm",
		suffix : 'g',
		factor: 1
	}, {
		aliases : ['dg', 'dezi-gram', 'dezi-gramm', 'dezigramm', 'dezigram', 'dezigrams', 'dezi-grams'],
			'deci-gram', 'deci-gramm', 'decigramm', 'decigram', 'decigrams', 'deci-grams'],
		name : "Dezigramm",
		suffix : 'dg',
		factor: 0.1
	}, {
		aliases : ['mg', 'milligram', 'milligramm', 'milli-gramm', 'milli-gram', 'milli-grams', 'milligrams'],
		name : "Milligramm",
		suffix : 'mg',
		factor: 0.001
	}, {
		aliases : ['kg', 'kilogram', 'kilogramm', 'kilo-gramm', 'kilo-gram', 'kilo-grams', 'kilograms'],
		name : "Kilogramm",
		suffix: 'kg',
		factor: 1000
	}, {
		aliases : ['oz', 'ounce', 'ounces', 'unze', 'unzen'],
		name : "Uzen",
		suffix : 'oz',
		factor : 28
	}, {
		aliases : ['lb', 'pound', 'pounds', 'pfund'],
		name : "Pfund",
		suffix : 'lb',
		factor : 453.6
	}],
	volume : [{
		aliases : ['l', 'liter', 'liters'],
		name : "Liter",
		suffix : 'l',
		factor : 1
	}, {
		aliases : ['dl', 'deciliter', 'deci-liter', 'deciliters', 'deci-liters', 'deziliter', 'deziliters', 
			'dezi-liters', 'dezi-liter'],
		name : "Deziliter",
		suffix : 'dl',
		factor : 0.1
	}, {
		aliases : ['ml', 'milliliter', 'milli-liters', 'milliliters', 'milli-liter'],
		name : "Milliliter",
		suffix : 'ml',
		factor : 0.001
	}, {
		aliases : ['tl', 'teelöffel', 'teeloeffel', 'tee-löffel', 'tee-loeffel', 'tee loeffel', 'tee löffel', 'teaspoon', 'tea-spoon', 'tea spoon',
			'gestrichener teelöffel', 'gestrichener teeloeffel', 'gestrichener tee-löffel', 'gestrichener tee-loeffel', 'gestrichener tee loeffel', 'gestrichener tee löffel'],
		name : "Teelöffel",
		suffix : ' Teelöffel',
		factor : 0.005
	}, {
		aliases : ['gehäufter teelöffel', 'gehäufter teeloeffel', 'gehäufter tee-löffel', 'gehäufter tee-loeffel', 'gehäufter tee loeffel',
			'gehaeufter teelöffel', 'gehaeufter teeloeffel', 'gehaeufter tee-löffel', 'gehaeufter tee-loeffel', 'gehaeufter tee loeffel'],
		name : "Gehäufter Teelöffel",
		suffix : ' Gehäufter Teelöffel',
		factor : 0.01
	}, {
		aliases : ['el', 'esslöffel', 'essloeffel', 'ess-löffel', 'ess-loeffel', 'ess loeffel', 'ess löffel', 'tablespoon', 'table-spoon', 'table spoon'
			'gestrichener esslöffel', 'gestrichener essloeffel', 'gestrichener ess-löffel', 'gestrichener ess-loeffel', 'gestrichener ess loeffel', 'gestrichener ess löffel'],
		name : "Esslöffel",
		suffix : ' Esslöffel',
		factor : 0.015
	}, {
		aliases : ['gehäufter esslöffel', 'gehäufter essloeffel', 'gehäufter ess-löffel', 'gehäufter ess-loeffel', 'gehäufter ess loeffel', 'gehäufter ess löffel',
		'gehaeufter esslöffel', 'gehaeufter essloeffel', 'gehaeufter ess-löffel', 'gehaeufter ess-loeffel', 'gehaeufter ess loeffel', 'gehaeufter ess löffel'],
		name : "Gehäufter Esslöffel",
		suffix : ' Gehäufter Esslöffel',
		factor : 0.030
	}, {
		aliases : ['fluid ounce', 'fluid-ounce', 'fl.oz.', 'fl.oz', 'floz', 'fl oz'],
		name : "Fluid Ounce",
		suffix : ' fl.oz',
		factor : 0.030
	}, {
		aliases : ['cp', 'cup', 'cups', 'tassen', 'tasse', 'becher', 'glas', 'gläser', 'glaeser'],
		name : "Tasse",
		suffix : ' Tasse',
		factor : 0.24
	}, {
		aliases : ['pint', 'pinte', 'pt', 'liq. pt.', 'dry. pt.', 'imp. pt.', 'liq.pt.', 'dry.pt.', 'imp.pt.', 'liq.pt', 'dry.pt', 'imp.pt'],
		name : "Pint",
		suffix : ' Pint',
		factor : 0.47
	}, {
		aliases : ['quart', 'quarts', 'qt', 'liq. qt.', 'dry. qt.', 'imp. qt.', 'liq.qt.', 'dry.qt.', 'imp.qt.', 'liq.qt', 'dry.qt', 'imp.qt'],
		name : "Quart",
		suffix : ' Quart',
		factor : 0.95
	}, {
		aliases : ['gallone', 'gallone', 'gallons', 'gal', 'liq. gal.', 'dry. gal.', 'imp. gal.', 'liq.gal.', 'dry.gal.', 'imp.gal.', 'liq.gal', 'dry.gal', 'imp.gal'],
		name : "Gallone",
		suffix : ' Gallone',
		factor : 3.8
	}]
};

var MASS = 0;
var VOLUME = 1;

for(var key in units.mass) {
	units.mass[key].type = MASS;
}

for(var key in units.volume) {
	units.volume[key].type = VOLUME;
}

var regexp = /([0-9]+[.,][0-9]*)\s*(.*)/;

module.exports = {
	getUnitOf : function(string) {
		var result = regexp.exec(string);
		var amount = parseFloat(result[1].replace(",", "."));
		var al = result[2];
		for(var type in units) {
			for(var unit in units[type]) {
				for(var alias in units[type][unit].aliases) {
					if(al === alias) {
						var u = {
							amount : amount,
							name : unit.name,
							suffix: unit.suffix,
							factor : unit.factor,
							type : unit.type
						};
						return u;
					}
				}
			}
		}
		return undefined;
	},
	add : function(unit1, unit2) {
		if(unit1.type === unit2.type) {
			amount2 = unit1.amount + unit2.amount * unit2.factor * (1/unit1.factor);
			return {
				amount : amount2,
				name : unit1.name,
				suffix : unit1.suffix, 
				factor : unit1.factor,
				type : unit1.type
			};
		}
		else {
			return undefined;
		}
	},
	getPhoneticOf : function(unit) {
		return unit.amount + " " +unit.suffix;
	}
};
