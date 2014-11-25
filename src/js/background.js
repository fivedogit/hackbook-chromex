var style = document.createElement('style'); 
var style_str =  "@font-face {";
style_str = style_str + "font-family: \"Silkscreen\";";
style_str = style_str + "src: url(\"type/slkscr.ttf\");";
style_str = style_str + "}";
style.innerHTML = style_str;
document.documentElement.appendChild(style); 

var docCookies={getItem:function(e){if(!e||!this.hasItem(e)){return null}return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)"+escape(e).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"),"$1"))},setItem:function(e,t,n,r,i,s){if(!e||/^(?:expires|max\-age|path|domain|secure)$/i.test(e)){return}var o="";if(n){switch(n.constructor){case Number:o=n===Infinity?"; expires=Tue, 19 Jan 2038 03:14:07 GMT":"; max-age="+n;break;case String:o="; expires="+n;break;case Date:o="; expires="+n.toGMTString();break}}document.cookie=escape(e)+"="+escape(t)+o+(i?"; domain="+i:"")+(r?"; path="+r:"")+(s?"; secure":"")},removeItem:function(e,t){if(!e||!this.hasItem(e)){return}document.cookie=escape(e)+"=; expires=Thu, 01 Jan 1970 00:00:00 GMT"+(t?"; path="+t:"")},hasItem:function(e){return(new RegExp("(?:^|;\\s*)"+escape(e).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=")).test(document.cookie)}}

var user_jo = null;
var currentURL = "";
var currentId = "";
var currentHostname = "";
var t_jo = null;
var threadstatus = 0;
var top="???";
var bottom="???";
var msfe_according_to_backend = (new Date).getTime(); // set to local machine time to start... will be reset to backend time by first thread call.
var allowed_hostnames;
var thread_request_data = "";
var hn_login_step = 0;
var hn_existing_about = "";
var likedislikemode = "none";
var masterid = "none"; // this is the master user retrieval id

(function() {
	chrome.tabs.getSelected(null, function(tab) {
		currentURL = tab.url;
		currentId = tab.id;
		currentHostname = getStandardizedHostname(currentURL);
		var canvas = document.getElementById("button_canvas");
		var context = canvas.getContext("2d");
		context.fillStyle = "#ffffff";
		context.font = "8px Silkscreen";
		context.fillText("PRIMER",0,0);
		drawHButton("gray", "white");
		getUser(true); // user_jo should always be null when this is called
	});
})();

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	  if(request.method === "logout")
	  {
		  //alert("bg listener logout method");
		  docCookies.removeItem("screenname");
		  docCookies.removeItem("this_access_token");
		  sendResponse({message: "You are now logged out."});
	  }  
	  else if(request.method == "getEndpoint") // don't need a getter for this as the receiver page can get this directly from cookie
	  {
		  sendResponse({endpoint: endpoint});
	  }  
	  else if(request.method == "getCounts") // don't need a getter for this as the receiver page can get this directly from cookie
	  {
		  if(user_jo && typeof user_jo.notification_count !== "undefined" && user_jo.notification_count !== null && typeof user_jo.newsfeed_count !== "undefined" && user_jo.newsfeed_count !== null)
			  sendResponse({no: user_jo.notification_count, nf: user_jo.newsfeed_count});
		  else
			  sendResponse({no: 0, nf: 0});
	  } 
	  else if(request.method == "sendRedirect") // don't need a getter for this as the receiver page can get this directly from cookie
	  {
		  chrome.tabs.update(sender.tab.id, {url: request.location});
	  }  
	  else if(request.method == "closeTab") // don't need a getter for this as the receiver page can get this directly from cookie
	  {
		  chrome.tabs.remove(sender.tab.id);
	  }  
	  else if(request.method == "setLastTabID") // don't need a getter for this as the receiver page can get this directly from cookie
	  {
		  docCookies.setItem("last_tab_id", request.last_tab_id);
	  }  
	  else if(request.method === "getHNLoginStep") // don't need a getter for this as the receiver page can get this directly from cookie
	  {
		  sendResponse({hn_login_step: hn_login_step});
	  }
	  else if(request.method === "setHNLoginStep") // don't need a getter for this as the receiver page can get this directly from cookie
	  {
		  //alert("bg setting hn_login_step to " + request.hn_login_step);
		  hn_login_step = request.hn_login_step;
		  sendResponse({response_status: "success"});
	  }
	  else if(request.method === "getHNExistingAbout") // don't need a getter for this as the receiver page can get this directly from cookie
	  {
		  sendResponse({hn_existing_about: hn_existing_about});
	  }
	  else if(request.method === "setHNExistingAbout") // don't need a getter for this as the receiver page can get this directly from cookie
	  {
		  //alert("bg setting hn_existing_about to " + request.hn_existing_about);
		  hn_existing_about = request.hn_existing_about;
		  sendResponse({response_status: "success"});
	  }
	  else if(request.method === "isUserLoggedInToExtension") // don't need a getter for this as the receiver page can get this directly from cookie
	  {
		  var sn = docCookies.getItem("screenname");
		  if(sn === null || (sn !== request.detected_screenname))
			  sendResponse({logged_in: "no"});
		  else // user appears to be logged in already. Assume this sn and tat are valid until user tries to do something
			  sendResponse({logged_in: "yes"});
	  }  
	  else if(request.method === "getHNAuthToken") // don't need a getter for this as the receiver page can get this directly from cookie
	  {
		  var tabid = 0;
		  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
			  tabid = tabs[0].id;
			  $.ajax({ 
					type: 'GET', 
					url: endpoint, 
					data: {
						method: "getHNAuthToken",
			            screenname: request.detected_screenname
			        },
			        dataType: 'json',
			        timeout: 10000,
			        async: true, 
			        success: function (data, status) {
			        	if(data.response_status === "success")
			        	{	
			        		chrome.tabs.sendMessage(tabid, {method: "gotHNAuthToken", token: data.token, manual_or_automatic: request.manual_or_automatic}, function(response) {});
			        	}
			        	else if(data.response_status === "error")
			        	{
			        		chrome.tabs.sendMessage(tabid, {method: "gotHNAuthToken", token: null}, function(response) {});
			        	}	
			        	else
			        	{
			        		chrome.tabs.sendMessage(tabid, {method: "gotHNAuthToken", token: null}, function(response) {});
			        	}
			        },
			        error: function (XMLHttpRequest, textStatus, errorThrown) {
			        	console.log("getHNAuthToken ajax error");
			            chrome.tabs.sendMessage(tabid, {method: "gotHNAuthToken", token: null}, function(response) {});
			        }
			  });
		  });
	  }
	  else if(request.method === "tellBackendToCheckUser")
	  {
		  // set up ajax to backend and have it check the user's page
		  var tabid = 0;
		  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
			  tabid = tabs[0].id;
			  $.ajax({ 
					type: 'GET', 
					url: endpoint, 
					data: {
						method: "verifyHNUser",
			            screenname: request.detected_screenname,
			            topcolor: request.topcolor
			        },
			        dataType: 'json', 
			        timeout: 33000,
			        async: true,  // not sure how to accomplish this otherwise
			        success: function (data, status) {
			        	if(data.response_status === "success")
			        	{	
			        		if(data.verified === true)
			        		{
			        			docCookies.setItem("screenname", data.screenname, 31536e3);
								docCookies.setItem("this_access_token", data.this_access_token, 31536e3);
								getUser(true);
			        		}	
			        		chrome.tabs.sendMessage(tabid, {method: "gotHNUserVerificationResponse", user_verified: data.verified}, function(response) {});
			        	}
			        	else if(data.response_status === "error")
			        	{
			        		console.log("verifyHNUser ajax success but r_s error");
			        		alert(data.message);
			        		chrome.tabs.sendMessage(tabid, {method: "gotHNUserVerificationResponse", user_verified: false, alert_msg: data.message}, function(response) {});
			        	}	
			        	else
			        	{
			        		console.log("verifyHNUser ajax success but r_s neither success nor error");
			        		alert("verifyHNUser ajax success but r_s neither success nor error");
			        		chrome.tabs.sendMessage(tabid, {method: "gotHNUserVerificationResponse", user_verified: false}, function(response) {});
			        	}
			        },
			        error: function (XMLHttpRequest, textStatus, errorThrown) {
			        	console.log("verifyHNUser ajax error");
			        	alert("There was an error logging you in to Hackbook.\nSometimes there is latency from the HN API.\nMy apologies. Please try again one more time.");
			        	chrome.tabs.sendMessage(tabid, {method: "gotHNUserVerificationResponse", user_verified: false}, function(response) {});
			        }
				});
		  });
	  }  
	  else if(request.method === "getFollowing")
	  {
		  if(user_jo)
			  sendResponse({following: user_jo.following});
		  else
			  sendResponse({following: null});
	  } 
	  else if(request.method === "followUser") // don't need a getter for this as the receiver page can get this directly from cookie
	  {
		  var target_screenname = request.target_screenname;
		  var screenname = docCookies.getItem("screenname");
		  var this_access_token = docCookies.getItem("this_access_token");
		  if(screenname !== null && this_access_token !== null && this_access_token.length == 32)// the shortest possible screenname length is x@b.co = 6.
		  {
			  if(screenname === target_screenname)
			  {
				  if(request.runtime_or_tabs === "runtime")
					  chrome.runtime.sendMessage({method: "userFailedToFollowOrUnfollowSomeone", target_screenname:target_screenname, message: "that's you"}, function(response) {});
				  else
				  {
					  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
						  chrome.tabs.sendMessage(tabs[0].id, {method: "userFailedToFollowOrUnfollowSomeone", target_screenname:target_screenname, message: "that's you"}, function(response) {});  
					  });
				  }
			  }  
			  else
			  {
				  $.ajax({
				  	    type: 'GET',
				  	    url: endpoint,
				  	    data: {
				  	        method: "followUser",
				  	        target_screenname: target_screenname,
				  	        screenname: screenname,  
				  	        this_access_token: this_access_token
				  	    },
				  	    dataType: 'json',
				  	    timeout: 10000,
				  	    async: true, 
				  	    success: function (data, status) {
				  	        if (data.response_status == "error") 
				  	        {
				  	        	if(request.runtime_or_tabs === "runtime")
									  chrome.runtime.sendMessage({method: "userFailedToFollowOrUnfollowSomeone", target_screenname:target_screenname, message: "error"}, function(response) {});
				  	        	else
				  	        	{
									  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
										  chrome.tabs.sendMessage(tabs[0].id, {method: "userFailedToFollowOrUnfollowSomeone", target_screenname:target_screenname, message: "error"}, function(response) {});  
									  });
				  	        	}
				  	        }
				  	        else //if (data.response_status === "success")
				  	        {
				  	        	if(request.runtime_or_tabs === "runtime")
				  	        		chrome.runtime.sendMessage({method: "userSuccessfullyFollowedSomeone", target_screenname:target_screenname}, function(response) {});
				  	        	else
				  	        	{
				  	        		chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
					  	        	    chrome.tabs.sendMessage(tabs[0].id, {method: "userSuccessfullyFollowedSomeone", target_screenname:target_screenname}, function(response) {});  
					  	        	});
				  	        	}
				  	        	getUser(true); // refresh the user object with this new follow
				  	        }
				  	    },
				  	    error: function (XMLHttpRequest, textStatus, errorThrown) {
				  	    	console.log(textStatus, errorThrown); 
				  	    	if(request.runtime_or_tabs === "runtime")
								  chrome.runtime.sendMessage({method: "userFailedToFollowOrUnfollowSomeone", target_screenname:target_screenname, message: "ajax error"}, function(response) {});
			  	        	else
			  	        	{
								  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
									  chrome.tabs.sendMessage(tabs[0].id, {method: "userFailedToFollowOrUnfollowSomeone", target_screenname:target_screenname, message: "ajax error"}, function(response) {});  
								  });
			  	        	}
				  	    }
				  	});
			  }
		  }
	  }
	  else if(request.method === "unfollowUser") // don't need a getter for this as the receiver page can get this directly from cookie
	  {
		  var target_screenname = request.target_screenname;
		  var screenname = docCookies.getItem("screenname");
		  var this_access_token = docCookies.getItem("this_access_token");
		  if(screenname !== null && this_access_token !== null && this_access_token.length == 32)// the shortest possible screenname length is x@b.co = 6.
		  {
			  if(screenname === target_screenname)
			  {
				  if(request.runtime_or_tabs === "runtime")
					  chrome.runtime.sendMessage({method: "userFailedToFollowOrUnfollowSomeone", target_screenname:target_screenname, message: "that's you"}, function(response) {});
				  else
				  {
					  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
						  chrome.tabs.sendMessage(tabs[0].id, {method: "userFailedToFollowOrUnfollowSomeone", target_screenname:target_screenname, message: "that's you"}, function(response) {});  
					  });
				  }
			  }  
			  else
			  {
				  $.ajax({
					    type: 'GET',
				  	    url: endpoint,
				  	    data: {
				  	        method: "unfollowUser",
				  	        target_screenname: target_screenname,
				  	        screenname: screenname,  
				  	        this_access_token: this_access_token
				  	    },
				  	    dataType: 'json',
				  	    timeout: 10000,
				  	    async: true, 
				  	    success: function (data, status) {
				  	        if (data.response_status == "error") 
				  	        {
				  	        	if(request.runtime_or_tabs === "runtime")
									  chrome.runtime.sendMessage({method: "userFailedToFollowOrUnfollowSomeone", target_screenname:target_screenname, message: "error"}, function(response) {});
				  	        	else
				  	        	{
				  	        		chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
				  	        			chrome.tabs.sendMessage(tabs[0].id, {method: "userFailedToFollowOrUnfollowSomeone", target_screenname:target_screenname, message: "error"}, function(response) {});  
				  	        		});
				  	        	}
				  	        }
				  	        else //if (data.response_status === "success")
				  	        {
				  	        	if(request.runtime_or_tabs === "runtime")
				  	        		chrome.runtime.sendMessage({method: "userSuccessfullyUnfollowedSomeone", target_screenname:target_screenname}, function(response) {});
				  	        	else
				  	        	{
				  	        		chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
					  	        	    chrome.tabs.sendMessage(tabs[0].id, {method: "userSuccessfullyUnfollowedSomeone", target_screenname:target_screenname}, function(response) {});  
					  	        	});
				  	        	}
				  	        	getUser(true); // refresh the user object with this new follow
				  	        }
				  	    },
				  	    error: function (XMLHttpRequest, textStatus, errorThrown) {
				  	    	console.log(textStatus, errorThrown); 
				  	    	if(request.runtime_or_tabs === "runtime")
								  chrome.runtime.sendMessage({method: "userFailedToFollowOrUnfollowSomeone", target_screenname:target_screenname, message: "ajax error"}, function(response) {});
			  	        	else
			  	        	{
								  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
									  chrome.tabs.sendMessage(tabs[0].id, {method: "userFailedToFollowOrUnfollowSomeone", target_screenname:target_screenname, message: "ajax error"}, function(response) {});  
								  });
			  	        	}
				  	    }
				  	});
			  }
		  }
	  }
	  else if(request.method === "getLikeDislikeMode") // don't need a getter for this as the receiver page can get this directly from cookie
	  {
		  sendResponse({likedislikemode: likedislikemode});
	  }
	  else if(request.method === "setLikeDislikeMode") // don't need a getter for this as the receiver page can get this directly from cookie
	  {
		  likedislikemode = request.likedislikemode
		  sendResponse({message: "success"});
	  }
	  else if(request.method === "getHideEmbeddedCounts") // don't need a getter for this as the receiver page can get this directly from cookie
	  {
		  if(user_jo)
			  sendResponse({hide_embedded_counts: user_jo.hide_embedded_counts});
		  else
			  sendResponse({hide_embedded_counts: false});
	  }
	  else if(request.method === "getHideInlineFollow") // don't need a getter for this as the receiver page can get this directly from cookie
	  {
		  if(user_jo)
			  sendResponse({hide_inline_follow: user_jo.hide_inline_follow});
		  else
			  sendResponse({hide_inline_follow: false});
	  }
  });

