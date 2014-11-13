
/***
 *     _   _ _____ _____ _    _   _____ _   _ ______ _____  ___ ______ 
 *    | | | |_   _|  ___| |  | | |_   _| | | || ___ \  ___|/ _ \|  _  \
 *    | | | | | | | |__ | |  | |   | | | |_| || |_/ / |__ / /_\ \ | | |
 *    | | | | | | |  __|| |/\| |   | | |  _  ||    /|  __||  _  | | | |
 *    \ \_/ /_| |_| |___\  /\  /   | | | | | || |\ \| |___| | | | |/ / 
 *     \___/ \___/\____/ \/  \/    \_/ \_| |_/\_| \_\____/\_| |_/___/                                                                   
 */


// this function says "Do we have the thread from the bg yet? If not, wait. If so, proceed.
function doThreadTab() 
{
	tabmode = "thread";
	$("#utility_header_td").text("Comment thread");
	$("#utility_message_td").hide();
	$("#utility_csf_td").show();
	
	$("#thread_tab_link").css("font-weight", "bold");
	$("#newsfeed_tab_link").css("font-weight", "normal");
	$("#notifications_tab_link").css("font-weight", "normal");
	$("#profile_link").css("font-weight", "normal");
	
	$("#main_div").text("");
	
	if(typeof bg.user_jo !== "undefined" && bg.user_jo !== null)
	{
		$("#notification_count_span").text(bg.user_jo.notification_count);
		$("#newsfeed_count_span").text(bg.user_jo.newsfeed_count);
		// count resets happen in getNotifications so the display can do the yellow background thing
	}
	
	if(typeof bg.user_jo !== "undefined" && bg.user_jo !== null && typeof bg.user_jo.url_checking_mode !== "undefined" && bg.user_jo.url_checking_mode === "notifications_only")
	{
		$("#utility_table").hide();
		$("#main_div").html("<div style=\"padding:40px;text-align:center;\">You are in \"notifications only\" mode, so no thread will appear here.</div>");
	}	
	else if(isValidURLFormation(currentURL))
	{
		if((typeof bg.t_jo === "undefined" || bg.t_jo === null))// && bg.threadstatus !== 0) // overlay has been loaded, but thread is still being retrieved
		{
			var url_at_function_call = currentURL;
			// wait for thread to load
			$("#main_div").html("<div style=\"padding:20px\">Retrieving thread... <img id=\"google_favicon_img" + "\" src=\"" + chrome.extension.getURL("images/ajaxSnake.gif") + "\"></div>");//OK
			gotThread_wedge_for_ntj(url_at_function_call);
			// the difference between this wedge and the other one is that this one does not animate (or two animations would be happening on top of each other)
		}
		else if(bg.t_jo !== null && bg.threadstatus === 0) 
		{
			gotThread();
		}
	}
	else // not a valid URL formation
	{
		$("#utility_table").hide();
		$("#main_div").html("<div style=\"padding:40px;text-align:center;\">There is no Hacker News item for this URL.</div>");
	}
}

