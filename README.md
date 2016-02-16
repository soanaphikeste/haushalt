# Was ist das?
Die Haushaltssoftware ist sowohl eine Webseite als auch eine Androidapp, die das Zusammenleben mehrerer Personen in einem Haushalt vereinfachen soll. Außerdem enthält dieses Projet einen node.js Server für die Kommunikation mehrerer Haushaltsmitglieder.

## Features Website:
* Rezepte eintragen und ansehen
* Einkaufsliste 
  * erstellen
  * abhaken
  * leeren

## Features App:
* Einkaufsliste 
  * erstellen
  * abhaken
  * umsortieren

# Installation:
 1. Node installieren:

	`apt-get install node`
 2. ws installieren:

	`npm install ws`
 3. Mime installieren:

	`npm install mime`
 4. iconv-lite installieren:

	`npm install iconv-lite`
 5. request installieren:

	`npm install request`
 6. Starten:
	`node server.js`
 7. Im Browser öffnen:

	`http://localhost:8080`
 
# Protokoll:
## Generell:
Das Protokoll wird ausschließlich in JSON kommuniziert.
Es gibt Requests und Responses.

Es gibt 3 Stufen: Gast, Haushalt und Benutzer.

**Gast-Befehle:**

Können IMMER ausgeführt werden, auch wenn man nicht eingeloggt ist. 
Sie werden im globalen Kontext ausgeführt und betreffen keine Objekte direkt.

**Haushalt:**

Nachdem man in einen spezifischen Haushalt eingeloggt ist, können auf diesem Haushalt Befehle ausgeführt werden, sie Betreffen die konkrete Instanz des Haushaltes. Gast-Befehle sind immer noch möglich.

**Benutzer:**

Nachdem man sich in ein Familienmitglied des Haushaltes eingeloggt hat, kann man die Benutzer-Befehle ausführen, sie werden auf der konkreten Instanz des Benutzers ausgeführt. Haushalts- und Gast-Befehle sind immer noch möglich.

Events werden an alle entsprechenden Sockets gesendet, inklusive desjenigen, der
das Event ausgelöst hat. Es empfiehlt sich, Darstellen von Aktionen, die der User
tätigt erst dann darzustellen, wenn das Event ausgelöst wurde und nicht sofort nach
der Eingabe.

## Gast-Befehle:
### Register
	Attribute: {
		name: Name des Haushaltes (String),
		password: Das Passwort (String)
	}
	Return: {
		okay: Ob der Befehl erfolgreich war (Boolean)
	}
Erzeugt einen neuen Haushalt mit Namen "name" und Passwort "password".
Der Rückgabewert "okay" ist `true`, wenn der Haushalt erfolgreich angelegt wurde.
	
### Login
	Attribute: {
		name: Name des Haushaltes (String),
		password: Das Passwort (String)
	}
	Return: {
		okay: Ob der Befehl erfolgreich war (Boolean)
	}
Meldet einen Haushalt an. Wenn der Login korrekt ist, betritt der Benutzer die Haushalts-Ebene und hat Zugriff auf Haushalts-Befehle.
Der Rückgabewert "okay" ist `true`, wenn der Login erfolgreich war.
	
## Haushalt-Befehle:
### AddUser
	Attribute: {
		name: Name des Benutzers (String),
		password: Das Passwort (String)
	}
	Return: {
		okay: Ob der Befehl erfolgreich war (Boolean)
	}
Fügt dem Haushalt einen neuen Benutzer hinzu.
Der Rückgabewert "okay" ist `true`, wenn der Benutzer angelegt wurde.
	
### LoginUser
	Attribute: {
		name: Name des Benutzers (String),
		password: Das Passwort (String)
	}
	Return: {
		okay: Ob der Befehl erfolgreich war (Boolean)
	}
Meldet einen Benutzer im Haushalt an. War der Befehl erfolgreich, wird die Benutzer-Ebene betreten und der Benutzer hat Zugriff auf die Benutzer-Befehle.
Der Rückgabewert "okay" ist `true`, wenn der Login erfolgreich war.
	
### ListUsers
	Attribute: { }
	Return: {
		users : [
			{
				name : Name des Benutzers (String)
			}, ...
		]
	}
Gibt eine ungeordnete Liste aller Benutzer des aktuellen Haushaltes an.
Die Liste wird im primären Attribut "users" als Array gespeichert.
Das Array beinhaltet Objekte mit dem Attribut "name", das den Namen des Benutzers darstellt.
	
### ListRecipes
	Attribute: { }
	Return: {
		list : [
			Name des Rezeptes (String), ...
		]
	}
Gibt eine ungeordnete Liste der Namen aller Rezepte des Haushaltes zurück.
Die Namen sind gleichzeitig die Schlüssel zum Abfragen des Rezeptes.
	
