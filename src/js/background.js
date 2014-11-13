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
			  sendResponse({notification_count: user_jo.notification_count, newsfeed_count: user_jo.newsfeed_count});
		  else
			  sendResponse({notification_count: null, newsfeed_count: null});
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
		  $.ajax({ 
				type: 'GET', 
				url: endpoint, 
				data: {
					method: "getHNAuthToken",
		            screenname: request.detected_screenname
		        },
		        dataType: 'json',
		        timeout: 3000,
		        async: false, // not sure how to accomplish this otherwise
		        success: function (data, status) {
		        	if(data.response_status === "success")
		        	{	
		        		//alert("got token=" + data.token);
		        		sendResponse({token: data.token});
		        	}
		        	else if(data.response_status === "error")
		        	{
		        		sendResponse({token: null});
		        	}	
		        	else
		        	{
		        		sendResponse({token: null});
		        	}
		        },
		        error: function (XMLHttpRequest, textStatus, errorThrown) {
		            console.log(textStatus, errorThrown);
		            sendResponse({token: null});
		        }
			});
	  }
	  else if(request.method === "tellBackendToCheckUser")
	  {
		  // set up ajax to backend and have it check the user's page
		  //alert("this is where a check should be made by the backend");
		  hn_login_status = "none";
		  $.ajax({ 
				type: 'GET', 
				url: endpoint, 
				data: {
					method: "verifyHNUser",
		            screenname: request.detected_screenname
		        },
		        dataType: 'json', 
		        timeout: 35000,
		        async: false,  // not sure how to accomplish this otherwise
		        success: function (data, status) {
		        	if(data.response_status === "success")
		        	{	
		        		if(data.verified === true)
		        		{
		        			//alert("User verified!");
		        			docCookies.setItem("screenname", data.screenname, 31536e3);
							docCookies.setItem("this_access_token", data.this_access_token, 31536e3);
							getUser(false);
							sendResponse({user_validated: true});
		        		}	
		        		else 
		        		{
		        			//alert("successful call, but not verified");
		        			sendResponse({user_validated: false});
		        		}	
		        	}
		        	else if(data.response_status === "error")
		        	{
		        		//alert("response_status === \"error\" message=" + data.message);
		        		sendResponse({user_validated: false});
		        	}	
		        	else
		        	{
		        		//alert("response neither success nor error. Fix this.");
		        		sendResponse({user_validated: false});
		        	}
		        },
		        error: function (XMLHttpRequest, textStatus, errorThrown) {
		            console.log(textStatus, errorThrown);
		            sendResponse({user_validated: false});
		        }
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
		  	    timeout: 3000,
		  	    async: false,  // not sure how to accomplish this otherwise
		  	    success: function (data, status) {
		  	        if (data.response_status == "error") 
		  	        	sendResponse({result: false});
		  	        else //if (data.response_status === "success")
		  	        {
		  	        	if(typeof user_jo.following === "undefined" || user_jo.following === null || isEmpty(user_jo.following))
			        		user_jo.following = [target_screenname];
			        	else
			        		user_jo.following.push(target_screenname);
		  	        	sendResponse({result: true});
		  	        }
		  	    },
		  	    error: function (XMLHttpRequest, textStatus, errorThrown) {console.log(textStatus, errorThrown); sendResponse({result: false});}
		  	});
		  	getUser(true); // refresh the user object with this new follow
		  }
	  }
	  else if(request.method === "unfollowUser") // don't need a getter for this as the receiver page can get this directly from cookie
	  {
		  var target_screenname = request.target_screenname;
		  var screenname = docCookies.getItem("screenname");
		  var this_access_token = docCookies.getItem("this_access_token");
		  if(screenname !== null && this_access_token !== null && this_access_token.length == 32)// the shortest possible screenname length is x@b.co = 6.
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
		  	    timeout: 3000,
		  	    async: false,  // not sure how to accomplish this otherwise
		  	    success: function (data, status) {
		  	        if (data.response_status == "error") 
		  	        	sendResponse({result: false});
		  	        else //if (data.response_status === "success")
		  	        {
		  	        	if(typeof user_jo.following === "undefined" || user_jo.following === null || isEmpty(user_jo.following))
			        	{
			        		// this should not happen because if we're unfollowing somebody, then user_jo.following had something 
			        	}
			        	else
			        	{
			        		var index = user_jo.following.indexOf(target_screenname);
			        		if(index >= 0) // i.e. not -1
			        			user_jo.following.splice(index,1);
			        	}
		  	        	sendResponse({result: true});
		  	        }
		  	    },
		  	    error: function (XMLHttpRequest, textStatus, errorThrown) {console.log(textStatus, errorThrown); sendResponse({result: false});}
		  	});
		  	getUser(true); // refresh the user object with this new unfollow
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
  });