//REAL FUNCTIONS, IN EXECUTION ORDER TOP2BOTTOM (sort of) 
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, updatingtab) {
	if (changeInfo.status === "loading") // also fires at "complete", which I'm ignoring here. Only need one (this one).
	{
		chrome.tabs.getSelected(null, function(tab) { // only follow through if the updating tab is the same as the selected tab, don't want background tabs reloading and wrecking stuff
			if(updatingtab.url === tab.url) // the one that's updating is the one we're looking at. good. proceed
			{
				//alert("starting user retrieval loop onUpdated");
				startUserRetrievalLoop();
				if(currentURL !== tab.url) //  && tab.url.indexOf("chrome-extension://") !== 0) // only do this if the update is of a new url, no point in reloading the existing url again
				{	
					currentURL = updatingtab.url;
					currentId = tab.id;
					currentHostname = getStandardizedHostname(currentURL);
					doButtonGen();
				}
			}	
			else
			{
				//alert("updating other");
				// some other tab is updating. ignore.
			}	
		});
	}
	else if (changeInfo.status === "complete") 
	{
		//alert("onupdated complete"); (do nothing for now)
	}
}); 

chrome.tabs.onActivated.addListener(function(activeInfo) {
	chrome.tabs.getSelected(null, function(tab) {
		//getUser(); // get user on every valid tab change. This updates notifications and logstat (do not getUser on random page updates)
		//alert("starting user retrieval loop onActivated");
		startUserRetrievalLoop();
		if(typeof tab.url !== "undefined" && tab.url !== null && tab.url !== "")
		{
			currentURL = tab.url;
			currentId = tab.id;
			currentHostname = getStandardizedHostname(currentURL);
			doButtonGen();
		}
	});
}); 