### GetRecipe
	Attribute: {
		recipe : Name des Rezeptes (String)
	}
	Return : {
		name : Name des Rezeptes (String),
		author : Autor des Rezeptes (String),
		used : Wie oft das Rezept bereits benutzt wurde (Integer),
		description: Textuelle Beschreibung des Rezeptes (String),
		ingredients : [
			{
				name : Name der Zutat (String),
				amount : Menge der Zutat (Zahlenteil) (Integer),
				suffix : Suffix der Menge (Bspw: l, kg, g, pckg) (String),
				pp : Ob die Menge pro Person oder konstant ist true = pro Person (Boolean)
			}, ...
		]
	}
Gibt detaillierte Informationen zu einem Rezept aus.
"ingredients" ist ein Array das alle Zutaten enthält.

## Benutzer-Befehle:
### AddGrocery
	Attribute: {
		name : Name der Sache (String),
		amount : Menge (String)
	}
	Return : { }
Fügt der Einkaufsliste das Objekt hinzu.
	
### CheckGrocery
	Attribute: {
		index : Index der Sache im Array (Siehe Beschreibung) (Integer)
	}
	Return : { }
Setzt den Status der Sache in der Einkaufsliste als "Im Einkaufswagen".
Der Index ist der Index der Sache im Array. Es ist wichtig, dass die Indizes der Sachen im Array konstant bleiben.
Mittels "GetGroceries" kann ein Array der aktuellen Einkaufsliste mit intakten Indizes ermittelt werden. Werden neue Einträge hinzugefügt, so müssen diese UNTEN an das Array angefügt werden. Bei "ClearGroceries" wird aus dem Array gelöscht und alle Sachen rutschen auf.
	
### UncheckGrocery
	Attribute: {
		index : Index der Sache im Array (Siehe Beschreibung) (Integer)
	}
	Return : { }
Setzt den Status der Sache in der Einkaufsliste als "Nicht im  Einkaufswagen". Siehe auch: "CheckGrocery"
	
### ClearGrocery
	Attribute: { }
	Return : { }
Löscht alle Sachen in der Einkaufsliste, deren Status "Im Einkaufswagen" ist (die checked sind). Siehe auch: "CheckGrocery"
	
### AddRecipe
	Attribute: {
		name : Name des Rezeptes (String),
		description: Textuelle Beschreibung des Rezeptes (String),
		ingredients : [
			{
				name : Name der Zutat (String),
				amount : Menge der Zutat (Zahlenteil) (Integer),
				suffix : Suffix der Menge (Bspw: l, kg, g, pckg) (String),
				pp : Ob die Menge pro Person oder konstant ist true = pro Person (Boolean)
			}, ...
		]
	}
	Return: { }
Erstellt ein neues Rezept in der Datenbank. Es wird angenommen, dass die Mengenangaben des Rezeptes für **EINE PORTION** gelten.
	
### GetGroceries
	Attribute: { }
	Return: {
		groceries : [
			{
				name : Name der Sache (String),
				amount : Menge (String),
				user : Wer die Sache eingetragen hat (String),
				checked : Ob die Sache "Im Einkaufswagen liegt" (Boolean)
			}, ...
		]
	}
Gibt eine Liste mit allen Einträgen auf der Einkaufsliste zurück.
Siehe auch: "CheckGrocery"
	
	
## Haushalt-Events:
### GroceryCheck
	Attribute: {
		index : Index der Sache auf der Einkaufsliste, die abgehakt wurde (Integer)
	}
Wird gesendet, wenn ein Benutzer etwas auf der Einkaufsliste abhakt.
Der Index verweist auf die Sache im Array, die abgehakt wurde. Siehe auch: "CheckGrocery".
Die Sache sollte ausgegraut werden o.Ä.

### GroceryUncheck
	Attribute: {
		index : Index der Sache auf der Einkaufsliste, die nicht mehr abgehakt ist (Integer)
	}
Wird gesendet, wenn ein Benutzer etwas auf der Einkaufsliste als nicht mehr abgehakt markiert.
Der Index verweist auf die Sache im Array, die geändert wurde. Siehe auch: "CheckGrocery".
Die Sache sollte wieder normal dargestellt werden.

### GroceryClear
	Attribute: { }
Wird gesendet wenn jemand die Einkaufsliste "zur Kasse bringt".
Alle Einträge auf der Liste, die abgehakt sind (checked), **MÜSSEN** gelöscht werden. Um die Indizes des Arrays konstant und korrekt zu halten ist das Löschen unumgänglich.
Andere Sachen müssen entsprechend aufgerückt werden. Siehe auch: "CheckGrocery".

### GroceryAdd
	Attribute {
		name : Name der Sache auf der Liste (String),
		amount : Mengenangabe (String),
		user : Name desjenigen, der die Sache hinzugefügt hat (String),
		checked: Ob die Sache abgehakt ist (Boolean)
	}
Wird gesendet, wenn jemand eine Sache der Einkaufsliste hinzugefügt hat.
Sie sollte **DANN UND ERST DANN** dargestellt werden, der Broadcast wird an alle, inklusive desjenigen, der das Event ausgelöst hat gesendet.