// this function says "We finally received the thread from the backend. Is the tabmode still "thread"? If so, show the thread. If not, do nothing (i.e. stop)."
function gotThread()
{
	if(typeof bg.t_jo.url !== "undefined" && bg.t_jo.url !== null)
	{
		$("#main_div").text("");
		var happy = "";
		happy = happy + "<table style=\"width:auto;border:0px solid red;border-collapse:separate;cell-spacing:10px;\">";
		happy = happy + "	<tr>";
		happy = happy + "		<td style=\"padding-right:3px;width:10px;border:0px solid red;\" id=\"pagelike_td\">";
		happy = happy + "			<a href=\"#\" id=\"storylike_link\"><img src=\"" + chrome.extension.getURL("images/grayarrow_up.gif") + "\"></a>";
		if(bg.user_jo && bg.user_jo.hn_karma >=500)
			happy = happy + "			<br><a href=\"#\" id=\"storydislike_link\"><img src=\"" + chrome.extension.getURL("images/grayarrow_down.gif") + "\"></a>";
		happy = happy + "		</td>";
		happy = happy + "		<td style=\"padding-right:3px;color:#828282;border:0px solid red;\">";
		var bi = bg.t_jo.url.indexOf("://") + 3;
		var ei = bg.t_jo.url.indexOf("/", bg.t_jo.url.indexOf("://") + 3);
		var hostname = bg.t_jo.url.substring(bi,ei);
		happy = happy + bg.t_jo.title + " <span style=\"font-size:11px;color:#828282\">(" + hostname + ")</span>";
		happy = happy + "		</td>";
		happy = happy + "	</tr>";
		happy = happy + "	<tr>";
		happy = happy + "		<td style=\"border:0px solid red;\"></td>";
		happy = happy + "		<td style=\"padding-right:3px;color:#828282;font-size:9px;border:0px solid red;\">";
		happy = happy + bg.t_jo.score + " points by <a href=\"#\" id=\"op_screenname_link\" style=\"color:#828282\">" + bg.t_jo.by + "</a> ";
		if(bg.user_jo)
			happy = happy + "(<a href=\"#\" id=\"follow_link_" + bg.t_jo.by + "\" style=\"color:#828282\">follow</a>) ";
		if(typeof bg.t_jo.children === "undefined" || bg.t_jo.children === null)
			happy = happy + agoIt(bg.t_jo.time * 1000) + " | 0 <a href=\"#\" id=\"comments_link\" style=\"color:#828282\">comments</a>";
		else
			happy = happy + agoIt(bg.t_jo.time * 1000) + " | " + bg.t_jo.children.length + " <a href=\"#\" id=\"comments_link\" style=\"color:#828282\">comments</a>";
		happy = happy + "		</td>";
		happy = happy + "	</tr>";
		happy = happy + "</table>";
		// like/dislike indicator here
		$("#utility_header_td").html(happy);//OK
		
		$("#storylike_link").click({id: bg.t_jo.id}, function(event) { 
			bg.likedislikemode = "storylike";
			$("#storylike_link").html("");
			chrome.tabs.create({url:"https://news.ycombinator.com/item?id=" + event.data.id, active: false}, function(){});
			return false;
		});
		
		$("#storydislike_link").click({id: bg.t_jo.id}, function(event) { 
			bg.likedislikemode = "storydislike";
			$("#storydislike_link").html("");
			chrome.tabs.create({url:"https://news.ycombinator.com/item?id=" + event.data.id, active: false}, function(){});
			return false;
		});
			
		$("#op_screenname_link").click(function() {
			chrome.tabs.create({url: "https://news.ycombinator.com/user?id=" + bg.t_jo.by});
		});
		$("#comments_link").click(function() {
			chrome.tabs.create({url: "https://news.ycombinator.com/item?id=" + bg.t_jo.id});
		});
		if(bg.user_jo)
		{
			if(bg.user_jo && (!bg.user_jo.following || bg.user_jo.following.indexOf(bg.t_jo.by) == -1))
			{
				$("[id=follow_link_" + bg.t_jo.by + "]").text("follow");
				$("[id=follow_link_" + bg.t_jo.by + "]").click({target_screenname: bg.t_jo.by}, function(event) { 
					event.stopImmediatePropagation();
					followOrUnfollowUser(event.data.target_screenname, "followUser");
					return false;
				});
			}
			else
			{
				$("[id=follow_link_" + bg.t_jo.by + "]").text("unfollow");
				$("[id=follow_link_" + bg.t_jo.by + "]").click({target_screenname: bg.t_jo.by}, function(event) {
					event.stopImmediatePropagation();
					followOrUnfollowUser(event.data.target_screenname, "unfollowUser");
					return false;
				});
			}
		}	
		beginindex = 0;
		endindex = 5;
		prepareGetAndPopulateThreadPortion();
	}	
	else
	{
		$("#utility_table").hide();
		var noitemstr = "";
		noitemstr = noitemstr + "<div style=\"padding:40px;text-align:center;font-size:16px;font-weight:bold\">";
		noitemstr = noitemstr + "	There is no Hacker News item for this URL.";
		noitemstr = noitemstr + "	<div style=\"padding-top:20px;color:#828282;font-style:italic;font-size:10px;font-weight:normal\">";
		if(currentHostname === "news.ycombinator.com")
			noitemstr = noitemstr + "You've gone meta. There are very few HN items for news.ycombinator.com URLs.";
		else
			noitemstr = noitemstr + "If you're sure this page has an HN item, it's probably due to a redirect<br>where the HN item URL != actual content URL. Sorry.";
		noitemstr = noitemstr + "	</div>";
		if(bg.user_jo && (typeof bg.user_jo.following === "undefined" || bg.user_jo.following === null || bg.user_jo.following.length === 0))
		{
			noitemstr = noitemstr + "	<div style=\"padding-top:30px;color:#828282;font-size:16px;font-weight:bold\">";
			noitemstr = noitemstr + "	Also, you're not following anyone! Add some <a href=\"#\" id=\"follow_some_people_link\">here</a>.";
			noitemstr = noitemstr + "	</div>";
		}	
		noitemstr = noitemstr + "</div>";
		$("#main_div").html(noitemstr);
		if(bg.user_jo && (typeof bg.user_jo.following === "undefined" || bg.user_jo.following === null || bg.user_jo.following.length === 0))
		{
			$("#follow_some_people_link").click(function(){
				chrome.tabs.create({url: chrome.extension.getURL("login_successful.html")});
			});
		}
	}	
}

