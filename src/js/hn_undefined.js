// if we reach the undefined page with mode=commentlike commentdislike storylike or storydislike, close the tab.
chrome.runtime.sendMessage({method: "getLikeDislikeMode"}, function(response) {
	if(response.likedislikemode === "commentlike" || response.likedislikemode === "commentdislike" ||
			response.likedislikemode === "storylike" || response.likedislikemode === "storydislike") // this is the final step of the story like-dislike
	{
		chrome.runtime.sendMessage({method: "setLikeDislikeMode", likedislikemode: "none"}, function(response) {
			chrome.runtime.sendMessage({method: "closeTab"}, function(response) {});
		});
	}	
});

// comment like/dislike:
// 1. user clicks arrow. likedislikemode set to "like" or "dislike". Tab opened to /reply
// 2. on /reply, first up arrow is located and tab redirectd to location at /vote
// 3. /vote automatically redirects to /x (here) 
// 4. process is complete. Tab is closed.

// page like/dislike
// 1. user clicks arrow. likedislikemode set to "like" or "dislike". tab opened to /item
// 2. on /item, first up arrow is located and tab redirected to location at /vote
// 3. /vote automatically redirects to /item 
// 4. process is complete. tab is closed.
