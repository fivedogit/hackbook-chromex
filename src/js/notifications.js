

/***
 *     _   _ _____ _____ _    _   _   _ _____ _____ ___________ _____ _____   ___ _____ _____ _____ _   _  _____ 
 *    | | | |_   _|  ___| |  | | | \ | |  _  |_   _|_   _|  ___|_   _/  __ \ / _ \_   _|_   _|  _  | \ | |/  ___|
 *    | | | | | | | |__ | |  | | |  \| | | | | | |   | | | |_    | | | /  \// /_\ \| |   | | | | | |  \| |\ `--. 
 *    | | | | | | |  __|| |/\| | | . ` | | | | | |   | | |  _|   | | | |    |  _  || |   | | | | | | . ` | `--. \
 *    \ \_/ /_| |_| |___\  /\  / | |\  \ \_/ / | |  _| |_| |    _| |_| \__/\| | | || |  _| |_\ \_/ / |\  |/\__/ /
 *     \___/ \___/\____/ \/  \/  \_| \_/\___/  \_/  \___/\_|    \___/ \____/\_| |_/\_/  \___/ \___/\_| \_/\____/ 
 */                                                                                                              

function doNotificationsTab()
{
	tabmode = "notifications";
	$("#utility_table").show();
	var h = "<table style=\"width:100%\">";
	h = h + "	<tr>";
	h = h + "		<td style=\"text-align:left\">Notifications</td>";
	var randomint = Math.floor(Math.random() * 3);
	// on 0, do nothing.
	if (randomint === 1)
		h = h + "		<td style=\"text-align:right\"><img src=\"images/twitter-bird_32x27.png\" style=\"width:18px;height:16px;vertical-align:middle\"> <a href=\"#\" id=\"twitter_link\" style=\"color:#828282;font-size:10px;text-decoration:underline\">Share Hackbook on Twitter</a></td>";
	else if (randomint === 2)
		h = h + "		<td style=\"text-align:right\"><img src=\"images/chrome.jpg\" style=\"width:16px;height:16px;vertical-align:middle\"> <a href=\"#\" id=\"5star_link\" style=\"color:#828282;font-size:10px;text-decoration:underline\">Rate Hackbook &#9733;&#9733;&#9733;&#9733;&#9733;</a></td>";
	h = h + "	</tr>";
	h = h + "</table>";
	
	$("#utility_header_td").html(h);
	$("#twitter_link").click( function (event) {	event.preventDefault();
		chrome.tabs.create({url: "https://twitter.com/intent/tweet?text=Your%20tweet%20text%20goes%20here.&url=https%3A%2F%2Fchrome.google.com%2Fwebstore%2Fdetail%2Fhackbook%2Flogdfcelflpgcbfebibbeajmhpofckjh"});
	});
	$("#5star_link").click( function (event) {	event.preventDefault();
		chrome.tabs.create({url: "https://chrome.google.com/webstore/detail/hackbook/logdfcelflpgcbfebibbeajmhpofckjh/reviews"});
	});
	
	$("#utility_message_td").hide();
	$("#utility_csf_td").hide();

	$("#thread_tab_link").css("font-weight", "normal");
	$("#newsfeed_tab_link").css("font-weight", "normal");
	$("#notifications_tab_link").css("font-weight", "bold");
	$("#profile_link").css("font-weight", "normal");
	
	$("#main_div").html("");//OK
	if(typeof bg.user_jo !== "undefined" && bg.user_jo !== null)
	{
		$("#notification_count_span").text(bg.user_jo.notification_count);
		$("#newsfeed_count_span").text(bg.user_jo.newsfeed_count);
		// count resets happen in getNotifications so the display can do the yellow background thing
	}
	getNotifications("notifications");
	
}

//TYPES
//0. ** Someone followed user
//1. ** a comment user wrote was upvoted
//2. ** a comment user wrote was downvoted
//3. ** a story user wrote was upvoted
//4. ** a story user wrote was downvoted
//5. ** a comment user wrote was commented on
//6. ** a story user wrote was commented on
//7. a user this user is following posted a story with a url // should be combined with 9?
//8. a user this user is following commented
// *** combined with 7 *** 9. a user this user is following posted a story without a url // should be combined with 7?
//A. ?? someone deep-replied to your comment
//B. ?? someone deep-replied to your story

