Content = 
{
	setContent : function(obj)
	{
		var content = $('#content');
		content.css({"opacity" : "0"});
		setTimeout(function()
		{
			content.html("");
			content.append("<h1>" + obj.heading + "</h1>");
			content.append($("<div id='contentText'></div>").append(obj.html));
			content.css({"opacity" : "1"});
			if(obj.onContentAttached !== undefined)
				obj.onContentAttached();
		}, 200);
	}
};
