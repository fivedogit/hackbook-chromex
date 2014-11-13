// if we reach the x page with mode= commentlike or commentdislike, close the tab.
chrome.runtime.sendMessage({method: "getLikeDislikeMode"}, function(response) {
	if(response.likedislikemode === "commentlike" || response.likedislikemode === "commentdislike") // this is the final step of the comment like-dislike
	{
		chrome.runtime.sendMessage({method: "setLikeDislikeMode", likedislikemode: "none"}, function(response) {
			chrome.runtime.sendMessage({method: "closeTab"}, function(response) {});
		});
	}	
});