function drawNotificationNumber()
{
	if(user_jo)
	{
		var n = 0;
		if(user_jo.url_checking_mode === "notifications_only")
			n = user_jo.notification_count;
		else 
			n = user_jo.notification_count + user_jo.newsfeed_count;
		
		if(n>9)
			n = 9;
		
		if(n === 0)
			return false; // we didn't draw anything

		drawHButton("#" + user_jo.hn_topcolor, "black", null, n);
		return true; // we drew a notification number
	}	
}

function doButtonGen()
{
	
	var url_at_function_call = currentURL;	   // need to save the currentURL bc if it has changed by the time threads come back, they are irrelevant at that point
	t_jo = null;
	
	var drew_notification_number = false;
	if(user_jo)
		drew_notification_number = drawNotificationNumber();
	
	if(drew_notification_number) // if we drew a notification number, don't overwrite it
	{
		if(!isValidURLFormation(currentURL))
			return;
		else
			getThread(url_at_function_call, false); // don't overwrite notification number
	}
	else
	{
		if(!isValidURLFormation(currentURL))
		{	drawHButton("gray", "white"); return; } // no notification number, overwrite
		else
			getThread(url_at_function_call, true); // no notification number, overwrite
	}
}

function getThread(url_at_function_call, updatebutton) 
{
	
	// This function always calls getThread and getUserSelf (if credentials available) at the same time. 
	// Once it is finished getting the thread, it updates the button and goes to a ready state for thread viewing.
	// The reason these are not called together is because the getThread call can be cached. The user call cannot.
	// Adding the user call to the thread call would render getThread uncacheable. 
	t_jo = null;
	var mode = "stealth";
	if(typeof user_jo !== "undefined" && user_jo !== null && typeof user_jo.url_checking_mode !== null && user_jo.url_checking_mode !== null)
		mode = user_jo.url_checking_mode;
	threadstatus = 1; 
	$.ajax({ 
		type: 'GET', 
		url: endpoint, 
		data: {
			method: "searchForHNItem",
            url: url_at_function_call,
            mode: mode
        },
        dataType: 'json', 
        async: true, 
        success: function (data, status) {
        	if(data.response_status === "success")
        	{	
        		msfe_according_to_backend = data.msfe;
        		if(data.objectID === "-1")
        		{
        			// no HN item, these two conditions end the animation and call finishThread();
	        		threadstatus=0;
	        		t_jo = {}; // this means stop animation and there's no item
        		}	
        		else
        		{
        			//alert("Got objectID from Hackbook, querying firebase");
        			$.ajax({ 
	        			type: 'GET', 
	        			url: "https://hacker-news.firebaseio.com/v0/item/" + data.objectID + ".json", 
	        	        dataType: 'json', 
	        	        async: true, 
	        	        success: function (data, status) {
	        	        	//alert("success getting object from firebase");
	        	        	if(typeof data.kids !== "undefined")
	        	        	{
	        	        		data.children = data.kids;
	        	        		delete data.kids;
	        	        	}
                    		t_jo = data;
                    		threadstatus=0;
	        	        },
	        	        error: function (XMLHttpRequest, textStatus, errorThrown) {
	        	        	//alert("network error getting object from firebase");
	        	        	if(currentURL === url_at_function_call)
	        	        	{
	        	        		threadstatus=0;
	        	        		//alert("drawing red HN ajax");
	        	        		drawHButton("gray", "red");
	        	        	}
	        	            console.log(textStatus, errorThrown);
	        	        }
	        		});
        		}	
        	}
        	else if(data.response_status === "error")
        	{
        		console.log("searchForHNItem response_status=error");
        		//alert("drawing red searchForHNItem response_status error");
        		drawHButton("gray", "red");
        	}	
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        	//alert("searchForHNItem ajax error");
        	if(currentURL === url_at_function_call)
        	{
        		threadstatus=0;
        	}
            console.log(textStatus, errorThrown);
            //alert("drawing red searchForHNItem ajax");
            drawHButton("gray", "red");
        }
	});	

	// the following ugly piece of code waits for up to 14 seconds for the thread to finish. Checking every .333 seconds, exiting upon completion
	// as ugly as this is, there really isn't a better, more robust way to do animations in a chrome extension. Loops with setTimeout get really hairy. Don't judge.
	// if there is a better way, please submit a bug report on Github or notify me on twitter (@fivedogit)
	if(updatebutton)
	{	
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",0);}else{return;}if(threadstatus===0){finishThread(url_at_function_call);return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",1);}else{return;}if(threadstatus===0){finishThread(url_at_function_call);return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",2);}else{return;}if(threadstatus===0){finishThread(url_at_function_call);return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",3);}else{return;}if(threadstatus===0){finishThread(url_at_function_call);return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",4);}else{return;}if(threadstatus===0){finishThread(url_at_function_call);return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",5);}else{return;}if(threadstatus===0){finishThread(url_at_function_call);return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",6);}else{return;}if(threadstatus===0){finishThread(url_at_function_call);return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",7);}else{return;}if(threadstatus===0){finishThread(url_at_function_call);return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",8);}else{return;}if(threadstatus===0){finishThread(url_at_function_call);return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",9);}else{return;}if(threadstatus===0){finishThread(url_at_function_call);return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",10);}else{return;}if(threadstatus===0){finishThread(url_at_function_call);return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",11);}else{return;}if(threadstatus===0){finishThread(url_at_function_call);return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",0);}else{return;}if(threadstatus===0){finishThread(url_at_function_call);return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",1);}else{return;}if(threadstatus===0){finishThread(url_at_function_call);return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",2);}else{return;}if(threadstatus===0){finishThread(url_at_function_call);return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",3);}else{return;}if(threadstatus===0){finishThread(url_at_function_call);return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",4);}else{return;}if(threadstatus===0){finishThread(url_at_function_call);return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",5);}else{return;}if(threadstatus===0){finishThread(url_at_function_call);return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",6);}else{return;}if(threadstatus===0){finishThread(url_at_function_call);return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",7);}else{return;}if(threadstatus===0){finishThread(url_at_function_call);return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",8);}else{return;}if(threadstatus===0){finishThread(url_at_function_call);return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",9);}else{return;}if(threadstatus===0){finishThread(url_at_function_call);return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",10);}else{return;}if(threadstatus===0){finishThread(url_at_function_call);return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",11);}else{return;}if(threadstatus===0){finishThread(url_at_function_call);return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",0);}else{return;}if(threadstatus===0){finishThread(url_at_function_call);return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",1);}else{return;}if(threadstatus===0){finishThread(url_at_function_call);return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",2);}else{return;}if(threadstatus===0){finishThread(url_at_function_call);return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",3);}else{return;}if(threadstatus===0){finishThread(url_at_function_call);return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",4);}else{return;}if(threadstatus===0){finishThread(url_at_function_call);return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",5);}else{return;}if(threadstatus===0){finishThread(url_at_function_call);return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",6);}else{return;}if(threadstatus===0){finishThread(url_at_function_call);return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",7);}else{return;}if(threadstatus===0){finishThread(url_at_function_call);return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",8);}else{return;}if(threadstatus===0){finishThread(url_at_function_call);return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",9);}else{return;}if(threadstatus===0){finishThread(url_at_function_call);return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",10);}else{return;}if(threadstatus===0){finishThread(url_at_function_call);return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",11);}else{return;}if(threadstatus===0){finishThread(url_at_function_call);return;}
	setTimeout(function(){if(url_at_function_call===currentURL){threadstatus=0}if(currentURL!==url_at_function_call){return;}finishThread(url_at_function_call);return;},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)});
	}
}