//this function says "Is the thread empty? If so, show empty message. If not, prepare comment divs and then call doThreadItem for each to populate them"
function prepareGetAndPopulateThreadPortion()
{
	if (tabmode === "thread")
	{
		if (typeof bg.t_jo.children === "undefined" || bg.t_jo.children === null || bg.t_jo.children.length === 0)
		{
			$("#main_div").html("<div style=\"padding:40px;text-align:center;font-size:16px;font-weight:bold\">There are no comments for this Hacker News item.</div>");
		}
		else if (bg.t_jo.children.length > 0)
		{
			var tempcomments = bg.t_jo.children;
			bg.t_jo.children = tempcomments;
			// loop the comment id list and doThreadItem for each one
			for(var x=beginindex; x < endindex && x < bg.t_jo.children.length; x++) 
			{
				writeUnifiedCommentContainer(bg.t_jo.children[x], "main_div", "append");
				doThreadItem(bg.t_jo.children[x], "comment_div_" + bg.t_jo.children[x]);
			}
			// if we've reached the end, show "end of comments" message
			if (x < bg.t_jo.children.length)
				scrollable = 1;
			else if(x === bg.t_jo.children.length)
				scrollable = 0;
			else
				scrollable = 0;
		}
	}
	else
	{
		// skipping PGandP bc tabmode changed
	}
}


function writeUnifiedCommentContainer(id_to_use, dom_id, action) // main_div_HASH, append/before/after/prepend, etc
{
	var unified = "";
	unified = unified + "<div id=\"container_div_" + id_to_use + "\" style=\"background-color:white;\">";
	unified = unified + "	<div id=\"horizline_div_" + id_to_use + "\" class=\"complete-horiz-line-div\"></div>"; // always shown
	unified = unified + "	<div style=\"padding:6px\">";
	unified = unified + "		<div id=\"message_div_" + id_to_use + "\" class=\"container_message\"></div>"; // hidden unless message displayed
	unified = unified + "		<div id=\"header_div_" + id_to_use + "\" class=\"container_header\"></div>"; // hidden except for notification page
	unified = unified + "		<div id=\"parent_div_" + id_to_use + "\" class=\"container_parent\"></div>"; //hidden except for notification page
	unified = unified + "		<div id=\"comment_div_" + id_to_use + "\" class=\"container_comment\"><div style=\"text-align:center\"><img src=\"" + chrome.extension.getURL("images/ajaxSnake.gif") + "\"></div></div>"; // always shown except for like/dislike on notification page
	unified = unified + "		<div id=\"child_div_" + id_to_use + "\" class=\"container_child\"></div>"; // always hidden except when someone replies on notification page
	unified = unified + "	</div>";
	unified = unified + "</div>";
	if(action === "append")
		$("#" + dom_id).append(unified);
	else if(action === "prepend")
		$("#" + dom_id).prepend(unified);
	else if(action === "after")
		$("#" + dom_id).after(unified);
	else if(action === "before")
		$("#" + dom_id).before(unified);
}


