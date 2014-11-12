chrome.runtime.sendMessage({method: "getLikeDislikeMode"}, function(response) {
	if(response.likedislikemode === "commentlike")
	{
		var a = $('a[id^="up_"]');
		chrome.runtime.sendMessage({method: "sendRedirect", location: "https://news.ycombinator.com/" + $(a[0]).attr("href")}, function(response) {});
	}	
	else if(response.likedislikemode === "commentdislike")
	{
		var a = $('a[id^="down_"]');
		chrome.runtime.sendMessage({method: "sendRedirect", location: "https://news.ycombinator.com/" + $(a[0]).attr("href")}, function(response) {});
	}
	// "none" or something else, do nothing
});

//comment like/dislike:
//1. user clicks arrow. likedislikemode set to "commentlike" or "commentdislike". Tab opened to /reply
//2. on /reply, first up arrow is located  and tab redirectd to location at /vote
//3. /vote automatically redirects to /x where likedislikemode set to "none"
//4. process is complete. Tab is closed.

// story like/dislike
//1. user clicks arrow. likedislikemode set to "storylike" or "storydislike". tab opened to /item
//2. on /item, first up arrow is located, likedislikemode advanced to "storyliking" and tab redirected to location at /vote
//3. /vote automatically redirects to /item 
//4. process is complete. likedislikemode set to "none" and tab is closed.