function finishThread(url_at_function_call) 
{
	if (url_at_function_call === currentURL) // don't update if the currentURL has changed, the info is irrelevant in that case
	{
		// *** we can only get here if no notification number has been drawn. No need to check again.
		if(typeof t_jo === "undefined" || t_jo === null)
		{
			//alert("drawing red finishThread t_jo undefined or null");
			drawHButton("gray", "darkred");
		}
		else if(typeof t_jo !== "undefined" && t_jo !== null)
		{
			if(typeof t_jo.score !== "undefined" && t_jo.score !== null && typeof t_jo.children !== "undefined" && t_jo.children !== null && t_jo.children.length) // both defined and not null
				drawTTUButton(t_jo.score+"", t_jo.children.length+"");
			else if (typeof t_jo.score !== "undefined" && t_jo.score !== null && (typeof t_jo.children === "undefined" || t_jo.children === null)) // score defined, but children undefined or null
				drawTTUButton(t_jo.score+"", "0");
			else
				drawHButton("gray", "white"); // t_jo defined and not null, but has neither a defined+nonnull .score nor a defined+nonnull .children
		}
		else
			drawHButton("gray", "white"); 		
	}
	else
	{
		// do nothing. Let whichever thread is in control now handle the button
	}	
}

//draws the button. if bottom=="NOTIFICATION", then top is displayed larger (and bottom is not displayed)
function drawTTUButton(top, bottom) {
	
 // Get the canvas element.
 var canvas = document.getElementById("button_canvas");

 // Specify a 2d drawing context.
 var context = canvas.getContext("2d");
 
 var top_fg = "black"; // assume the top-color is light since HN's top wording is black and it's unlikely users would choose dark on dark for their topcolor
 var bottom_fg = "white";
 var top_bg = "#ff6600";
 if(user_jo && typeof user_jo.hn_topcolor !== "undefined" && user_jo.hn_topcolor !== null)
	 top_bg = "#" + user_jo.hn_topcolor;
 var bottom_bg = "black";

 context.fillStyle = top_bg;
 context.fillRect (0, 0, 19, 8);
 if (bottom === "NOTIFICATION") // if this is a NOTIFICATION, fill the whole alert with topcolor
	 context.fillStyle = top_bg;
 else
	 context.fillStyle = bottom_bg;
 context.fillRect (0, 8, 19, 19); 
 var imageData = context.getImageData(0, 0, 19, 19);
 var pix = imageData.data;
 var r = 0; var g = 0; var b = 0; var a = 255;
 for (var i = 0, n = pix.length; i < n; i += 4) 
 {
 	r = 0; g = 0; b = 0; a = 255;
 	if (i === 0 || i === 72 || i === 1140 || i === 1212 // four corner roundings
 			|| (i >= 1216 && i <= 1224) || (i >= 1240 && i <= 1288) // first row below bubble
 			|| (i >= 1292 && i <= 1304) || (i >= 1316 && i <= 1364) // second row below bubble
 			|| (i >= 1368 && i <= 1384) || (i >= 1392))
 	{ 
 		r	= 255; g = 255; b = 255; a = 0; 
 		pix[i  ] = r; // red
 		pix[i+1] = g; // green
 		pix[i+2] = b; // blue
 		pix[i+3] = a; // i+3 is alpha (the fourth element)
 	}
 }

 context.putImageData(imageData, 0, 0);

 if (bottom === "NOTIFICATION")
 {
 	 context.fillStyle = top_fg;
     context.font = "16px Silkscreen";
     if (top === "1" || top === 1)
     	context.fillText(top,5,13);
     else
     	context.fillText(top,4,13);
 }
 else
 {
 	context.fillStyle = top_fg;
     context.font = "8px Silkscreen";
     if (top.length === 1)
     	context.fillText(top,7,6);
     else if (top.length === 2)
     	context.fillText(top,4,6);
     else if (top.length >= 3)
     {
    	 if (top*1 > 999)
    		 top = "999";
    	 context.fillText(top,1,6);
     }
     
     context.fillStyle = bottom_fg;
     context.font = "8px Silkscreen";
     if (bottom.length === 1)
     	context.fillText(bottom,7,14);
     else if (bottom.length === 2)
     	context.fillText(bottom,4,14);
     else if (bottom.length >= 3)
     {
    	 if (bottom*1 > 999)
    		 bottom = "999";
     	context.fillText(bottom,1,14);
     }
 }
 
 imageData = context.getImageData(0, 0, 19, 19);
 chrome.browserAction.setIcon({
   imageData: imageData
 });
}