function doThreadItem(comment_id, dom_id, level) // type = "initialpop", "newcomment", "reply"
{
	if(typeof level === "undefined" || level === null)
		level = 0;
	var container_id = comment_id;

	$.ajax({ 
		type: 'GET', 
		url: "https://hacker-news.firebaseio.com/v0/item/" + comment_id + ".json", 
        dataType: 'json', 
        async: true, 
        success: function (data, status) {
        	if(tabmode === "thread") // as these come in, only process them if we're still on the thread tab
    		{	
        		if(data.deleted && data.deleted === true)
        		{
        			$("#comment_div_" + comment_id).css("font-style", "italic");
        			$("#comment_div_" + comment_id).css("color", "#828282");
        			$("#comment_div_" + comment_id).text("(deleted)");
        		}	
        		else
        		{	
        			writeComment(container_id, data, dom_id); // l/d, delete button (if user authored it), reply
        			var indent = (level) * 30;
        			$("#" + dom_id).css("margin-left", indent + "px");
    			}
        		if(data.kids && data.kids.length > 0) // if this is a new reply on the notifications tab, it'll never have kids, so no worry here
        		{
					for(var y=0; y < data.kids.length; y++) 
		    		{  
						//alert("going to write a reply comment_id=" + data.kids[y] + " and parent_id=" + comment_id);
						writeUnifiedCommentContainer(data.kids[y], "container_div_" + comment_id, "after");
						doThreadItem(data.kids[y], "comment_div_" + data.kids[y], (level+1));
		    		}
        		}
    		}
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        	displayMessage("Unable to retrieve HN comment. (ajax)", "red", "message_div_" + comment_id);
        	console.log(textStatus, errorThrown);
        }
	});	
}		

