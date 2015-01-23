

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
	drawTabHeader("Notifications");

	$("#chat_tab_link").css("font-weight", "normal");
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
					$("#container_div_" + sorted_ids[x]).addClass("new_notification");
				}	
				else if(feedmode === "newsfeed" && x < bg.user_jo.newsfeed_count )
				{
					$("#container_div_" + sorted_ids[x]).addClass("new_notification");
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
        		if(tabmode === feedmode) // as these come in, only process them if we're still on the correct tab
        		{	
        			var notification_jo = data.notification_jo;
        			if(notification_jo.type === "0" || notification_jo.type === "1" || notification_jo.type === "2" || notification_jo.type === "C")
        			{
        				// Note: These are the types that have no connection to any HN item. 
        				// 0. ** Someone followed user
        				// 1. ** a comment user wrote was upvoted
        				// 2. ** a comment user wrote was downvoted
        				// A. unused
        				// B. unused
        				// C. *** user was mentioned in chat
        				var act_html = "";
        				act_html = act_html + "	<table style=\"width:100%\">";
        				act_html = act_html + "		<tr>";
        				act_html = act_html + "			<td style=\"text-align:left;font-size:10px;color:#828282;\">";
        				if($("#container_div_" + notification_jo.id).hasClass("new_notification"))
        					act_html = act_html + "				<span style=\"color:#" + bg.hn_topcolor + "\">&#9733;</span> ";
        				else
        					act_html = act_html + "				<span style=\"color:#828282\">&#9733;</span> ";
        				act_html = act_html + bg.agoIt(notification_jo.action_msfe) + " ";
        				act_html = act_html + "			</td>";
        				act_html = act_html + "		</tr>";
        				act_html = act_html + "	</table>";
        				$("#header_div_" + notification_jo.id).html(act_html);
        				$("#header_div_" + notification_jo.id).show();
        				
        				var c_html = "";
    					if(notification_jo.type === "0")
        					c_html = c_html + "<b><a href=\"#\" id=\"screenname_link_" + notification_jo.id + "\">" + notification_jo.triggerer + "</a> followed you</b><br>";
        				else if(notification_jo.type === "1" )
        				{	
        					if(notification_jo.karma_change*1 === 1)
        						c_html = c_html + "<b>Your karma increased by " + notification_jo.karma_change + " point</b>";
        					else
        						c_html = c_html + "<b>Your karma increased by " + notification_jo.karma_change + " points</b>";
    						c_html = c_html + "<div style=\"font-size:10px;padding-top:8px;font-style:italic;color:#828282;text-align:right\">Unfortunately, Hackbook can't know which of your <a href=\"#\" style=\"color:#828282;text-decoration:underline\" id=\"view_your_comments_link_" + notification_jo.id + "\">comments</a> was upvoted.";
        				}
        				else if(notification_jo.type === "2" )
        				{
        					if(notification_jo.karma_change*1 === -1)
        						c_html = c_html + "<b>Your karma decreased by " + notification_jo.karma_change + " point</b>";
        					else
        						c_html = c_html + "<b>Your karma decreased by " + notification_jo.karma_change + " points</b>";
        					c_html = c_html + "<div style=\"font-size:10px;padding-top:8px;font-style:italic;color:#828282;text-align:right\">Unfortunately, Hackbook can't know which of your <a href=\"#\" style=\"color:#828282;text-decoration:underline\" id=\"view_your_comments_link_" + notification_jo.id + "\">comments</a> was downvoted.";
        				}
        				else if(notification_jo.type === "C" )
        				{
        					c_html = c_html + "<b>" + notification_jo.triggerer + " mentioned you in <a href=\"#\" id=\"chat_link_" + notification_jo.id + "\">chat</a></b>";
        					c_html = c_html + "<div style=\"font-size:10px;padding-top:8px;font-style:italic;color:#828282;text-align:right\">This notification will self-destruct.</div>";
        				}
    					$("#comment_div_" + notification_jo.id).html(c_html);
    					if(notification_jo.type === "1" || notification_jo.type === "2")
        				{
    						$("#view_your_comments_link_" + notification_jo.id).click({value:notification_jo.user_id}, function(event) {
        						chrome.tabs.create({url: "https://news.ycombinator.com/threads?id=" + event.data.value});
        					});
        				}
    					else if(notification_jo.type === "C")
        				{
    						$("#chat_link_" + notification_jo.id).click(function(event) {
    							doChatTab();
    							return false;
    						});
        				}
        				$("#screenname_link_" + notification_jo.id).click({value:notification_jo.triggerer}, function(event){
	        				chrome.tabs.create({url: "https://news.ycombinator.com/user?id=" + event.data.value});
	        			});
        			}	
        			else if(notification_jo.type === "3" || notification_jo.type === "4" || notification_jo.type === "5" || notification_jo.type === "6" ||
        					notification_jo.type === "7" || notification_jo.type === "8" || notification_jo.type === "9")
        			{	
        				// Note: These are the types that ARE connected to (an) HN item(s).
        				// 3. upvote on story
        				// 4. downvote on story
        				// 5. ** comment on comment
        				// 6. ** comment on story
        				// 7. story posted by someone user is following
        				// 8. ** comment posted by someone user is following 
        				// 9. ** deep-comment on comment
        				
        				// ** = hn_root_story_id != hn_target_id     (must make separate call to get root story)
        				
        				$.ajax({ 
            				type: 'GET', 
            				url: "https://hacker-news.firebaseio.com/v0/item/" + notification_jo.hn_target_id + ".json", // hn_target_id points to the new comment or story that triggered this notification
            		        dataType: 'json', 
            		        async: true, 
            		        success: function (data, status) {
            		        	if(tabmode === feedmode) // as these come in, only process them if we're still on the notifications tab
            		    		{	
            		        		// write the header, pointing to the             		        			
    		        				var showbranch = false;
    		        				var act_html = "";
    		        				act_html = act_html + "	<table style=\"width:100%\">";
    		        				act_html = act_html + "		<tr>";
    		        				act_html = act_html + "			<td style=\"text-align:left;font-size:10px;color:#828282;\">";
    		        				if($("#container_div_" + notification_jo.id).hasClass("new_notification"))
    		        					act_html = act_html + "<span style=\"color:#" + bg.hn_topcolor + "\">&#9733;</span> ";
    		        				else
    		        					act_html = act_html + "<span style=\"color:#828282\">&#9733;</span> ";
    		        				act_html = act_html + bg.agoIt(notification_jo.action_msfe) + " at <a href=\"#\" id=\"title_link_" + notification_jo.id + "\">...</a>";
    		        				act_html = act_html + " <a href=\"#\" id=\"comments_link_" + notification_jo.id + "\" style=\"font-size:10px;color:#828282;padding-left:6px\">comments</a>";
    		        				act_html = act_html + "			</td>";
    		        				act_html = act_html + "			<td style=\"text-align:right\" id=\"parent_and_branch_td_" + notification_jo.id + "\">";
    		        				if(typeof data.parent !== "undefined" && data.parent !== null)
    		        				{
    		        					act_html = act_html + "				<a href=\"#\" id=\"show_parent_link_" + notification_jo.id + "\" style=\"font-size:10px;color:#828282;\">parent</a>";
    		        					// if notification_jo has a root_comment_id and (either the current comment is not the same as the root comment (i.e. there's more than 1 comment to show) OR this is the root comment and it has children)
    		        					if(typeof notification_jo.hn_root_comment_id !== "undefined" && notification_jo.hn_root_comment_id !== null && notification_jo.hn_root_comment_id !== 0)
    		        					{
    		        						if(notification_jo.hn_root_comment_id !== data.id)
    		        							showbranch = true;
    		        						else // this is the root comment. Does it have children?
    		        						{
    		        							if(typeof data.kids !== "undefined" && data.kids !== null && data.kids.length > 0)
    		        								showbranch = true;
    		        						}
    		        						if(showbranch)	
    		        							act_html = act_html + "<span id=\"separator_span_" + notification_jo.id + "\"> | </span><a href=\"#\" id=\"show_branch_link_" + notification_jo.id + "\" style=\"font-size:10px;color:#828282;\">branch</a>";
    		        					}
    		        				}
    		        				
    		        				act_html = act_html + "			</td>";
    		        				act_html = act_html + "		</tr>";
    		        				act_html = act_html + "	</table>";
    		        				$("#header_div_" + notification_jo.id).html(act_html);
    		        				$("#header_div_" + notification_jo.id).show();
    		        				
    		        				if(notification_jo.type === "5" || notification_jo.type === "6" || notification_jo.type === "8" || notification_jo.type === "9")
    		        				{
    		        					// These are COMMENT types with a root story where hn_target_id != hn_root_story_id, so we have to retrieve the hn_root_story_id to (a) show the root story title, (b) link to it and (c) link to its comments
    		        					// 5. ** comment on comment
    		            				// 6. ** comment on story
    		            				// 8. ** comment posted by someone user is following 
    		            				// 9. ** deep-comment on comment
    		        					if(typeof notification_jo.hn_root_story_id !== "undefined" && notification_jo.hn_root_story_id !== null) // make sure the hn_root_story_id exists
    		        					{	
    		        						$.ajax({ type: 'GET', url: "https://hacker-news.firebaseio.com/v0/item/" + notification_jo.hn_root_story_id + ".json", 
            		            		        dataType: 'json', async: true, 
            		            		        success: function (data, status) {
            		            		        	if(typeof data.deleted !== "undefined" && data.deleted !== null && data.deleted === true) 												// (a) show the story "title"
            		            		        		$("#title_link_" + notification_jo.id).text("(deleted)");
            		            		        	else if(typeof data.dead !== "undefined" && data.dead !== null && data.dead === true) 													// (a) show the story "title"
            		            		        		$("#title_link_" + notification_jo.id).text("(flagkilled)");
            		            		        	else
            		            		        	{	
            		            		        		if(data !== null && typeof data.type !== "undefined" && data.type !== null && (data.type === "story" || data.type === "poll"))
                		            		        	{
                		            		        		$("#title_link_" + notification_jo.id).text(data.title);																		// (a) show the story title
                		            		        		$("#title_link_" + notification_jo.id).click({url:data.url, hn_root_story_id:data.id}, function(event){
                		            		        			if(typeof event.data.url !== "undefined" && event.data.url !== null && event.data.url !== "")
                		            		        				chrome.tabs.create({url: event.data.url});																				// (b) link to it
                		            		        			else
                		            		        				chrome.tabs.create({url: "https://news.ycombinator.com/item?id=" + event.data.hn_root_story_id});										// (b) link to it (no url, so link to comments)
                		            		        		});
                		            		        		$("#comments_link_" + notification_jo.id).click({hn_root_story_id:data.id}, function(event){
                		            		        			chrome.tabs.create({url: "https://news.ycombinator.com/item?id=" + event.data.hn_root_story_id});							// (c) link to comments
                		            		        		});
                		            		        	}
            		            		        	}
            		            		        },
            		            		        error: function (XMLHttpRequest, textStatus, errorThrown) {
            		            		        	displayMessage("Unable to retrieve title of HN story. (ajax)", "red", "message_div_" + notification_jo.id);
            		            		        	console.log(textStatus, errorThrown);
            		            		        }
            		            			});
    		        					}
    		        					else // notification did not contain the hn_root_story_id for some strange reason. Maybe an HN API error stepping back to the root?
    		        					{
    		        						$("#title_link_" + notification_jo.id).text("(unknown title)");																					// (a) show the story "title"
    		        						$("#title_link_" + notification_jo.id).removeAttr("href");																						// (b) unlink to it
    		        						$("#comments_link_" + notification_jo.id).hide();																								// (c) hide the link to comments
    		        					}	
        		        				
        		        				// if the COMMENT has a parent, then we need to provide the "show parent" and "show branch" options
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
            		        				        	else if(data.type === "poll")
            		        				        		$("#parent_div_" + notification_jo.id).html("<div style=\"padding-bottom:5px\">" + data.by + " posted this poll.</div>");
            		        				        },
            		        				        error: function (XMLHttpRequest, textStatus, errorThrown) {
                		            		        	console.log(textStatus, errorThrown);
                		            		        }
                		            			});
            		        					return false;
            		        				});
        		        					
        		        					// if notification_jo has a root_comment_id and (either the current comment is not the same as the root comment (i.e. there's more than 1 comment to show) OR this is the root comment and it has children)
        		        					if(typeof notification_jo.hn_root_comment_id !== "undefined" && notification_jo.hn_root_comment_id !== null && notification_jo.hn_root_comment_id !== 0)
        		        					{
        		        						if(notification_jo.hn_root_comment_id !== data.id)
        		        							showbranch = true;
        		        						else // this is the root comment. Does it have children?
        		        						{
        		        							if(typeof data.kids !== "undefined" && data.kids !== null && data.kids.length > 0)
        		        								showbranch = true;
        		        						}
        		        						if(showbranch)	
        		        						{
        		        							$("#show_branch_link_" + notification_jo.id).click({notification_jo:notification_jo},function(event){
            		        							$("#parent_and_branch_td_" + notification_jo.id).html("");
            		        							var semirandom_id = event.data.notification_jo.hn_root_comment_id + "-" + makeid(3);
            		        							$("#parent_div_" + event.data.notification_jo.id).remove();
            		        							$("#comment_div_" + event.data.notification_jo.id).remove();
            		        							$("#child_div_" + event.data.notification_jo.id).remove();
            		        							$("#container_div_" + event.data.notification_jo.id).wrap("<div id=\"wrapper_div_" + semirandom_id + "\" style=\"background-color:#f0f0f0\"></div>");
            		        							writeUnifiedCommentContainer(semirandom_id, "container_div_" + event.data.notification_jo.id, "append");
            		        							doThreadItem(event.data.notification_jo.hn_root_comment_id, semirandom_id, "container_div_" + semirandom_id, 0, true, event.data.notification_jo.hn_target_id);
            		        							return false;
            		        						});
        		        						}
        		        					}
        		        				}
    		        				}
    		        				else // 3,4,7
    		        				{
    		        					// These are STORY types where hn_target_id == hn_root_story_id, so there's no need to retrieve any root (since we already have it)
    		        					// 3. upvote on story
    		            				// 4. downvote on story
    		            				// 7. story posted by someone user is following
    		        					
    		        					if(typeof data.deleted !== "undefined" && data.deleted !== null && data.deleted === true)
    		        					{
    		        						$("#title_link_" + notification_jo.id).text("(deleted)");																		// (a) show the story "title"
    		        						//$("#title_link_" + notification_jo.id).removeAttr("href");																		// (b) unlink to it
    		        						$("#comments_link_" + notification_jo.id).hide();			// there are no comments for a deleted story						// (c) unlink to comments
    		        					}
		            		        	else if(typeof data.dead !== "undefined" && data.dead !== null && data.dead === true)
		            		        	{
		            		        		$("#title_link_" + notification_jo.id).text("(flagkilled)");																	// (a) show the story "title"
		            		        		//$("#title_link_" + notification_jo.id).removeAttr("href");																		// (b) unlink to it
		            		        		$("#comments_link_" + notification_jo.id).hide();			// there are no comments for a deleted story						// (c) unlink to comments
		            		        	}
		            		        	else
		            		        	{	
		            		        		$("#title_link_" + notification_jo.id).text(data.title);																		// (a) show the story title
		            		        		$("#title_link_" + notification_jo.id).click({url:data.url, hn_root_story_id:data.id}, function(event){
		            		        			if(typeof event.data.url !== "undefined" && event.data.url !== null && event.data.url !== "")
		            		        				chrome.tabs.create({url: event.data.url});																				// (b) link to it
		            		        			else
		            		        				chrome.tabs.create({url: "https://news.ycombinator.com/item?id=" + event.data.id});										// (b) link to it (no url, so link to comments)
		            		        		});
		            		        		$("#comments_link_" + notification_jo.id).click({hn_target_id:notification_jo.hn_target_id}, function(event){
		            		        			chrome.tabs.create({url: "https://news.ycombinator.com/item?id=" + event.data.hn_target_id});								// (c) link to comments
		            		        		});
		            		        	}
    		        				}		
        		        			
        		        			var c_html = "<div style=\"padding-bottom:5px;font-weight:bold\">";
        		        			if(notification_jo.type === "3")
    		        					c_html = c_html + " Your <a href=\"#\" id=\"item_link_" + notification_jo.id + "\">story</a> was upvoted ";
    		        				else if(notification_jo.type === "4")
    		        					c_html = c_html + " Your <a href=\"#\" id=\"item_link_" + notification_jo.id + "\">story</a> was downvoted ";
    		        				else if(notification_jo.type === "5")
    		        					c_html = c_html + " <a href=\"#\" id=\"screenname_link_" + notification_jo.id + "\">" + notification_jo.triggerer + "</a> <a href=\"#\" id=\"item_link_" + notification_jo.id + "\">replied</a> to you:";
    		        				else if(notification_jo.type === "6")
    		        					c_html = c_html + " <a href=\"#\" id=\"screenname_link_" + notification_jo.id + "\">" + notification_jo.triggerer + "</a> <a href=\"#\" id=\"item_link_" + notification_jo.id + "\">commented</a> on your story:";
    		        				else if(notification_jo.type === "7")
    		        					c_html = c_html + " <a href=\"#\" id=\"screenname_link_" + notification_jo.id + "\">" + notification_jo.triggerer + "</a> posted a <a href=\"#\" id=\"item_link_" + notification_jo.id + "\">story</a>.";
    		        				else if(notification_jo.type === "8")
    		        					c_html = c_html + " <a href=\"#\" id=\"screenname_link_" + notification_jo.id + "\">" + notification_jo.triggerer + "</a> <a href=\"#\" id=\"item_link_" + notification_jo.id + "\">commented</a>:";
    		        				else if(notification_jo.type === "9")
    		        					c_html = c_html + " <a href=\"#\" id=\"screenname_link_" + notification_jo.id + "\">" + notification_jo.triggerer + "</a> <a href=\"#\" id=\"item_link_" + notification_jo.id + "\">deep-replied</a> to you:";
        		        			c_html = c_html + "</div>";
        		        			c_html = c_html + "<div id=\"comment_subdiv_" + notification_jo.id + "\"></div>";
        		        			$("#comment_div_" + notification_jo.id).html(c_html);
        		        			
        		        			$("#item_link_" + notification_jo.id).click({hn_target_id:notification_jo.hn_target_id}, function(event) {
        		        				chrome.tabs.create({url: "https://news.ycombinator.com/item?id=" + event.data.hn_target_id});
        		        			});
        		        			
        		        			if((typeof data.deleted !== "undefined" && data.deleted !== null && data.deleted === true) || 
        		                			(typeof data.dead !== "undefined" && data.dead !== null && data.dead === true))
        		            		{
        		        				var subdivhtml = "";
        		        				if(typeof data.deleted !== "undefined" && data.deleted !== null && data.deleted === true)
        		        					subdivhtml = "<span style=\"color:#828282\">(deleted)</span> - <a href=\"#\" id=\"show_deleted_link_" + notification_jo.id + "\">show</a>";
        		        				else if(typeof data.dead !== "undefined" && data.dead !== null && data.dead === true)
        		        					subdivhtml = "<span style=\"color:#828282\">(flagkilled)</span> - <a href=\"#\" id=\"show_deleted_link_" + notification_jo.id + "\">show</a>";
        		        				
        		        				$("#comment_subdiv_" + notification_jo.id).html(subdivhtml);
        		        				$("#show_deleted_link_" + notification_jo.id).click({notification_jo:notification_jo}, function(event) {
        		        					var inside_notification_jo = event.data.notification_jo;
        		        					$.ajax({ 
        		        						type: 'GET', 
        		        						url: endpoint,
        		        						data: {
        		        							method: "getItem",
        		        							id: inside_notification_jo.hn_target_id
        		        						},
        		        				        dataType: 'json', 
        		        				        async: true, 
        		        				        success: function (data, status) { 
        		        				        	if(data.response_status === "error")
    		        					        		$("#comment_subdiv_" + inside_notification_jo.id).html("Hackbook was unable to retrieve the original item. Sorry.");
        		        				        	else
        		        				        	{	
        		        				        		if(data.item_jo.type === "story" && data.item_jo.title)
            		        				        	{
            		        				        		$("#title_link_" + inside_notification_jo.id).text(data.item_jo.title);
            		        				        		if(data.item_jo.url)
            		        				        		{
            		        				        			$("#title_link_" + inside_notification_jo.id).unbind();
            		        				        			$("#title_link_" + inside_notification_jo.id).click({url: data.item_jo.url}, function(event){
            		        				        				chrome.tabs.create({url: event.data.url});
                    		            		        		});
            		        				        		}
            		        				        		if(typeof data.item_jo.text !== "undefined" && data.item_jo.text !== null && data.item_jo.text !== "")
            		        		        					writeNotificationText(data.text, notification_jo);
            		        				        		else
            		        				        			$("#comment_subdiv_" + inside_notification_jo.id).hide();
            		        				        	}
            		        				        	else
            		        				        	{	
            		        				        		if(data.response_status == "success" && (typeof data.item_jo.original_text === "undefined" || data.item_jo.original_text === null || data.item_jo.original_text === ""))
            		        					        		$("#comment_subdiv_" + inside_notification_jo.id).html("Hackbook was unable to retrieve the original text of this item. Sorry.");
            		        					        	else
            		        					        		writeNotificationText(data.item_jo.original_text, inside_notification_jo);
            		        				        	}
        		        				        	}
        		        				        },
        		        				        error: function (XMLHttpRequest, textStatus, errorThrown) {	console.log(textStatus, errorThrown); }
        		        					});
            		        				return false;
            		        			});
        		        			}	
        		        			else
        		        			{	
        		        				if(typeof data.text !== "undefined" && data.text !== null && data.text !== "") // 6,8,9
        		        					writeNotificationText(data.text, notification_jo);
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
        			else // unknown notification type
        			{
        				$("#comment_div_" + notification_jo.id).html("<div style=\"padding:25px\">Unknown notification type. If you're seeing this message frequently, please update Hackbook to the latest version. If that doesn't fix it, please email the developer at c@mailcyr.us.");
        			}	
        			
        			if(notification_jo.type === "C")
        			{
        				$.ajax({
        			        type: 'GET',
        			        url: endpoint,
        			        data: {
        			            method: "removeItemFromNotificationIds",
        			            notification_id: notification_jo.id,
        			            screenname: screenname,           
        			            this_access_token: this_access_token  
        			        },
        			        dataType: 'json',
        			        async: true,
        			        success: function (data, status) {
        			            if (data.response_status === "error") 
        			            {
        			            	displayMessage(data.message, "red", "utility_message_td");
        			            	if(data.error_code && data.error_code === "0000")
        			        		{
        			        			displayMessage("Your login has expired. Please relog.", "red");
        			        			bg.user_jo = null;
        			        			updateLogstat();
        			        		}
        			            }
        			            else 
        			            {
        			            	// succeed silently
        			            }
        			        },
        			        error: function (XMLHttpRequest, textStatus, errorThrown) {
        			        	displayMessage("Ajax error for removeItemFromNotificationIds method.", "red", "utility_message_td");
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

function writeNotificationText(text, notification_jo)
{
	var subdivhtml = "";
	subdivhtml = subdivhtml + replaceAll(text, "<a href=", "<a class=\"newtab\" href=");
	subdivhtml = subdivhtml + "<table style=\"padding-top:7px;width:100%\">";
	subdivhtml = subdivhtml + "	<tr>";
	subdivhtml = subdivhtml + "		<td style=\"text-align:left\"><a class=\"newtab\" style=\"font-size:11px;text-decoration:underline\" href=\"http://news.ycombinator.com/item?id=" + notification_jo.hn_target_id + "\">reply</a></td>";
	subdivhtml = subdivhtml + "		<td style=\"text-align:right\">";
	if(notification_jo.type === "9")
		subdivhtml = subdivhtml + " 		<span style=\"font-size:11px;font-style:italic;color:#828282\">Deep reply notifications can be turned off <a href=\"#\" id=\"deep_reply_settings_link_" + notification_jo.id + "\" style=\"color:#828282;text-decoration:underline\">here</a>.</span>";
	subdivhtml = subdivhtml + "		</td>";
	subdivhtml = subdivhtml + "	</tr>";
	subdivhtml = subdivhtml + "</table>";
	$("#comment_subdiv_" + notification_jo.id).html(subdivhtml);
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
	if(notification_jo.type === "9")
	{
		$("#deep_reply_settings_link_" + notification_jo.id).click(function(event){
			viewProfile();
		});
	}	
}