function drawHButton(background_color, h_color, aframe, number)
{
	var x_offset = 0;
	if(typeof number === "undefined")
		number = 0; // signifying nothing to be shown.
	else if(number > 0)
		x_offset = -3;
	
	 // Get the canvas element.
	var canvas = document.getElementById("button_canvas");
	 // Specify a 2d drawing context.
	var context = canvas.getContext("2d");
	// var bg_r = "0x7e";
	// var bg_g = "0x7e";
	// var bg_b = "0x7e";
	
	
		
	context.fillStyle = background_color;
	if(devel === true)
		context.fillStyle = "pink";
	context.fillRect (0, 0, 19, 19); 
	 
	context.fillStyle = "gray";
	context.fillRect (0, 0, 19, 1);
	context.fillRect (18, 0, 1, 19);
	context.fillRect (0, 18, 19, 1);
	context.fillRect (0, 0, 1, 19);
	
	context.fillStyle = h_color;
	context.fillRect (7+x_offset, 4, 3, 15); // H left
	context.fillRect (8+x_offset, 3, 2, 1); // H left tilt top
	context.fillRect (13+x_offset, 10, 3, 9); // H right
	context.fillRect (11+x_offset, 8, 3, 1); // H crossbar top row 1
	context.fillRect (10+x_offset, 9, 5, 2); // H crossbar bottom rows 2/3
	 
	 if(aframe !== null)
		 context.fillRect ((aframe*2+-1), (aframe*-.6+7), 2, 2);
	 
	 if(number > 0)
	 {
		 if(number > 9)
			 number = 9;
		 context.fillStyle = "black";
		 context.font = "8px Silkscreen";
		 if(number === 1)
			 context.fillText(number+"",12,7);
		 else
			 context.fillText(number+"",11,7);
	 }	 
	 
	 var imageData = context.getImageData(0, 0, 19, 19);
	 var pix = imageData.data;
	 var r = 0; var g = 0; var b = 0; var a = 255;
	 for (var i = 0, n = pix.length; i < n; i += 4) 
	 {
	 	r = 0; g = 0; b = 0; a = 255;
	 	if (i === 0 || i === 72 || i === 1368 || i === 1440)//
	 	{ 
	 		r	= 255; g = 255; b = 255; a = 0; 
	 		pix[i  ] = r; // red
	 		pix[i+1] = g; // green
	 		pix[i+2] = b; // blue
	 		pix[i+3] = a; // i+3 is alpha (the fourth element)
	 	}
	 }
	 
	 chrome.browserAction.setIcon({
	   imageData: imageData
	 });
	}

