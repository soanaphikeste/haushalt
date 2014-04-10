Content =  {
	setContent : function(obj) {
		var content = $('#content');
		if(this.current !== undefined && this.current.onDetached !== undefined)
			this.current.onDetached();
		this.current = obj;
		content.css({"opacity" : "0"});
		setTimeout(function() {
			content.html("");
			content.append("<h1>" + obj.heading + "</h1>");
			var root = $("<div id='contentText'></div>").append(obj.html);
			content.append(root);
			content.css({"opacity" : "1"});
			if(obj.onAttached !== undefined)
				obj.onAttached(root);
		}, 200);
	}
};