//need to include this here because it resides in buttongen.js on the extension itself
var docCookies = {
		  getItem: function (sKey) {
		    if (!sKey || !this.hasItem(sKey)) { return null; }
		    return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
		  },
		  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
		    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return; }
		    var sExpires = "";
		    if (vEnd) {
		      switch (vEnd.constructor) {
		        case Number:
		          sExpires = vEnd === Infinity ? "; expires=Tue, 19 Jan 2038 03:14:07 GMT" : "; max-age=" + vEnd;
		          break;
		        case String:
		          sExpires = "; expires=" + vEnd;
		          break;
		        case Date:
		          sExpires = "; expires=" + vEnd.toGMTString();
		          break;
		      }
		    }
		    document.cookie = escape(sKey) + "=" + escape(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
		  },
		  removeItem: function (sKey, sPath) {
		    if (!sKey || !this.hasItem(sKey)) { return; }
		    document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sPath ? "; path=" + sPath : "");
		  },
		  hasItem: function (sKey) {
		    return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
		  },
		};

var style = document.createElement('style'); 
var style_str =  "@font-face {";
style_str = style_str + "font-family: \"Silkscreen\";";
style_str = style_str + "src: url(\"type/slkscr.ttf\");";
style_str = style_str + "}";
style.innerHTML = style_str;
document.documentElement.appendChild(style); 

var currentURL = "";
var currentId = "";
var currentHostname = "";
var t_jo;
var threadstatus = 0;
var top="???";
var bottom="???";
var msfe_according_to_backend = (new Date).getTime(); // set to local machine time to start... will be reset to backend time by first thread call.
var allowed_hostnames;
var thread_request_data = "";
var top_fg = "ffffff";
var bottom_fg = "ffffff";
var top_bg = "ff6600";
var bottom_bg = "000000";
var hn_login_step = 0;
var hn_existing_about = "";
var likedislikemode = "none";

(function() {
	getUser(true); // user_jo should always be null when this is called
	t_jo = null;
	chrome.tabs.getSelected(null, function(tab) {
		currentURL = tab.url;
		currentId = tab.id;
		currentHostname = getStandardizedHostname(currentURL);
		var canvas = document.getElementById("button_canvas");
		var context = canvas.getContext("2d");
		context.fillStyle = "#ffffff";
		context.font = "8px Silkscreen";
		context.fillText("PRIMER",0,0);
		drawHButton("#ff6600", "white");
		setTimeout(function() {doButtonGen();},2000);
	});
})();

// GENERIC FUNCTIONS
function getColorHexStringFromRGB(r, g, b)
{
	var r_hex = ~~r;
	r_hex = r_hex.toString(16);//.substring(2);
	if (r_hex.length === 1)
		r_hex = "0" + r_hex;
	var g_hex = ~~g;
	g_hex = g_hex.toString(16);//.substring(2);
	if (g_hex.length === 1)
		g_hex = "0" + g_hex;
	var b_hex = ~~b;
	b_hex = b_hex.toString(16);
	if (b_hex.length === 1)
		b_hex = "0" + b_hex;
	return "#" + r_hex + g_hex + b_hex;
}