function getUser(retrieve_asynchronously)
{
	
	var async = true;
	if(retrieve_asynchronously !== null && retrieve_asynchronously === false)
	{
		async = false;
		//alert("async=" + async);
	}
	var screenname = docCookies.getItem("screenname");
	var this_access_token = docCookies.getItem("this_access_token");
	if(screenname !== null && this_access_token !== null && this_access_token.length == 32)// the shortest possible screenname length is x@b.co = 6.
	{
		$.ajax({ 
			type: 'GET', 
			url: endpoint, 
			data: {
	            method: "getUserSelf",
	            screenname: screenname,							
	            this_access_token: this_access_token	
	        },
	        dataType: 'json', 
	        async: async, 
	        timeout: 7000,
	        success: function (data, status) {
	        	if (data.response_status === "error") 
            	{
            		if(data.error_code && data.error_code === "0000")
            		{
            			//alert("getUser error 0000");
            			docCookies.removeItem("screenname"); 
            			docCookies.removeItem("this_access_token");
            			user_jo = null;
            		}
            	} 
            	else if (data.response_status === "success") 
            	{	
            		if(data.user_jo) 
            		{ 	
            			user_jo = data.user_jo;
            			drawNotificationNumber();
            		}    
            	}
            	else
            	{
            		//alert("getUser problem. response_status neither success nor error");
            	}
	        },
	        error: function (XMLHttpRequest, textStatus, errorThrown) {
	            console.log(textStatus, errorThrown);
	        } 
		});
	}
	else if(screenname !== null || this_access_token !== null) // if either of these is not null and we've gotten here, 
	{													  // something is rotten in denmark re: cookie credentials, delete them 	
		docCookies.removeItem("screenname"); 
		docCookies.removeItem("this_access_token");
		user_jo = null;
	}
	else
	{
		user_jo = null; // proceed with user_jo = null
	}
}