function writeComment(container_id, feeditem_jo, dom_id)
{
	var comment_id = feeditem_jo.id; 
		
	// NOTE: I tried changing comment_id to a random string, but it broke the saved text mechanism.
	
	var writeReplyTD = false;
	var tempstr = "";
		
	// show this user's info
	tempstr = tempstr + "<table style=\"border:0px solid orange;border-collapse:collapse;\">";
	tempstr = tempstr + "	<tr>";
	tempstr = tempstr + "		<td style=\"vertical-align:top;width:10px;text-align:center;border:0px solid green\"> <!-- avatar, left hand side -->"; 
	tempstr = tempstr + "			<table style=\"border:0px solid red;border-collapse:collapse\">";
	tempstr = tempstr + "				<tr>";
	tempstr = tempstr + "					<td style=\"padding-bottom:0px;border:0px solid black\"> ";
	tempstr = tempstr + "						<a href=\"#\" id=\"like_link_" + comment_id + "\"><img src=\"" + chrome.extension.getURL("images/grayarrow_up.gif") + "\"></a>";
	tempstr = tempstr + "					</td>";
	tempstr = tempstr + "				</tr>";			
	tempstr = tempstr + "				<tr>";
	tempstr = tempstr + "					<td style=\"padding-top:0px;border:0px solid black\"> ";
	if(bg.user_jo && bg.user_jo.hn_karma >=500)
		tempstr = tempstr + "					<a href=\"#\" id=\"dislike_link_" + comment_id + "\"><img src=\"" + chrome.extension.getURL("images/grayarrow_down.gif") + "\"></a>";
	tempstr = tempstr + "					</td>";
	tempstr = tempstr + "				</tr>";			
	tempstr = tempstr + "			</table>";
	tempstr = tempstr + "		</td>";
	tempstr = tempstr + "		<td> <!-- everything else, right-hand side -->";
	tempstr = tempstr + "			<table style=\"border:0px solid purple;border-collapse:collapse\">";
	tempstr = tempstr + "				<tr>";
	tempstr = tempstr + "					<td style=\"vertical-align:middle;text-align:left;border:0px solid black;padding:2px 0px 0px 2px\" > "; 
	tempstr = tempstr + "						<table style=\"width:100%;float:left;border:0px solid brown;vertical-align:middle; border-collapse: separate\">";
	tempstr = tempstr + "							<tr> ";
	tempstr = tempstr + "		  					 	<td style=\"vertical-align:middle;text-align:left;color:#828282;font-size:11px\">";
	tempstr = tempstr + "		  					 		<a href=\"#\" id=\"screenname_link_" + comment_id + "\" style=\"color:#828282\"></a>";
	if(bg.user_jo)
		tempstr = tempstr + "		  					 		 (<a href=\"#\" id=\"follow_link_" + feeditem_jo.by + "\" style=\"color:#828282\">follow</a>)";
	tempstr = tempstr + "		  					 		 - <span id=\"time_ago_span_" + comment_id + "\" style=\"padding:5px;\"></span>";
	tempstr = tempstr + "		  					 	</td>";
	tempstr = tempstr + "							</tr>";
	tempstr = tempstr + "  						</table>";
	tempstr = tempstr + "					</td>";
	tempstr = tempstr + "				</tr>";
	tempstr = tempstr + "				<tr>";
	tempstr = tempstr + "					<td style=\"padding:5px;vertical-align:top;text-align:left;font-size:11px;\" id=\"comment_text_td_" + comment_id + "\"> ";
  	tempstr = tempstr + "					</td>";
  	tempstr = tempstr + "				</tr>";
  	tempstr = tempstr + "				<tr id=\"reply_tr_" + comment_id + "\">";
  	tempstr = tempstr + "					<td style=\"padding:3px;text-align:left\"> ";
  //	alert(feeditem_jo.time*1 + " and " + bg.msfe_according_to_backend);
  	if((feeditem_jo.time*1000) > (bg.msfe_according_to_backend - 1209600000)) // this is less than 2 weeks old, show reply
  		tempstr = tempstr + "							<a href=\"#\" id=\"reply_link_" + comment_id + "\" style=\"font-size:11px\">reply</a>";
  	else
  		$("#comment_submission_form_div").hide();
  	tempstr = tempstr + "					</td>";
  	tempstr = tempstr + "				</tr>";
  	tempstr = tempstr + "			</table>";
  	tempstr = tempstr + "		</td>";
	tempstr = tempstr + "	</tr>";
  	tempstr = tempstr + "</table>"
  	
	$("#" + dom_id).html(tempstr);//OK
	
  	$("[id=screenname_link_" + comment_id + "]").text(feeditem_jo.by);
  	$("[id=time_ago_span_" + comment_id + "]").text(agoIt(feeditem_jo.time*1000));
  	if(typeof feeditem_jo.text !== "undefined" && feeditem_jo.text !== null)
  		$("[id=comment_text_td_" + comment_id + "]").html(replaceAll(feeditem_jo.text, "<a href=", "<a class=\"newtab\" href="));

  	$("a").click(function(event) {
		if(typeof event.processed === "undefined" || event.processed === null) // prevent this from firing multiple times by setting event.processed = true on first pass
		{
			event.processed = true;
			var c = $(this).attr('class');
			if(c == "newtab")
			{
				var h = $(this).attr('href');
				if(chrome.tabs)
					doNewtabClick(h);
				else
					window.location = h;
			}
		}
	});
	
	$("[id=reply_link_" + comment_id + "]").click({value: comment_id}, function(event) { 
	 	chrome.tabs.create({url:"https://news.ycombinator.com/reply?id=" + event.data.value});
	 	return false;
	});

	$("[id=like_link_" + comment_id + "]").click({comment_id: comment_id}, function(event) {
		//noteItemLikeOrDislike(event.data.comment_id, "like");
		bg.likedislikemode = "commentlike";
		$("[id=like_link_" + event.data.comment_id + "]").html("");
		chrome.tabs.create({url:"https://news.ycombinator.com/reply?id=" + event.data.comment_id, active: false}, function(){});
		return false;
	});
		 
	$("[id=dislike_link_" + comment_id + "]").click({comment_id: comment_id}, function(event) { 
		//noteItemLikeOrDislike(event.data.comment_id, "dislike");
		bg.likedislikemode = "commentdislike";
		$("[id=dislike_link_" + event.data.comment_id + "]").html("");
		chrome.tabs.create({url:"https://news.ycombinator.com/reply?id=" + event.data.comment_id, active: false}, function(){});
		return false;
	});
	
	$("[id=screenname_link_"+ comment_id + "]").click({value: feeditem_jo}, function(event) { 
		event.preventDefault();
		chrome.tabs.create({url:"http://news.ycombinator.com/user?id=" + event.data.value.by});
	});	
	
	if(bg.user_jo && (!bg.user_jo.following || bg.user_jo.following.indexOf(feeditem_jo.by) == -1))
	{
		$("[id=follow_link_" + feeditem_jo.by + "]").text("follow");
    	$("[id=follow_link_" + feeditem_jo.by + "]").click({target_screenname: feeditem_jo.by}, function(event) {
    		event.stopImmediatePropagation();
    		followOrUnfollowUser(event.data.target_screenname, "followUser");
			return false;
		});
	}
	else
	{
		$("[id=follow_link_" + feeditem_jo.by + "]").text("unfollow");
		$("[id=follow_link_" + feeditem_jo.by + "]").click({target_screenname: feeditem_jo.by}, function(event) { 
			event.stopImmediatePropagation();
    		followOrUnfollowUser(event.data.target_screenname, "unfollowUser");
			return false;
		});
	}
}