//REAL FUNCTIONS, IN EXECUTION ORDER TOP2BOTTOM (sort of) 
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, updatingtab) {
	if (changeInfo.status === "loading") // also fires at "complete", which I'm ignoring here. Only need one (this one).
	{
		chrome.tabs.getSelected(null, function(tab) { // only follow through if the updating tab is the same as the selected tab, don't want background tabs reloading and wrecking stuff
			if(updatingtab.url === tab.url) // the one that's updating is the one we're looking at. good. proceed
			{
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
		getUser(); // get user on every valid tab change. This updates notifications and logstat (do not getUser on random page updates)
		if(typeof tab.url !== "undefined" && tab.url !== null && tab.url !== "")
		{
			currentURL = tab.url;
			currentId = tab.id;
			currentHostname = getStandardizedHostname(currentURL);
			//drawTTUButton("   ", "   "); // clear out anything that's there now
			doButtonGen();
		}
	});
}); 

function doButtonGen()
{
	var url_at_function_call = currentURL;	   // need to save the currentURL bc if it has changed by the time threads come back, they are irrelevant at that point
	t_jo = null;
	
	// priority order: 
	// 1. display a url error, if applicable
	// 2. go get thread
	// 		if notification, draw big number in button
	//      if not, draw thread info in button
	if(user_jo && user_jo.notification_count > 0 && user_jo.newsfeed_count > 0)
	{
		if((user_jo.notification_count + user_jo.newsfeed_count) > 9)
			drawTTUButton("9", "NOTIFICATION");
		else
			drawTTUButton((user_jo.notification_count+user_jo.newsfeed_count), "NOTIFICATION");
		getThread(url_at_function_call);  
	}	
	else if(user_jo && user_jo.notification_count > 0)
	{
		if(user_jo.notification_count > 9)
			drawTTUButton("9", "NOTIFICATION");
		else
			drawTTUButton(user_jo.notification_count, "NOTIFICATION");
		getThread(url_at_function_call);  
	}	
	else if(user_jo && user_jo.newsfeed_count > 0)
	{
		//alert("nfc > 0");
		if(user_jo.newsfeed_count > 9)
			drawTTUButton("9", "NOTIFICATION");
		else
		{
			drawTTUButton(user_jo.newsfeed_count, "NOTIFICATION");
		}
		getThread(url_at_function_call);  
	}	
	else if (!isValidURLFormation(currentURL) || (user_jo && user_jo.url_checking_mode === "notifications_only"))
	{
		drawHButton("gray", "white");
		return;
	}	
	else 
	{
		//alert("default");
		getThread(url_at_function_call); 
	}
}

function getThread(url_at_function_call) 
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
	        		t_jo = {};
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
	        	        		drawHButton("gray", "red");
	        	        	}
	        	            console.log(textStatus, errorThrown);
	        	        }
	        		});
        		}	
        	}
        	else
        	{
        		console.log("searchForHNItem response_status=error");
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
            drawHButton("gray", "red");
        }
	});	

	// the following ugly piece of code waits for up to 14 seconds for the thread to finish. Checking every .333 seconds, exiting upon completion
	// as ugly as this is, there really isn't a better, more robust way to do animations in a chrome extension. Loops with setTimeout get really hairy. Don't judge.
	// if there is a better way, please submit a bug report on Github or notify me on twitter (@fivedogit)
	
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",0);}if(threadstatus===0){finishThread(url_at_function_call);return;}if(currentURL!==url_at_function_call){return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",1);}if(threadstatus===0){finishThread(url_at_function_call);return;}if(currentURL!==url_at_function_call){return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",2);}if(threadstatus===0){finishThread(url_at_function_call);return;}if(currentURL!==url_at_function_call){return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",3);}if(threadstatus===0){finishThread(url_at_function_call);return;}if(currentURL!==url_at_function_call){return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",4);}if(threadstatus===0){finishThread(url_at_function_call);return;}if(currentURL!==url_at_function_call){return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",5);}if(threadstatus===0){finishThread(url_at_function_call);return;}if(currentURL!==url_at_function_call){return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",6);}if(threadstatus===0){finishThread(url_at_function_call);return;}if(currentURL!==url_at_function_call){return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",7);}if(threadstatus===0){finishThread(url_at_function_call);return;}if(currentURL!==url_at_function_call){return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",8);}if(threadstatus===0){finishThread(url_at_function_call);return;}if(currentURL!==url_at_function_call){return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",9);}if(threadstatus===0){finishThread(url_at_function_call);return;}if(currentURL!==url_at_function_call){return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",10);}if(threadstatus===0){finishThread(url_at_function_call);return;}if(currentURL!==url_at_function_call){return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",11);}if(threadstatus===0){finishThread(url_at_function_call);return;}if(currentURL!==url_at_function_call){return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",0);}if(threadstatus===0){finishThread(url_at_function_call);return;}if(currentURL!==url_at_function_call){return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",1);}if(threadstatus===0){finishThread(url_at_function_call);return;}if(currentURL!==url_at_function_call){return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",2);}if(threadstatus===0){finishThread(url_at_function_call);return;}if(currentURL!==url_at_function_call){return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",3);}if(threadstatus===0){finishThread(url_at_function_call);return;}if(currentURL!==url_at_function_call){return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",4);}if(threadstatus===0){finishThread(url_at_function_call);return;}if(currentURL!==url_at_function_call){return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",5);}if(threadstatus===0){finishThread(url_at_function_call);return;}if(currentURL!==url_at_function_call){return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",6);}if(threadstatus===0){finishThread(url_at_function_call);return;}if(currentURL!==url_at_function_call){return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",7);}if(threadstatus===0){finishThread(url_at_function_call);return;}if(currentURL!==url_at_function_call){return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",8);}if(threadstatus===0){finishThread(url_at_function_call);return;}if(currentURL!==url_at_function_call){return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",9);}if(threadstatus===0){finishThread(url_at_function_call);return;}if(currentURL!==url_at_function_call){return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",10);}if(threadstatus===0){finishThread(url_at_function_call);return;}if(currentURL!==url_at_function_call){return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",11);}if(threadstatus===0){finishThread(url_at_function_call);return;}if(currentURL!==url_at_function_call){return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",0);}if(threadstatus===0){finishThread(url_at_function_call);return;}if(currentURL!==url_at_function_call){return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",1);}if(threadstatus===0){finishThread(url_at_function_call);return;}if(currentURL!==url_at_function_call){return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",2);}if(threadstatus===0){finishThread(url_at_function_call);return;}if(currentURL!==url_at_function_call){return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",3);}if(threadstatus===0){finishThread(url_at_function_call);return;}if(currentURL!==url_at_function_call){return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",4);}if(threadstatus===0){finishThread(url_at_function_call);return;}if(currentURL!==url_at_function_call){return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",5);}if(threadstatus===0){finishThread(url_at_function_call);return;}if(currentURL!==url_at_function_call){return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",6);}if(threadstatus===0){finishThread(url_at_function_call);return;}if(currentURL!==url_at_function_call){return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",7);}if(threadstatus===0){finishThread(url_at_function_call);return;}if(currentURL!==url_at_function_call){return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",8);}if(threadstatus===0){finishThread(url_at_function_call);return;}if(currentURL!==url_at_function_call){return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",9);}if(threadstatus===0){finishThread(url_at_function_call);return;}if(currentURL!==url_at_function_call){return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",10);}if(threadstatus===0){finishThread(url_at_function_call);return;}if(currentURL!==url_at_function_call){return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","white",11);}if(threadstatus===0){finishThread(url_at_function_call);return;}if(currentURL!==url_at_function_call){return;}
	setTimeout(function(){if(url_at_function_call===currentURL){drawHButton("gray","red",null);threadstatus=0}if(currentURL!==url_at_function_call){return;}finishThread(url_at_function_call);return;},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)},250)});
}