function startUserRetrievalLoop()
{
	// rather than get the user on every new page update or thread update only, also get it once every minute so that notifications will show up even when there is no tab or page update.
	// Generate a new id and as long as it is the same as the masterid, get the user every minute for up to 10 minutes.
	var newid = makeid();
	masterid = newid;
	getUser(true);
	setTimeout(function(){if(masterid===newid){getUser(true);setTimeout(function(){if(masterid===newid){getUser(true);setTimeout(function(){if(masterid===newid){getUser(true);setTimeout(function(){if(masterid===newid){getUser(true);setTimeout(function(){if(masterid===newid){getUser(true);setTimeout(function(){if(masterid===newid){getUser(true);setTimeout(function(){if(masterid===newid){getUser(true);setTimeout(function(){if(masterid===newid){getUser(true);setTimeout(function(){if(masterid===newid){getUser(true);setTimeout(function(){if(masterid===newid){getUser(true)}else{return}},6e4)}else{return}},6e4)}else{return}},6e4)}else{return}},6e4)}else{return}},6e4)}else{return}},6e4)}else{return}},6e4)}else{return}},6e4)}else{return}},6e4)}else{return}},6e4)
}
	
	
function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 32; i++ )
    	text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
	
// FIRSTRUN 
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
    	chrome.tabs.create({url: chrome.extension.getURL("firstrun.html")});
    }else if(details.reason == "update"){
      //  var thisVersion = chrome.runtime.getManifest().version;
      //  alert("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }
});
