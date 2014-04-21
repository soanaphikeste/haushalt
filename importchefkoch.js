var sample = require('./chefkochsample');
var r = /.*?<h1>(.*?)<\/h1>.*/;
var title = r.exec(sample)[1];
r = /.*?<h2>Zubereitung<\/h2>\s*?(.*?)<h2>/
var description = replaceAll(r.exec(sample)[1].trim(), "<br />", "\n");
r = /.*?<table class=".*?recipe.*?">(.*?)<\/table>.*?/;
var table = r.exec(sample)[1];
r = /\s*<tr.*?>\s*?<td>\s*<strong>(.*?)<\/strong>\s*<\/td>\s*<td>(.*?)<\/td>\s*<\/tr>/g;
var ingredients = [];
while((res = r.exec(table))) {
	ingredients.push({
		amount : res[1].trim(),
		name : res[2].trim()
	});
}
console.log(ingredients);
function replaceAll(string, needle, replace) {
	while(string.indexOf(needle) != -1)
		string = string.replace(needle, replace);
	return string;
}
