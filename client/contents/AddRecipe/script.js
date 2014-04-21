Content.define({
	heading : "Rezept Hinzufügen",
	onAttached : function(node) {
		var ings = [];
		var ingredients = node.find("#ingredients");
		
		function fillForm(html) {
			var r = /.*?<h1>(.*?)<\/h1>.*/;
			var title = r.exec(html)[1];
			r = /.*?<h2>Zubereitung<\/h2>\s*?(.*?)<h2>/
			var description = replaceAll(r.exec(html)[1].trim(), "<br />", "\n");
			r = /.*?<table class=".*?recipe.*?">(.*?)<\/table>.*?/;
			var table = r.exec(html)[1];
			r = /\s*<tr.*?>\s*?<td>\s*<strong>(.*?)<\/strong>\s*<\/td>\s*<td>(.*?)<\/td>\s*<\/tr>/g;
			//var ingredients = [];
			while((res = r.exec(table))) {
				var ing = ings[ings.length - 1];
				ing.name.val(res[2].trim());
				ing.amount.val(res[1].trim());
				addIngredient();
			}
			node.find("input[name='name']").val(title);
			node.find("textarea").val(description);
			console.log(ingredients);
			function replaceAll(string, needle, replace) {
				while(string.indexOf(needle) != -1)
					string = string.replace(needle, replace);
				return string;
			}
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
			$.ajax({
				url : url
			}).done(function(html) {
				//TODO: Add real fetching here
				//Something like:
				//fillForm(html);
			}).error(function(e) {
				//TODO: For testing purposes only!
				fillForm('<!DOCTYPE html>' +
'<html>' +
'	<head>' +
'		<meta charset="iso-8859-1" />' +
'				<title>Belgische Waffeln mit Hagelzucker (Rezept mit Bild) | Chefkoch.de</title>' +
'' +
'				<meta name="description" content="Belgische Waffeln mit Hagelzucker, ein schmackhaftes Rezept mit Bild aus der Kategorie Kuchen. 105 Bewertungen: &Oslash; 4,4. Tags: Backen, Belgien, Europa, Kinder, Kuchen">' +
'' +
'		<meta name="robots" content="INDEX,FOLLOW" />' +
'' +
'					<link rel="canonical" href="http://www.chefkoch.de/rezepte/1371561242037991/Belgische-Waffeln-mit-Hagelzucker.html" />' +
'		' +
'		<meta name="HandheldFriendly" content="true" />' +
'		<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />' +
'		<meta http-equiv="cleartype" content="on" />' +
'' +
'				' +
'<link rel="apple-touch-icon" href="http://img.chefkoch-cdn.de/img/mobile/touch-icons/ck-touch.png" />' +
'<link rel="apple-touch-icon" sizes="72x72" href="http://img.chefkoch-cdn.de/img/mobile/touch-icons/ck-touch72x72.png" />' +
'<link rel="apple-touch-icon" sizes="114x114" href="http://img.chefkoch-cdn.de/img/mobile/touch-icons/ck-touch114x114.png" />' +
'<link rel="apple-touch-icon" sizes="144x144" href="http://img.chefkoch-cdn.de/img/mobile/touch-icons/ck-touch144x144.png">' +
'' +
'<link rel="shortcut icon" href="http://img.chefkoch-cdn.de/favicon.ico">' +
'<link rel="icon" href="http://img.chefkoch-cdn.de/img/mobile/touch-icons/ck-touch.png">' +
'' +
'<meta name="application-name" content="Chefkoch.de"/>' +
'<meta name="msapplication-TileImage" content="img/touch-icons/ck-touch-panel144x144.png">' +
'<meta name="msapplication-TileColor" content="#7ba344">' +
'		' +
'		<link rel="stylesheet" href="http://css.chefkoch-cdn.de/css/ck.de/mobile/mobile.css?v=27" media="all">' +
'' +
'		<script type="text/javascript" src="http://js.chefkoch-cdn.de/js/default/mobile/phMobile.js?v=19" ></script>' +
'	</head>' +
'	<body>' +
'' +
'		<div id="wrapper">' +
'' +
'			<header id="header">' +
'' +
'				<ul id="menu-bar" role="navigation">' +
'					<li id="menu-bar-left" class="menu-bar-item">' +
'						<a href="#" onClick="phMobile.toggleMenu();" class="menu-bar-menu" title="Menü">' +
'							<span class="icon-menu" aria-hidden="true"></span>' +
'						</a>' +
'					</li>' +
'					<li id="menu-bar-center" class="menu-bar-item">' +
'						<a href="http://mobile.chefkoch.de" class="menu-bar-logo" title="zur mobilen Startseite">' +
'							<img src="http://img.chefkoch-cdn.de/img/ck.de/mobile/logo.svg" onerror="this.onerror=null; this.src=\'http://img.chefkoch-cdn.de/img/ck.de/mobile/logo.png\'" height="35" alt="Chefkoch.de" />' +
'						</a>' +
'					</li>' +
'					<li id="menu-bar-right" class="menu-bar-item">' +
'						<a href="javascript:history.back();" class="menu-bar-back" title="zurück zur vorigen Seite">' +
'							<span class="icon-reply" aria-hidden="true"></span>' +
'						</a>' +
'					</li>' +
'				</ul>' +
'' +
'			</header>' +
'' +
'			<ul id="menu" style="visibility: hidden; height: auto; position: absolute;" role="navigation">' +
'	<li class="menu-item"><a href="http://mobile.chefkoch.de"><span class="icon-home" aria-hidden="true"></span>&nbsp; Startseite</a></li>' +
'	<li class="menu-item"><a href="/mobile/rezepte/was-koche-ich-heute/"><span class="icon-food" aria-hidden="true"></span>&nbsp; Was koche ich heute?</a></li>' +
'	<li class="menu-item"><a href="/mobile/mobile-recipe-search.php"><span class="icon-th-list" aria-hidden="true"></span>&nbsp; Neue Rezepte</a></li>' +
'	<li class="menu-item"><a href="/mobile/mobile-recipe-images.php"><span class="icon-th" aria-hidden="true"></span>&nbsp; Neue Rezeptbilder</a></li>' +
'	<li class="menu-item"><a href="/mobile/mobile-topsearches.php"><span class="icon-star" aria-hidden="true"></span>&nbsp; Beliebte Suchen</a></li>' +
'	<li class="menu-item"><a href="http://www.chefkoch.de"><span class="icon-desktop" aria-hidden="true"></span>&nbsp; Chefkoch.de (Desktop-Version)</a></li>' +
'</ul>' +
'			<form id="searchform" action="/mobile/mobile-recipe-search.php" method="get" class="clearfix">' +
'				<input type="text" name="suchbegriff" id="searchform-input" placeholder="Rezeptsuche" value="" />' +
'				<button type="submit" id="searchform-submit" value="" class="icon-search" aria-label=""></button>' +
'			</form>' +
'' +
'			<div class="mobile_ad"><script src="http://live-emsservice.elasticbeanstalk.com/ad-ids.php" type="text/javascript"></script>' +
'    <div id="AmobeeAd">' +
'			<script type="text/javascript">' +
'							 getAmobeeAd(' +
'											document.getElementById(\'AmobeeAd\'),' +
'											\'482\', // AdSpace ID (String)' +
'											\'\', // leer (String)' +
'											1, // Timeout in Sekunden (Integer)' +
'											0, // 1 fuer Test Requests (Integer)' +
'											\'\', // Ziel-URL (String) - leer fuer mobile Banner,' +
'											\'i=46.114.4.59&tp=4&t=1398088858456&prt=G+J&userId=60860282e998174f60222a11df07aff0&kw=Mehl|Salz|Vanillinzucker|Eier|Butter|Hefe|Milch|Wasser|Hagelzucker|Backen|Belgien|Europa|Kinder|Kuchen\' // Targeting-Werte als HTML Parameter (String),' +
'							 );' +
'			</script>' +
'    </div></div><section id="content-wrapper">' +
'' +
'	<h1>Belgische Waffeln mit Hagelzucker</h1>' +
'' +
'	' +
'		<p>die allerbesten Waffeln der Welt, ergibt 35 - 40 Waffeln</p>' +
'' +
'	' +
'    	' +
'		<a href="http://static.chefkoch-cdn.de/ck.de/rezepte/137/137156/374551-big-belgische-waffeln-mit-hagelzucker.jpg" target="_blank" onClick="phMobile.imageBox(event);">' +
'			<img class="recipe-image" src="http://static.chefkoch-cdn.de/ck.de/rezepte/137/137156/374551-bigfix-belgische-waffeln-mit-hagelzucker.jpg" alt="Belgische Waffeln mit Hagelzucker" />' +
'		</a>' +
'	' +
'	' +
'    	' +
'		<h2>Zutaten</h2>' +
'' +
'		<form name="zutatenform" id="zutatenform" action="/rezepte/m1371561242037991/Belgische-Waffeln-mit-Hagelzucker.html" method="post">' +
'			' +
'			<span class="select-wrapper">' +
'' +
'				<select name="divisor" onchange="document.getElementById(\'zutatenform\').submit();">' +
'					<option value="1">1 Portion</option>' +
'					' +
'											' +
'						<option value="2"  >2 Portionen</option>' +
'											' +
'						<option value="3"  >3 Portionen</option>' +
'											' +
'						<option value="4"  >4 Portionen</option>' +
'											' +
'						<option value="5"  >5 Portionen</option>' +
'											' +
'						<option value="6"  >6 Portionen</option>' +
'											' +
'						<option value="7"  >7 Portionen</option>' +
'											' +
'						<option value="8"  >8 Portionen</option>' +
'											' +
'						<option value="9"  >9 Portionen</option>' +
'											' +
'						<option value="10"  >10 Portionen</option>' +
'											' +
'						<option value="11"  >11 Portionen</option>' +
'											' +
'						<option value="12"  >12 Portionen</option>' +
'											' +
'						<option value="13"  >13 Portionen</option>' +
'											' +
'						<option value="14"  >14 Portionen</option>' +
'											' +
'						<option value="15"  >15 Portionen</option>' +
'											' +
'						<option value="16"  >16 Portionen</option>' +
'											' +
'						<option value="17"  >17 Portionen</option>' +
'											' +
'						<option value="18"  >18 Portionen</option>' +
'											' +
'						<option value="19"  >19 Portionen</option>' +
'											' +
'						<option value="20"  >20 Portionen</option>' +
'											' +
'						<option value="21"  >21 Portionen</option>' +
'											' +
'						<option value="22"  >22 Portionen</option>' +
'											' +
'						<option value="23"  >23 Portionen</option>' +
'											' +
'						<option value="24"  >24 Portionen</option>' +
'											' +
'						<option value="25"  >25 Portionen</option>' +
'											' +
'						<option value="26"  >26 Portionen</option>' +
'											' +
'						<option value="27"  >27 Portionen</option>' +
'											' +
'						<option value="28"  >28 Portionen</option>' +
'											' +
'						<option value="29"  >29 Portionen</option>' +
'											' +
'						<option value="30"  >30 Portionen</option>' +
'											' +
'						<option value="31"  >31 Portionen</option>' +
'											' +
'						<option value="32"  >32 Portionen</option>' +
'											' +
'						<option value="33"  >33 Portionen</option>' +
'											' +
'						<option value="34"  >34 Portionen</option>' +
'											' +
'						<option value="35"  >35 Portionen</option>' +
'											' +
'						<option value="36"  >36 Portionen</option>' +
'											' +
'						<option value="37"  >37 Portionen</option>' +
'											' +
'						<option value="38"  >38 Portionen</option>' +
'											' +
'						<option value="39"  >39 Portionen</option>' +
'											' +
'						<option value="40"  >40 Portionen</option>' +
'											' +
'						<option value="41"  >41 Portionen</option>' +
'											' +
'						<option value="42"  >42 Portionen</option>' +
'											' +
'						<option value="43"  >43 Portionen</option>' +
'											' +
'						<option value="44"  >44 Portionen</option>' +
'											' +
'						<option value="45"  >45 Portionen</option>' +
'											' +
'						<option value="46"  >46 Portionen</option>' +
'											' +
'						<option value="47"  >47 Portionen</option>' +
'											' +
'						<option value="48"  >48 Portionen</option>' +
'											' +
'						<option value="49"  >49 Portionen</option>' +
'											' +
'						<option value="50"  >50 Portionen</option>' +
'											' +
'						<option value="51"  >51 Portionen</option>' +
'											' +
'						<option value="52"  >52 Portionen</option>' +
'											' +
'						<option value="53"  >53 Portionen</option>' +
'											' +
'						<option value="54"  >54 Portionen</option>' +
'											' +
'						<option value="55"  >55 Portionen</option>' +
'											' +
'						<option value="56"  >56 Portionen</option>' +
'											' +
'						<option value="57"  >57 Portionen</option>' +
'											' +
'						<option value="58"  >58 Portionen</option>' +
'											' +
'						<option value="59"  >59 Portionen</option>' +
'											' +
'						<option value="60"  >60 Portionen</option>' +
'											' +
'						<option value="61"  >61 Portionen</option>' +
'											' +
'						<option value="62"  >62 Portionen</option>' +
'											' +
'						<option value="63"  >63 Portionen</option>' +
'											' +
'						<option value="64"  >64 Portionen</option>' +
'											' +
'						<option value="65"  >65 Portionen</option>' +
'											' +
'						<option value="66"  >66 Portionen</option>' +
'											' +
'						<option value="67"  >67 Portionen</option>' +
'											' +
'						<option value="68"  >68 Portionen</option>' +
'											' +
'						<option value="69"  >69 Portionen</option>' +
'											' +
'						<option value="70"  >70 Portionen</option>' +
'											' +
'						<option value="71"  >71 Portionen</option>' +
'											' +
'						<option value="72"  >72 Portionen</option>' +
'											' +
'						<option value="73"  >73 Portionen</option>' +
'											' +
'						<option value="74"  >74 Portionen</option>' +
'											' +
'						<option value="75"  >75 Portionen</option>' +
'											' +
'						<option value="76"  >76 Portionen</option>' +
'											' +
'						<option value="77"  >77 Portionen</option>' +
'											' +
'						<option value="78"  >78 Portionen</option>' +
'											' +
'						<option value="79"  >79 Portionen</option>' +
'											' +
'						<option value="80"  >80 Portionen</option>' +
'											' +
'						<option value="81"  >81 Portionen</option>' +
'											' +
'						<option value="82"  >82 Portionen</option>' +
'											' +
'						<option value="83"  >83 Portionen</option>' +
'											' +
'						<option value="84"  >84 Portionen</option>' +
'											' +
'						<option value="85"  >85 Portionen</option>' +
'											' +
'						<option value="86"  >86 Portionen</option>' +
'											' +
'						<option value="87"  >87 Portionen</option>' +
'											' +
'						<option value="88"  >88 Portionen</option>' +
'											' +
'						<option value="89"  >89 Portionen</option>' +
'											' +
'						<option value="90"  >90 Portionen</option>' +
'											' +
'						<option value="91"  >91 Portionen</option>' +
'											' +
'						<option value="92"  >92 Portionen</option>' +
'											' +
'						<option value="93"  >93 Portionen</option>' +
'											' +
'						<option value="94"  >94 Portionen</option>' +
'											' +
'						<option value="95"  >95 Portionen</option>' +
'											' +
'						<option value="96"  >96 Portionen</option>' +
'											' +
'						<option value="97"  >97 Portionen</option>' +
'											' +
'						<option value="98"  >98 Portionen</option>' +
'											' +
'						<option value="99"  >99 Portionen</option>' +
'											' +
'						<option value="100"  >100 Portionen</option>' +
'									</select>' +
'' +
'			</span>' +
'		</form>' +
'		' +
'		<div class="recipeview-table-wrapper">' +
'			<table class="recipeview-table">' +
'' +
'				' +
'					<tr class="recipeview-table-row">' +
'						<td>' +
'							<strong>1 kg</strong>' +
'						</td>' +
'						<td>' +
'							Mehl 						</td>' +
'					</tr>' +
'' +
'				' +
'					<tr class="recipeview-table-row">' +
'						<td>' +
'							<strong>1 Prise</strong>' +
'						</td>' +
'						<td>' +
'							Salz 						</td>' +
'					</tr>' +
'' +
'				' +
'					<tr class="recipeview-table-row">' +
'						<td>' +
'							<strong>3 Pck.</strong>' +
'						</td>' +
'						<td>' +
'							Vanillinzucker 						</td>' +
'					</tr>' +
'' +
'				' +
'					<tr class="recipeview-table-row">' +
'						<td>' +
'							<strong>7 </strong>' +
'						</td>' +
'						<td>' +
'							Ei(er) 						</td>' +
'					</tr>' +
'' +
'				' +
'					<tr class="recipeview-table-row">' +
'						<td>' +
'							<strong>600 g</strong>' +
'						</td>' +
'						<td>' +
'							Butter, zerlassene						</td>' +
'					</tr>' +
'' +
'				' +
'					<tr class="recipeview-table-row">' +
'						<td>' +
'							<strong>2 Würfel</strong>' +
'						</td>' +
'						<td>' +
'							Hefe, frische (ersatzweise 4 Pck. Trockenhefe)						</td>' +
'					</tr>' +
'' +
'				' +
'					<tr class="recipeview-table-row">' +
'						<td>' +
'							<strong>1 Tasse</strong>' +
'						</td>' +
'						<td>' +
'							Milch, lauwarme						</td>' +
'					</tr>' +
'' +
'				' +
'					<tr class="recipeview-table-row">' +
'						<td>' +
'							<strong>1 Tasse</strong>' +
'						</td>' +
'						<td>' +
'							Wasser 						</td>' +
'					</tr>' +
'' +
'				' +
'					<tr class="recipeview-table-row">' +
'						<td>' +
'							<strong>650 g</strong>' +
'						</td>' +
'						<td>' +
'							Hagelzucker 						</td>' +
'					</tr>' +
'' +
'				' +
'			</table>' +
'		</div>' +
'' +
'	' +
'    	<h2>Zubereitung</h2>' +
'' +
'	Das Mehl mit dem Vanillinzucker und dem Salz in eine Schüssel geben und vermischen. Die Hefe zerbröseln und in der lauwarmen Milch auflösen. Die Eier, die Hefemilch, das Wasser und die Butter zum Mehl geben, alles vermischen und den Teig einige Minuten schlagen. Den Teig eine halbe Stunde zugedeckt an einem warmen Ort gehen lassen.<br />' +
'<br />' +
'Nach dem Ruhen, den Hagelzucker unter den Teig rühren und die Waffeln sofort im Waffeleisen (vorzugsweise für rechteckige Waffeln) ausbacken.' +
'    	<h2>Weitere Informationen</h2>' +
'' +
'	<div class="recipeview-table-wrapper">' +
'		<table class="recipeview-table">' +
'' +
'						<tr class="recipeview-table-row">' +
'				<td>' +
'										<strong>Arbeitszeit:</strong>' +
'				</td>' +
'				<td>' +
'					1 Std.				</td>' +
'			</tr>' +
'' +
'			' +
'			' +
'						<tr class="recipeview-table-row">' +
'				<td>' +
'										<strong>Schwierigkeitsgrad:</strong>' +
'				</td>' +
'				<td>' +
'					normal				</td>' +
'			</tr>' +
'' +
'						<tr class="recipeview-table-row">' +
'				<td>' +
'										<strong>Kalorien p. P.:</strong>' +
'				</td>' +
'				<td>' +
'					' +
'												keine Angabe									</td>' +
'			</tr>' +
'' +
'						<tr class="recipeview-table-row">' +
'				<td>' +
'					<strong>Verfasser:</strong>' +
'				</td>' +
'				<td>' +
'					moppeldiefischin				</td>' +
'			</tr>' +
'' +
'						<tr class="recipeview-table-row">' +
'				<td>' +
'					<strong>Freischaltung:</strong>' +
'				</td>' +
'				<td>' +
'					11.05.09				</td>' +
'			</tr>' +
'' +
'						<tr class="recipeview-table-row">' +
'				<td>' +
'										<strong>Bewertung:</strong>' +
'				</td>' +
'				<td>' +
'					<div class="rating rating-4_5"></div>' +
'				</td>' +
'			</tr>' +
'' +
'		</table>	</div>' +
'    	<h2>Rezept jetzt teilen</h2>' +
'	<ul class="sharetabs clearfix">' +
'		<li class="sharetabs-item">' +
'			<a href="/url-goto-utf8.php?url=https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fwww.chefkoch.de%2Frezepte%2F1371561242037991%2FBelgische-Waffeln-mit-Hagelzucker.html" class="icon-button icon-facebook">' +
'				<span>Facebook</span>' +
'			</a>' +
'		</li>' +
'		<li class="sharetabs-item">' +
'						<a href="/url-goto-utf8.php?url=http://twitter.com/home?status=Hunger%3F+Rezept+auf+Chefkoch.de%3A++http%3A%2F%2Fwww.chefkoch.de%2Frezepte%2F1371561242037991%2FBelgische-Waffeln-mit-Hagelzucker.html+%23rezept" target="_blank" class="icon-button icon-twitter" title="Auf Twitter posten">' +
'				<span>Twitter</span>' +
'			</a>' +
'		</li>' +
'		<li class="sharetabs-item">' +
'			<a href="/url-goto-utf8.php?url=https://plus.google.com/share?url=http%3A%2F%2Fwww.chefkoch.de%2Frezepte%2F1371561242037991%2FBelgische-Waffeln-mit-Hagelzucker.html" class="icon-button icon-google-plus">' +
'				<span>Google+</span>' +
'			</a>' +
'		</li>' +
'		<li class="sharetabs-item">' +
'						<a href="mailto:?subject=Rezept%20auf%20Chefkoch.de:%20Belgische Waffeln mit Hagelzucker&body=Ich%20habe%20ein%20leckeres%20Rezept%20auf%20Chefkoch.de%20gefunden:%0A%0ABelgische Waffeln mit Hagelzucker%0Ahttp://www.chefkoch.de/rezepte/1371561242037991/Belgische-Waffeln-mit-Hagelzucker.html" class="icon-button icon-mail">' +
'				<span>Mail</span>' +
'			</a>' +
'		</li>' +
'' +
'	</ul>' +
'' +
'    	<div id="recipe-comments">' +
'' +
'		<h2>Kommentare</h2>' +
'		' +
'			<ul class="commentlist">' +
'				' +
'					<li class="commentlist-item comment-helpful">' +
'						<div class="comment-text">genau so sollen sie schmecken, die besten Waffeln der Welt :-) So kennen wir sie aus Belgien und aus Frankreich...mmmmhhhhh! Schön mit Nutella, Puderzucker oder Sahne geniessen!' +
'<br>Danke für dieses einfache und dennoch super leckere Rezept!!!!' +
'<br>' +
'<br>LG' +
'<br>Isolde</div>' +
'						<div class="comment-arrow"></div>' +
'						<div class="comment-meta"><strong>percussionfan</strong> &middot; 25.10.2009 09:12 Uhr</div>' +
'					</li>' +
'' +
'                    					' +
'				' +
'					<li class="commentlist-item">' +
'						<div class="comment-text">Bin gerade beim backen kann nur sagen echt lecker wie bei ikea. ' +
'<br>' +
'<br>Jeannette</div>' +
'						<div class="comment-arrow"></div>' +
'						<div class="comment-meta"><strong>kaenga1</strong> &middot; 08.01.2010 13:42 Uhr</div>' +
'					</li>' +
'' +
'                    					' +
'				' +
'					<li class="commentlist-item">' +
'						<div class="comment-text">Das Rezept hält, was es verspricht! :) Auch die von mir damit Beglückte war einfach nur begeistert. Die Waffeln sind weich vom Teig her, dennoch knusprig durch den Zucker und harmonieren perfekt mit verschiedenen \"Zusätzen\" wie Eis, Sahne oder Früchten. Foto folgt! Und vielen Dank fürs Rezept!</div>' +
'						<div class="comment-arrow"></div>' +
'						<div class="comment-meta"><strong>gta00</strong> &middot; 10.04.2010 12:24 Uhr</div>' +
'					</li>' +
'' +
'                    					' +
'				' +
'					<li class="commentlist-item">' +
'						<div class="comment-text">Hallo' +
'<br>' +
'<br>kann mir bitte jemand helfen,die angegebenen menge ist für mich viel zu viel.mochte ungefähr 15 Stück backen' +
'<br>Wieviel müsste ich den von den Zutaten nehmen?' +
'<br>Die hälfte vielleicht?' +
'<br>' +
'<br>L:G: rafi</div>' +
'						<div class="comment-arrow"></div>' +
'						<div class="comment-meta"><strong>rafi1980</strong> &middot; 06.05.2010 14:44 Uhr</div>' +
'					</li>' +
'' +
'                    											<li class="commentlist-item comment-answer">' +
'' +
'							<div class="comment-text">Hallo Rafi,' +
'<br>' +
'<br>würde es mit 500g Mehl versuchen, auf alle Fälle.' +
'<br>Aber keine Angst - die Waffeln schmecken so lecker, da kannst auch ruhig mehr davon machen - die werden sicherlich gegessen ;-)' +
'<br>' +
'<br>LG,' +
'<br>Isolde</div>' +
'							<div class="comment-arrow"></div>' +
'							<div class="comment-meta"><strong>percussionfan</strong> &middot; 17.07.2010 10:24 Uhr</div>' +
'						</li>' +
'					' +
'				' +
'					<li class="commentlist-item">' +
'						<div class="comment-text">Nun hätte ich eine Frage...!' +
'<br>Würde diese leckeren Waffeln sehr gerne an meinem Geburtstags abends als Nachspeise backen, sozusagen das Waffeleisen aufstellen, jeder kann sich seine Waffeln selbst ausbacken und nach Belieben belegen...! ' +
'<br>Könnte ich den Teig vorbereiten, portinieren und kühlstellen?' +
'<br>Hat das schon mal jemand probiert?' +
'<br>Wenn wir die Waffeln in Frankreich kaufen, dann werden so kleine Teigkugeln aus nem Kühlschrank geholt und ins Waffeleisen gelegt...!' +
'<br>' +
'<br>Würde mich über eine rasche Antwort sehr freuen, da mein Geburtstag bereits in 1 Woche ist...:-)' +
'<br>' +
'<br>Vielen Dank!' +
'<br>Isolde</div>' +
'						<div class="comment-arrow"></div>' +
'						<div class="comment-meta"><strong>percussionfan</strong> &middot; 17.07.2010 10:23 Uhr</div>' +
'					</li>' +
'' +
'                    											<li class="commentlist-item comment-answer">' +
'' +
'							<div class="comment-text">Hallo percussionfan ;-),' +
'<br>' +
'<br>erst mal danke für dein Interesse an den waffeln. Zu deiner Frage habe ich leider so direkt keine \"sichere\" Antwort, weil der Teig von frz. Waffeln doch um eine Kante anders zubereitet werden als die belgischen.' +
'<br>Ausprobiert habe ich es noch nicht, aber probieren geht über studieren sagt man ja so schön. Du kannst  ja schon einmal vor deinem geburtstag die Waffeln machen und  etwas vom teig aufheben. Mit dem rest kannst du es ja versuchen... wer weiß ;-)' +
'<br>' +
'<br>...und schon mal  viel Spaß beim feiern!!!' +
'<br>' +
'<br>Lg' +
'<br>mo</div>' +
'							<div class="comment-arrow"></div>' +
'							<div class="comment-meta"><strong>moppeldiefischin</strong> &middot; 20.07.2010 20:22 Uhr</div>' +
'						</li>' +
'					' +
'				' +
'					<li class="commentlist-item comment-helpful">' +
'						<div class="comment-text">Hallöchen,' +
'<br>' +
'<br>wie versprochen melde ich mich nun, nachdem ich die Waffeln mit \"erhöhter Ruhezeit\" ;-) ausprobiert habe.' +
'<br>Habe die Waffeln erst 5 Std. nachdem ich den Teig gemacht habe, ausgebacken, u. sie sind sehr, sehr lecker geworden!' +
'<br>Habe den Rest vom Teig im Kühlschrank aufbewahrt und heute Morgen noch einmal Waffeln für Kind u. Mann ausgebacken - perfekt!' +
'<br>' +
'<br>Habe nur die Hälfte des Rezepts gemacht und das werden ca. 13 Waffeln bei mir.  Habe 3 Eier Größe L verwendet.' +
'<br>' +
'<br>GLG,' +
'<br>Isolde</div>' +
'						<div class="comment-arrow"></div>' +
'						<div class="comment-meta"><strong>percussionfan</strong> &middot; 22.07.2010 12:50 Uhr</div>' +
'					</li>' +
'' +
'                    					' +
'				' +
'					<li class="commentlist-item">' +
'						<div class="comment-text">Die besten Waffeln, die ich je gegessen habe !!!' +
'<br>Liebe Grüße juliaklara</div>' +
'						<div class="comment-arrow"></div>' +
'						<div class="comment-meta"><strong>juliaklara</strong> &middot; 14.09.2010 20:57 Uhr</div>' +
'					</li>' +
'' +
'                    					' +
'				' +
'					<li class="commentlist-item">' +
'						<div class="comment-text">Hallo,' +
'<br>also ich muss sagen, die Waffeln sind super, super, super.' +
'<br>' +
'<br>Musste sie jetzt in zwei Wochen schon zwei Mal machen und alle wollen mehr.' +
'<br>' +
'<br>Musste zwar jedesmal den Teig nach dem Gehen wieder einfangen, aber so war´s dann auch noch lustig.' +
'<br>' +
'<br>Vielen Dank für´s Rezept.' +
'<br>' +
'<br>viele Grüße</div>' +
'						<div class="comment-arrow"></div>' +
'						<div class="comment-meta"><strong>charly100</strong> &middot; 30.09.2010 08:40 Uhr</div>' +
'					</li>' +
'' +
'                    					' +
'				' +
'					<li class="commentlist-item">' +
'						<div class="comment-text">Moin,' +
'<br>' +
'<br>lecker, einfach nur lecker! Meine Familie war auch ganz begeistert.' +
'<br>' +
'<br>lG krebsi62</div>' +
'						<div class="comment-arrow"></div>' +
'						<div class="comment-meta"><strong>krebsi62</strong> &middot; 30.10.2010 01:43 Uhr</div>' +
'					</li>' +
'' +
'                    					' +
'				' +
'					<li class="commentlist-item">' +
'						<div class="comment-text">sehr lecker etwas zu süß und waffeleisen schwer zu reinigen</div>' +
'						<div class="comment-arrow"></div>' +
'						<div class="comment-meta"><strong>dreichert1</strong> &middot; 11.01.2011 09:25 Uhr</div>' +
'					</li>' +
'' +
'                    					' +
'							</ul>' +
'' +
'            			<div class="clearfix">' +
'' +
'				' +
'				' +
'					<a href="/rezepte/m1371561242037991/1/Belgische-Waffeln-mit-Hagelzucker.html?cp=2#recipe-comments" class="button-green button-next icon-angle-right">neuere Kom.</a>' +
'' +
'				' +
'			</div>' +
'' +
'		' +
'	</div>' +
'		<a href="http://www.chefkoch.de/rezepte/1371561242037991/Belgische-Waffeln-mit-Hagelzucker.html" class="button-green icon-angle-right">Zur Desktop-Version</a>' +
'</section>' +
'' +
'		<!-- ~~~~~~~~~ -->' +
'		<!--  Werbung  -->' +
'		<!-- ~~~~~~~~~ -->' +
'' +
'		<div class="mobile_ad"><script src="http://live-emsservice.elasticbeanstalk.com/ad-ids.php" type="text/javascript"></script>' +
'    <div id="AmobeeAd2">' +
'			<script type="text/javascript">' +
'							 getAmobeeAd(' +
'											document.getElementById(\'AmobeeAd2\'),' +
'											\'483\', // AdSpace ID (String)' +
'											\'\', // leer (String)' +
'											1, // Timeout in Sekunden (Integer)' +
'											0, // 1 fuer Test Requests (Integer)' +
'											\'\', // Ziel-URL (String) - leer fuer mobile Banner,' +
'											\'i=46.114.4.59&tp=4&t=1398088858456&prt=G+J&userId=60860282e998174f60222a11df07aff0&kw=Mehl|Salz|Vanillinzucker|Eier|Butter|Hefe|Milch|Wasser|Hagelzucker|Backen|Belgien|Europa|Kinder|Kuchen\' // Targeting-Werte als HTML Parameter (String),' +
'							 );' +
'			</script>' +
'    </div></div>' +
'' +
'		<!-- ~~~~~~~~ -->' +
'		<!--  Footer  -->' +
'		<!-- ~~~~~~~~ -->' +
'' +
'		<footer id="footer">' +
'' +
'			&copy; 1998-2014 pixelhouse GmbH<br>' +
'			<a href="/mobile/mobile-impressum.php" class="footer-link" rel="nofollow">Impressum</a> &middot; <a href="/mobile/mobile-privacy.php" class="footer-link" rel="nofollow">Datenschutz</a>' +
'			<img src="/mobile/mobile-counter-pi.php?a=1&page=/mobile/mobile-recipe-view.php&cache=not_cached" alt="">' +
'			<img src="/mobile/mobile-counter-visits.php?a=1&page=/mobile/mobile-recipe-view.php&cache=not_cached" alt="">' +
'' +
'			<!-- ~~~~~~~~~~~~~ -->' +
'			<!--  Statistiken  -->' +
'			<!-- ~~~~~~~~~~~~~ -->' +
'' +
'			' +
'			<script type="text/javascript" src="https://script.ioam.de/iam.js"></script>' +
'' +
'			<!-- SZM VERSION="2.0" -->' +
'			<script type="text/javascript">' +
'				var iam_data = {' +
'					"st":"mobchefk",' +
'					"cp":"ckmobile_rezeptanzeige"' +
'											, "sv":"mo"' +
'									}' +
'				iom.c(iam_data);' +
'			</script>' +
'			<!--/SZM -->' +
'' +
'			<!-- Eigenmessung Chefkoch -->' +
'			<script type="text/javascript">' +
'' +
'				// Statistik-Daten initialisieren' +
'				var statistic_data = {' +
'															"page": "/mobile/mobile-recipe-view.php",' +
'					"cached": "false"' +
'				};' +
'' +
'				submitMobileStatistics( statistic_data );' +
'' +
'			</script>' +
'' +
'									<script type="text/javascript">' +
'    var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");' +
'    document.write(unescape("%3Cscript src=\'" + gaJsHost + "google-analytics.com/ga.js\' type=\'text/javascript\'%3E%3C/script%3E"));' +
'</script>' +
'<script type="text/javascript">' +
'    var pageTracker = _gat._getTracker("UA-262191-39");' +
'    pageTracker._initData();' +
'    _gat._anonymizeIp();' +
'    pageTracker._trackPageview();' +
'</script>' +
'' +
'					<script type="text/javascript">' +
'			window.wtparam = {"wtconfig":{"linkTrack":"standard","linkTrackAttribute":"name","heatmap":"0","contentId":"de.mweb.rezept.show"},"customParameter":{"1":"1371561242037991","9":"8d6fd9f22cea8bba35a273fa826afe8c","6":"Backen;Belgien;Europa;Kinder;Kuchen","8":"66;44;172;48"},"contentGroup":{"1":"de","2":"mweb","3":"rezept"}};			document.write(unescape("%3Cscript%20src=\'http://js.chefkoch-cdn.de/js/webtrekk_v3_322.js\'%20type=\'text/javascript\'%3E%3C/script%3E"));' +
'		</script>' +
'		<noscript><div><img src="http://chefkoch01.webtrekk.net/886765640341113/wt.pl?p=322,de.mweb.rezept.show&cp1=1371561242037991&cp9=8d6fd9f22cea8bba35a273fa826afe8c&cp6=Backen%3BBelgien%3BEuropa%3BKinder%3BKuchen&cp8=66%3B44%3B172%3B48&cg1=de&cg2=mweb&cg3=rezept" height="1" width="1" alt="" /></div></noscript>' +
'			</footer>' +
'' +
'		</div> <!-- /wrapper -->' +
'' +
'	</body>' +
'</html>');
			});
		});
	}
});