function getNotifications(feedmode)
{
	if (typeof bg.user_jo==="undefined" || bg.user_jo === null)
	{
		$("#main_div").html("<div style=\"padding:20px\">Log in to view this feed.</div>");//OK
	}
	else
	{
		if (feedmode === "notifications" && (typeof bg.user_jo.notification_ids === "undefined" || bg.user_jo.notification_ids === null || bg.user_jo.notification_ids.length === 0))
		{
			$("#main_div").html("<div style=\"padding:20px\">No notifications to display.</div>");//OK
		}
		else if (feedmode === "newsfeed" && (typeof bg.user_jo.newsfeed_ids === "undefined" || bg.user_jo.newsfeed_ids === null || bg.user_jo.newsfeed_ids.length === 0))
		{
			if(typeof bg.user_jo.following === "undefined" || bg.user_jo.following === null || bg.user_jo.following.length === 0)
				$("#main_div").html("<div style=\"padding:20px\">No newsfeed items to display.</div><div style=\"padding:20px\">You're not following any users. You'll need to do that to see activity here.</div>");//OK
			else
				$("#main_div").html("<div style=\"padding:20px\">No newsfeed items to display.</div>");
		}
		else
		{
			var sorted_ids = []; //bg.user_jo.notification_ids;
			if(feedmode === "newsfeed")
				sorted_ids = bg.user_jo.newsfeed_ids;
			else
				sorted_ids = bg.user_jo.notification_ids;
			
			sorted_ids.sort(function(a,b){
				a = fromOtherBaseToDecimal(62, a.substring(0,7));
				b = fromOtherBaseToDecimal(62, b.substring(0,7));
				return b - a;
			});
			
			for(var x=0; x < sorted_ids.length; x++) 
			{
				writeUnifiedCommentContainer(sorted_ids[x], "main_div", "append");
				if(feedmode === "notifications" && x < bg.user_jo.notification_count )
				{
					$("#container_div_" + sorted_ids[x]).css("background-color", "#fffed6");
				}	
				else if(feedmode === "newsfeed" && x < bg.user_jo.newsfeed_count )
				{
					$("#container_div_" + sorted_ids[x]).css("background-color", "#fffed6");
				}	
				doNotificationItem(sorted_ids[x], "comment_div_" + sorted_ids[x], feedmode);
			}
		}

		// now that the user has viewed this tab, reset notification count to 0
		if(feedmode === "notifications")
		{
			resetNotificationCount();
			bg.user_jo.notification_count = 0;
		}
		else
		{
			resetNewsfeedCount();
			bg.user_jo.newsfeed_count = 0;
		}
		if(bg.threadstatus === 0) // only if not already animating
			bg.doButtonGen();
	}
}

