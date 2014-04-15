var _content;
Content =  {
	templates : {},
	scripts : {},
	setContent : function(name) {
		var self = this;
		var content = $('#content');
		if(this.current !== undefined && this.current.onDetached !== undefined)
			this.current.onDetached();
		content.css({"opacity" : "0"});
		setTimeout(function() {
			self.loadTemplate(name, function(html) {
				self.loadScript(name, function(js) {
					self.current = js;
					content.html("");
					location.hash = name;
					content.append("<h1>" + js.heading + "</h1>");
					var root = $("<div id='contentText'></div>").append(html);
					content.append(root);
					content.css({"opacity" : "1"});
					if(js.onAttached !== undefined)
						js.onAttached(root);
				});
			});
		}, 200);
	},
	loadTemplate : function(name, done) {
		console.log(name);
		var self = this;
		if(this.templates[name] === undefined) {
			$.ajax({
				url : "contents/" + name + "/template.html",
				dataType : "html"
			}).done(function(html) {
				self.templates[name] = html;
				done(html);
			});
		}
		else {
			done(this.templates[name]);
		}
	},
	loadScript : function(name, done) {
		var self = this;
		if(this.scripts[name] === undefined) {
			$.ajax({
				url : "contents/" + name + "/script.js",
				dataType : "script"
			}).done(function() {
				self.scripts[name] = self._content;
				done(self._content);
				if(self._content.onLoad !== undefined) self._content.onLoad();
			}).error(function(obj, err1, err2) {
				console.log(err1, err2);
			});
		}
		else {
			done(this.scripts[name]);
		}
	},
	define : function(obj) {
		this._content = obj;
	},
	setInfo : function(text) {
		var node = $('#headinfo');
		node.css({"opacity" : "0"});
		setTimeout(function() {
			node.html(text);
			node.css({"opacity" : "1"});
		}, 200);
	}
};
