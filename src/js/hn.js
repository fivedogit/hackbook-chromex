/*
 * The extension sends the user to https://news.ycombinator.com/login whenever the "login" button is clicked.
 */
//alert("calling getHNLoginStep");
chrome.runtime.sendMessage({method: "getHNLoginStep"}, function(response) { 
	//alert("inside hn.js script, received response.hn_login_step=" + response.hn_login_step);
	if(response.hn_login_step === 1)
	{
		var elements_of_pagetop_class = $(".pagetop");
		var kids = null;
		var kid = null;
		var href = null;
		var detected_screenname = null;
		var hn_screenname_found = false;
		if(elements_of_pagetop_class.length && elements_of_pagetop_class.length > 0)
		{
			for(var x=0; x < elements_of_pagetop_class.length && hn_screenname_found === false; x++)
			{
				if($(elements_of_pagetop_class[x]).children())
				{
					kids = $(elements_of_pagetop_class[x]).children();
					for(var y=0; y < kids.length && hn_screenname_found === false; y++)
					{
						kid = kids[y];
						if(kid.tagName === "A")
						{
							href = $(kid).attr("href");
							if(href.indexOf("user?id=")===0)
							{
								var i = href.indexOf("id=") + 3;
								detected_screenname = href.substr(i);
										hn_screenname_found = true;
							}	
						}	
					}	
				}	
			}	
		}	

		if(hn_screenname_found === false)
		{
			// do nothing
		}	
		else
		{
			//alert("logged in to HN");
			// we've detected a username on hacker news, tell background to
			// (a) see if the user is already logged in as the detected_screenname. If so, do nothing.
			// (b) 
			chrome.runtime.sendMessage({method: "isUserLoggedInToExtension", detected_screenname: detected_screenname}, function(response) { 
				if(response.logged_in === "yes")
				{
					chrome.runtime.sendMessage({method: "setHNLoginStep", hn_login_step: 0}, function(response) {
						//window.location = "https://news.ycombinator.com/user?id=" + detected_screenname + "&extmode=login";
					});
				}	
				else
					window.location = "https://news.ycombinator.com/user?id=" + detected_screenname;
			});
		}	
	}	
	else
	{
		chrome.runtime.sendMessage({method: "setHNLoginStep", hn_login_step: 0}, function(response) {
			//window.location = "https://news.ycombinator.com/user?id=" + detected_screenname + "&extmode=login";
		});
	}
});