// item ids are unique. There is only one specific like/dislike/comment in the person's notification array
// parent ids are not. The same parent item can be replied to, liked, disliked, etc, so the reference has to be randomized
function doNotificationItem(notification_id, dom_id, feedmode)
{
	$.ajax({
        type: 'GET',
        url: endpoint,
        data: {
            method: "getNotificationItem",
            notification_id: notification_id,
            screenname: screenname,
            this_access_token: this_access_token
        },
        dataType: 'json',
        async: true,
        success: function (data, status) {
        	if(data.response_status === "success")
        	{	
        		if(tabmode === feedmode) // as these come in, only process them if we're still on the notifications tab
        		{	
        			var notification_jo = data.notification_jo;
        			if(notification_jo.type === "0" || notification_jo.type === "1" || notification_jo.type === "2")
        			{
        				var act_html = "";
        				act_html = act_html + "	<table style=\"width:100%\">";
        				act_html = act_html + "		<tr>";
        				act_html = act_html + "			<td style=\"text-align:left;font-size:10px;color:#828282;\">";
        				if($("#container_div_" + notification_jo.id).css("background-color") !== "rgb(255, 255, 255)") // hacky
        					act_html = act_html + "				<span style=\"color:#" + bg.user_jo.hn_topcolor + "\">&#9733;</span> ";
        				else
        					act_html = act_html + "				<span style=\"color:#828282\">&#9733;</span> ";
        				act_html = act_html + agoIt(notification_jo.action_msfe) + " ";
        				act_html = act_html + "			</td>";
        				act_html = act_html + "		</tr>";
        				act_html = act_html + "	</table>";
        				$("#header_div_" + notification_jo.id).html(act_html);
        				$("#header_div_" + notification_jo.id).show();
        				if(notification_jo.type === "0" || notification_jo.type === "1" || notification_jo.type === "2")
        				{
        					var c_html = "";
        					if(notification_jo.type === "0")
            					c_html = c_html + "<b><a href=\"#\" id=\"screenname_link_" + notification_jo.id + "\">" + notification_jo.triggerer + "</a> followed you</b><br>";
            				else if(notification_jo.type === "1" )
            				{	
            					c_html = c_html + "<b>Your karma increased by " + notification_jo.karma_change + " points</b>";
        						c_html = c_html + "<div style=\"font-size:10px;padding-top:8px;font-style:italic;color:#828282\">Unfortunately, Hackbook can't know which of your <a href=\"#\" style=\"color:#828282;text-decoration:underline\" id=\"view_your_comments_link_" + notification_jo.id + "\">comments</a> was upvoted.";
            				}
            				else if(notification_jo.type === "2" )
            				{
            					c_html = c_html + "<b>Your karma decreased by " + notification_jo.karma_change + " points</b>";
            					c_html = c_html + "<div style=\"font-size:10px;padding-top:8px;font-style:italic;color:#828282\">Unfortunately, Hackbook can't know which of your <a href=\"#\" style=\"color:#828282;text-decoration:underline\" id=\"view_your_comments_link_" + notification_jo.id + "\">comments</a> was downvoted.";
            				}
        					$("#comment_div_" + notification_jo.id).html(c_html);
        					if(notification_jo.type === "1" || notification_jo.type === "2")
            				{
        						$("#view_your_comments_link_" + notification_jo.id).click({value:notification_jo.user_id}, function(event) {
            						chrome.tabs.create({url: "https://news.ycombinator.com/threads?id=" + event.data.value});
            					});
            				}
        				}
        				$("#screenname_link_" + notification_jo.id).click({value:notification_jo.triggerer}, function(event){
	        				chrome.tabs.create({url: "https://news.ycombinator.com/user?id=" + event.data.value});
	        			});
        			}	
        			else
        			{	
        				$.ajax({ 
            				type: 'GET', 
            				url: "https://hacker-news.firebaseio.com/v0/item/" + notification_jo.hn_target_id + ".json", 
            		        dataType: 'json', 
            		        async: true, 
            		        success: function (data, status) {
            		        	if(tabmode === feedmode) // as these come in, only process them if we're still on the notifications tab
            		    		{	
            		        		if(typeof data.deleted !== "undefined" && data.deleted !== null && data.deleted === true)
        		        			{
            		        			// this has been deleted. Skip.
            		        			$("#container_div_" + notification_jo.id).hide();
        		        			}
            		        		else
            		        		{	
            		        			if(notification_jo.type*1 >= 3 && notification_jo.type*1 <= 9)
                		        		{	
                		        			if(notification_jo.hn_root_story_id !== null)
                		        			{
                		        				var act_html = "";
                		        				act_html = act_html + "	<table style=\"width:100%\">";
                		        				act_html = act_html + "		<tr>";
                		        				act_html = act_html + "			<td style=\"text-align:left;font-size:10px;color:#828282;\">";
                		        				if($("#container_div_" + notification_jo.id).css("background-color") !== "rgb(255, 255, 255)") // hacky
                		        					act_html = act_html + "<span style=\"color:#" + bg.user_jo.hn_topcolor + "\">&#9733;</span> ";
                		        				else
                		        					act_html = act_html + "<span style=\"color:#828282\">&#9733;</span> ";
                		        				act_html = act_html + agoIt(notification_jo.action_msfe) + " at <a href=\"#\" id=\"title_link_" + notification_jo.id + "\">...</a>";
                		        				act_html = act_html + " - <a href=\"#\" id=\"comments_link_" + notification_jo.id + "\" style=\"font-size:10px;color:#828282\">comments</a>";
                		        				act_html = act_html + "			</td>";
                		        				act_html = act_html + "			<td style=\"text-align:right\" id=\"parent_and_branch_td_" + notification_jo.id + "\">";
                		        				if(typeof data.parent !== "undefined" && data.parent !== null)
                		        				{
                		        					act_html = act_html + "				<a href=\"#\" id=\"show_parent_link_" + notification_jo.id + "\" style=\"font-size:10px;color:#828282;\">parent</a>";
                		        					// if notification_jo has a root_comment_id and (either the current comment is not the same as the root comment (i.e. there's more than 1 comment to show) OR this is the root comment and it has children)
                		        					if(typeof notification_jo.hn_root_comment_id !== "undefined" && notification_jo.hn_root_comment_id !== null && notification_jo.hn_root_comment_id !== 0 &&
                		        							(notification_jo.hn_root_comment_id !== data.id || (notification_jo.hn_root_comment_id === data.id && typeof data.children !== "undefined" && data.children !== null && data.children.length > 0)))
                    		        					act_html = act_html + "<span id=\"separator_span_" + notification_jo.id + "\"> | </span><a href=\"#\" id=\"show_branch_link_" + notification_jo.id + "\" style=\"font-size:10px;color:#828282;\">branch</a>";
                		        				}
                		        				
                		        				act_html = act_html + "			</td>";
                		        				act_html = act_html + "		</tr>";
                		        				act_html = act_html + "	</table>";
                		        				$("#header_div_" + notification_jo.id).html(act_html);
                		        				$("#header_div_" + notification_jo.id).show();
                		        				                		        				
                		        				$.ajax({ type: 'GET', url: "https://hacker-news.firebaseio.com/v0/item/" + notification_jo.hn_root_story_id + ".json", 
                		            		        dataType: 'json', async: true, 
                		            		        success: function (data, status) {
                		            		        	if(data !== null && typeof data.type !== "undefined" && data.type !== null && data.type === "story")
                		            		        	{
                		            		        		$("#title_link_" + notification_jo.id).text(data.title);
                		            		        		$("#title_link_" + notification_jo.id).click(function(){
                		            		        			if(typeof data.url !== "undefined" && data.url !== null && data.url !== "")
                		            		        				chrome.tabs.create({url: data.url});
                		            		        			else
                		            		        				chrome.tabs.create({url: "https://news.ycombinator.com/item?id=" + data.id});
                		            		        		});
                		            		        		$("#comments_link_" + notification_jo.id).click(function(){
                		            		        			chrome.tabs.create({url: "https://news.ycombinator.com/item?id=" + data.id});
                		            		        		});
                		            		        		$("#item_link_" + notification_jo.id).click(function(){
                		            		        			chrome.tabs.create({url: "https://news.ycombinator.com/item?id=" + notification_jo.hn_target_id});
                		            		        		});
                		            		        	}
                		            		        	else if (data === null)
                		            		        	{
                		            		        		$("#title_link_" + notification_jo.id).text("deleted");
                		            		        		$("#title_link_" + notification_jo.id).css("font-style", "italic");
                		            		        		$("#comments_link_" + notification_jo.id).text("deleted");
                		            		        		$("#comments_link_" + notification_jo.id).css("font-style", "italic");
                		            		        	}	
                		            		        },
                		            		        error: function (XMLHttpRequest, textStatus, errorThrown) {
                		            		        	displayMessage("Unable to retrieve title of HN story. (ajax)", "red", "message_div_" + notification_jo.id);
                		            		        	console.log(textStatus, errorThrown);
                		            		        }
                		            			});
                		        				if(typeof data.parent !== "undefined" && data.parent !== null)
                		        				{	
                		        					$("#show_parent_link_" + notification_jo.id).click(function(){
                		        						$("#comment_div_" + notification_jo.id).css("padding-left", "25px");
                    		        					$("#parent_div_" + notification_jo.id).html("<img src=\"" + chrome.extension.getURL("images/ajaxSnake.gif") + "\">");
                    		        					$("#parent_div_" + notification_jo.id).show();
                    		        					if($("#parent_and_branch_td_" + notification_jo.id).text().indexOf("branch") !== -1)
                    		        					{
                    		        						$("#show_parent_link_" + notification_jo.id).text("");
                    		        						$("#separator_span_" + notification_jo.id).text("");
                    		        					}
                    		        					else
                    		        						$("#parent_and_branch_td_" + notification_jo.id).text("");
                    		        					$.ajax({ 
                    		        						type: 'GET', 
                    		        						url: "https://hacker-news.firebaseio.com/v0/item/" + data.parent + ".json", 
                    		        				        dataType: 'json', 
                    		        				        async: true, 
                    		        				        success: function (data, status) {
                    		        				        	if(data.type === "comment")
                    		        				        	{
                    		        				        		var p_html = "<div style=\"padding-bottom:5px;font-weight:bold\"><a class=\"newtab\" href=\"https://news.ycombinator.com/user?id=" + data.by + "\">" + data.by + "</a> <a class=\"newtab\" href=\"https://news.ycombinator.com/item?id=" + data.id + "\">commented</a>:</div>";
                    		        				        		p_html = p_html + replaceAll(data.text, "<a href=", "<a class=\"newtab\" href=");
                    		        				        		$("#parent_div_" + notification_jo.id).html(p_html);
                    		        				        		$("a").click(function(event) {
                                        		        				if(typeof event.processed === "undefined" || event.processed === null) // prevent this from firing multiple times by setting event.processed = true on first pass
                                        		        				{
                                        		        					event.processed = true;
                                        		        					var c = $(this).attr('class');
                                        		        					if(c == "newtab")
                                        		        					{
                                        		        						var h = $(this).attr('href');
                                        		        						doNewtabClick(h);
                                        		        					}
                                        		        				}
                                        		        			});
                    		        				        	}
                    		        				        	else if(data.type === "story")
                    		        				        		$("#parent_div_" + notification_jo.id).html("<div style=\"padding-bottom:5px\">" + data.by + " posted this story.</div>");
                    		        				        },
                    		        				        error: function (XMLHttpRequest, textStatus, errorThrown) {
                        		            		        	console.log(textStatus, errorThrown);
                        		            		        }
                        		            			});
                    		        					return false;
                    		        				});
                		        					
                		        					// if notification_jo has a root_comment_id and (either the current comment is not the same as the root comment (i.e. there's more than 1 comment to show) OR this is the root comment and it has children)
                		        					if(typeof notification_jo.hn_root_comment_id !== "undefined" && notification_jo.hn_root_comment_id !== null && notification_jo.hn_root_comment_id !== 0 &&
                		        							(notification_jo.hn_root_comment_id !== data.id || (notification_jo.hn_root_comment_id === data.id && typeof data.children !== "undefined" && data.children !== null && data.children.length > 0)))
                		        					{	
                		        						$("#show_branch_link_" + notification_jo.id).click({notification_jo:notification_jo},function(event){
                		        							$("#parent_and_branch_td_" + notification_jo.id).html("");
                		        							$("#container_div_" + event.data.notification_jo.id).css("background-color", "#fffed6");
                		        							$("#container_div_" + event.data.notification_jo.id).attr("id", "container_div_" + event.data.notification_jo.hn_root_comment_id);
                		        							$("#horizline_div_" + event.data.notification_jo.id).attr("id", "horizline_div_" + event.data.notification_jo.hn_root_comment_id);
                		        							$("#message_div_" + event.data.notification_jo.id).attr("id", "message_div_" + event.data.notification_jo.hn_root_comment_id);
                		        							$("#header_div_" + event.data.notification_jo.id).attr("id", "header_div_" + event.data.notification_jo.hn_root_comment_id);
                		        							$("#parent_div_" + event.data.notification_jo.id).hide(); // in case they've clicked "parent" first.
                		        							$("#parent_div_" + event.data.notification_jo.id).attr("id", "parent_div_" + event.data.notification_jo.hn_root_comment_id);
                		        							$("#comment_div_" + event.data.notification_jo.id).css("padding-left", "0px"); // in case they've clicked "parent" first
                		        							$("#comment_div_" + event.data.notification_jo.id).attr("id", "comment_div_" + event.data.notification_jo.hn_root_comment_id);
                		        							$("#comment_div_" + event.data.notification_jo.hn_root_comment_id).html("<div style=\"text-align:center;padding:20px\"><img src=\"images/ajaxSnake.gif\"></div>");
                		        							$("#child_div_" + event.data.notification_jo.id).attr("id", "child_div_" + event.data.notification_jo.hn_root_comment_id);
                		        							doThreadItem(event.data.notification_jo.hn_root_comment_id, "comment_div_" + event.data.notification_jo.hn_root_comment_id, 0);
                		        							return false;
                		        						});
                		        					}
                		        				}
                		        			}
                		        			else
                		        				$("#header_div_" + notification_jo.id).html("<a href=\"#\" id=\"screenname_link_" + notification_jo.id + "\">" + notification_jo.triggerer + "</a> wrote a comment at \"Unknown title\"");
                		        			
                		        			var c_html = "<div style=\"padding-bottom:5px;font-weight:bold\">";
                		        			if(notification_jo.type === "3")
            		        					c_html = c_html + " Your <a href=\"#\" id=\"item_link_" + notification_jo.id + "\">story</a> was upvoted ";
            		        				else if(notification_jo.type === "4")
            		        					c_html = c_html + " Your <a href=\"#\" id=\"item_link_" + notification_jo.id + "\">story</a> was downvoted ";
            		        				else if(notification_jo.type === "7" || notification_jo.type === "9")
            		        					c_html = c_html + " <a href=\"#\" id=\"screenname_link_" + notification_jo.id + "\">" + notification_jo.triggerer + "</a> posted a <a href=\"#\" id=\"item_link_" + notification_jo.id + "\">story</a>.";
            		        				else if(notification_jo.type === "5")
            		        					c_html = c_html + " <a href=\"#\" id=\"screenname_link_" + notification_jo.id + "\">" + notification_jo.triggerer + "</a> <a href=\"#\" id=\"item_link_" + notification_jo.id + "\">replied</a> to you:";
            		        				else if(notification_jo.type === "6")
            		        					c_html = c_html + " <a href=\"#\" id=\"screenname_link_" + notification_jo.id + "\">" + notification_jo.triggerer + "</a> <a href=\"#\" id=\"item_link_" + notification_jo.id + "\">commented</a> on your story:";
            		        				else if(notification_jo.type === "8")
            		        					c_html = c_html + " <a href=\"#\" id=\"screenname_link_" + notification_jo.id + "\">" + notification_jo.triggerer + "</a> <a href=\"#\" id=\"item_link_" + notification_jo.id + "\">commented</a>:";
                		        			c_html = c_html + "</div>";
                		        			if(typeof data.text !== "undefined" && data.text !== null && data.text !== "") // 6,8,9
                		        			{
                		        				c_html = c_html + replaceAll(data.text, "<a href=", "<a class=\"newtab\" href=") + "<br><br><a class=\"newtab\" style=\"font-size:11px;text-decoration:underline\" href=\"http://news.ycombinator.com/item?id=" + notification_jo.hn_target_id + "\">reply</a>";
                		        				$("#comment_div_" + notification_jo.id).html(c_html);
                		        				$("a").click(function(event) {
                    		        				if(typeof event.processed === "undefined" || event.processed === null) // prevent this from firing multiple times by setting event.processed = true on first pass
                    		        				{
                    		        					event.processed = true;
                    		        					var c = $(this).attr('class');
                    		        					if(c == "newtab")
                    		        					{
                    		        						var h = $(this).attr('href');
                    		        						doNewtabClick(h);
                    		        					}
                    		        				}
                    		        			});
                		        			}
                		        			else
                		        				$("#comment_div_" + notification_jo.id).html(c_html);
                		        		}
                		        		else
                		        		{
                		        			$("#comment_div_" + notification_jo.id).html("Unknown item type");
                		        		}	
        		        			}
            		        		
            		        		$("#screenname_link_" + notification_jo.id).click({value:notification_jo.triggerer}, function(event){
        		        				chrome.tabs.create({url: "https://news.ycombinator.com/user?id=" + event.data.value});
        		        			});
            		    		}
            		        	else
            		        	{
            		        		//alert("tabmode no longer notifications");
            		        	}	
            		        },
            		        error: function (XMLHttpRequest, textStatus, errorThrown) {
            		        	$("#comment_div_" + notification_jo.id).text("Unable to retrieve HN comment. (ajax)");
            		        	console.log(textStatus, errorThrown);
            		        }
            			});	
        			}
        			
        		}	
        	}
        	else if(data.response_status === "error")
        	{ 
            	$("#comment_div_" + notification_id).text(data.message);
        	}
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        	$("#comment_div_" + notification_id).text("Unable to retrieve notification item. (network error)");
        	console.log(textStatus, errorThrown);
        } 
	});
}