//this ugly function happens when a user has clicked the activation button before
//the thread has been downloaded from the backend.
//it waits for up to 7 seconds, letting the OTHER wedge animate all along. 
//and then populates the appropriate areas when finished (so long as the URL is still correct)
function gotThread_wedge_for_ntj(url_at_function_call)
{
	setTimeout(function(){if(typeof bg.t_jo!=="undefined"&&bg.t_jo!==null)
	{if(url_at_function_call===currentURL){gotThread();}return;}
	setTimeout(function(){if(typeof bg.t_jo!=="undefined"&&bg.t_jo!==null)
	{if(url_at_function_call===currentURL){gotThread();}return;}
	setTimeout(function(){if(typeof bg.t_jo!=="undefined"&&bg.t_jo!==null)
	{if(url_at_function_call===currentURL){gotThread();}return;}
	setTimeout(function(){if(typeof bg.t_jo!=="undefined"&&bg.t_jo!==null)
	{if(url_at_function_call===currentURL){gotThread();}return;}
	setTimeout(function(){if(typeof bg.t_jo!=="undefined"&&bg.t_jo!==null)
	{if(url_at_function_call===currentURL){gotThread();}return;}
	setTimeout(function(){if(typeof bg.t_jo!=="undefined"&&bg.t_jo!==null)
	{if(url_at_function_call===currentURL){gotThread();}return;}
	setTimeout(function(){if(typeof bg.t_jo!=="undefined"&&bg.t_jo!==null)
	{if(url_at_function_call===currentURL){gotThread();}return;}
	setTimeout(function(){if(typeof bg.t_jo!=="undefined"&&bg.t_jo!==null)
	{if(url_at_function_call===currentURL){gotThread();}return;}
	setTimeout(function(){if(typeof bg.t_jo!=="undefined"&&bg.t_jo!==null)
	{if(url_at_function_call===currentURL){gotThread();}return;}
	setTimeout(function(){if(typeof bg.t_jo!=="undefined"&&bg.t_jo!==null)
	{if(url_at_function_call===currentURL){gotThread();}return;}
	setTimeout(function(){if(typeof bg.t_jo!=="undefined"&&bg.t_jo!==null)
	{if(url_at_function_call===currentURL){gotThread();}return;}
	setTimeout(function(){if(typeof bg.t_jo!=="undefined"&&bg.t_jo!==null)
	{if(url_at_function_call===currentURL){gotThread();}return;}
	setTimeout(function(){if(typeof bg.t_jo!=="undefined"&&bg.t_jo!==null)
	{if(url_at_function_call===currentURL){gotThread();}return;}
	setTimeout(function(){if(typeof bg.t_jo!=="undefined"&&bg.t_jo!==null)
	{if(url_at_function_call===currentURL){gotThread();}return;}
	setTimeout(function(){if(typeof bg.t_jo!=="undefined"&&bg.t_jo!==null)
	{if(url_at_function_call===currentURL){gotThread();}return;}
	setTimeout(function(){if(typeof bg.t_jo!=="undefined"&&bg.t_jo!==null)
	{if(url_at_function_call===currentURL){gotThread();}return;}
	setTimeout(function(){if(typeof bg.t_jo!=="undefined"&&bg.t_jo!==null)
	{if(url_at_function_call===currentURL){gotThread();}return;}
	setTimeout(function(){if(typeof bg.t_jo!=="undefined"&&bg.t_jo!==null)
	{if(url_at_function_call===currentURL){gotThread();}return;}
	setTimeout(function(){if(typeof bg.t_jo!=="undefined"&&bg.t_jo!==null)
	{if(url_at_function_call===currentURL){gotThread();}return;}
	setTimeout(function(){if(typeof bg.t_jo!=="undefined"&&bg.t_jo!==null)
	{if(url_at_function_call===currentURL){gotThread();}return;}
	setTimeout(function(){
		//alert("final");
		if(typeof bg.t_jo!=="undefined"&&bg.t_jo!==null)
		{
			if(url_at_function_call===currentURL)
			{
				gotThread();
			}
		}
		else
		{
			if(tabmode === "thread")
			{
				$("#main_div").html("<div style=\"padding:20px\">Unable to retrieve thread. Your internet connection may be down.</div>");//OK
				displayMessage("Thread retrieval error.", "red", "utility_message_td");
			}
		}
		return;
	},333);},333);},333);},333);},333);},333);},333);},333);},333);},333);},333);},333);},333);},333);},333);},333);},333);},333);},333);},333);},333);
}