function finishThread(url_at_function_call) 
{
	if (url_at_function_call === currentURL) // don't update if the currentURL has changed, the info is irrelevant in that case
	{
		if(user_jo && user_jo.notification_count > 0 && user_jo.newsfeed_count > 0)
		{
			if((user_jo.notification_count + user_jo.newsfeed_count) > 9)
				drawTTUButton("9", "NOTIFICATION");
			else
				drawTTUButton((user_jo.notification_count+user_jo.newsfeed_count), "NOTIFICATION");
		}	
		else if(user_jo && user_jo.notification_count > 0)
		{
			if(user_jo.notification_count > 9)
				drawTTUButton("9", "NOTIFICATION");
			else
				drawTTUButton(user_jo.notification_count, "NOTIFICATION");
		}	
		else if(user_jo && user_jo.newsfeed_count > 0)
		{
			//alert("nfc > 0");
			if(user_jo.newsfeed_count > 9)
				drawTTUButton("9", "NOTIFICATION");
			else
			{
				drawTTUButton(user_jo.newsfeed_count, "NOTIFICATION");
			}
		}	
		else
		{	
			if(typeof t_jo === "undefined" || t_jo === null)
				drawHButton("gray", "red"); 
			else if(typeof t_jo !== "undefined" && t_jo !== null)
			{
				//alert(JSON.stringify(t_jo));
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
 
 var top_bg_r = "0x" + top_bg.substring(0,2);
 var top_bg_g = "0x" + top_bg.substring(2,4);
 var top_bg_b = "0x" + top_bg.substring(4,6);
           
 var bottom_bg_r = "0x" + bottom_bg.substring(0,2);
 var bottom_bg_g = "0x" + bottom_bg.substring(2,4);
 var bottom_bg_b = "0x" + bottom_bg.substring(4,6);

 context.fillStyle = getColorHexStringFromRGB(top_bg_r, top_bg_g, top_bg_b);
 context.fillRect (0, 0, 19, 8); 
 context.fillStyle = getColorHexStringFromRGB(bottom_bg_r, bottom_bg_g, bottom_bg_b);
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
 	 context.fillStyle = "#" + top_fg;
     context.font = "16px Silkscreen";
     if (top === "1" || top === 1)
     	context.fillText(top,5,13);
     else
     	context.fillText(top,4,13);
 }
 else
 {
 	context.fillStyle = "#" + top_fg;
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
     
     context.fillStyle = "#" + bottom_fg;
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

function drawHButton(background_color, h_color, aframe) {
	
	 // Get the canvas element.
	 var canvas = document.getElementById("button_canvas");
	 // Specify a 2d drawing context.
	 var context = canvas.getContext("2d");
	// var bg_r = "0x7e";
	// var bg_g = "0x7e";
	// var bg_b = "0x7e";
	 if(devel == true)
		 background_color = "black";
	 context.fillStyle = background_color;
	 context.fillRect (0, 0, 19, 19); 
	 
	 context.fillStyle = h_color;
	 context.fillRect (7, 4, 3, 15); // H left
	 context.fillRect (8, 3, 2, 1); // H left tilt top
	 context.fillRect (13, 10, 3, 9); // H right
	 context.fillRect (11, 8, 3, 1); // H crossbar top row 1
	 context.fillRect (10, 9, 5, 2); // H crossbar bottom rows 2/3
	 
	 if(aframe !== null)
		 context.fillRect ((aframe*2+-1), (aframe*-.6+7), 2, 2);
	 
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
	 
	 if(h_color === "red")
		 alert("button has gone red");
	 
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
		//alert("bg.getUserSelf()");
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
            	{	if(data.user_jo) { 	user_jo = data.user_jo; }    }
            	else
            	{
            		//alert("getUser problem. response_status neither success nor error");
            	}
	        },
	        error: function (XMLHttpRequest, textStatus, errorThrown) {
	            console.log(textStatus, errorThrown);
	            drawHButton("gray", "red");
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

// FIRSTRUN 

chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
    	chrome.tabs.create({url: chrome.extension.getURL("firstrun.html")});
    }else if(details.reason == "update"){
      //  var thisVersion = chrome.runtime.getManifest().version;
      //  alert("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }
});


