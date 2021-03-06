
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
	
	$("#chat_tab_link").css("font-weight", "normal");
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
		$("#main_div").html("<div style=\"padding:40px;text-align:center;\">You are in \"notifications only\" URL-checking mode, so no thread will appear here.</div>");
	}	
	else if(currentURL === "https://news.ycombinator.com" || currentURL === "https://news.ycombinator.com/" || currentURL === "https://news.ycombinator.com/news")
	{
		$("#utility_table").hide();
		$("#main_div").html("<div style=\"padding:40px;text-align:center;\">This is the Hacker News main page and while there are sometimes HN story items for it, they are usually mistaken. (That is, someone posted a story with \"http://news.ycombinator.com\" as the target URL. Oops!) So Hackbook doesn't display them.</div>");
	}
	else if(isValidURLFormation(currentURL))
	{
		if(bg.threadstatus === 0)
			gotThread();
		else  						// ok this isn't super-elegant, but should be a 99% solution.
		{
			$("#utility_table").hide();
			$("#main_div").html("<div style=\"padding:40px;text-align:center;\">Wow you're fast! The comment thread for this URL had not been retrieved by the time you got here.<br><br><a href=\"#\" id=\"try_thread_again_link\">Click here to try again.</a></div>");
			$("#try_thread_again_link").click(function(){
				doThreadTab();
			});
		}
	}
	else // not a valid URL formation
	{
		$("#utility_table").hide();
		$("#main_div").html("<div style=\"padding:40px;text-align:center;\">There is no Hacker News item for this irregular URL.</div>");
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
		if(bg.t_jo.url !== "")
		{	
			var bi = bg.t_jo.url.indexOf("://") + 3;
			var ei = bg.t_jo.url.indexOf("/", bg.t_jo.url.indexOf("://") + 3);
			var hostname = bg.t_jo.url.substring(bi,ei);
			happy = happy + bg.t_jo.title + " <span style=\"font-size:11px;color:#828282\">(" + hostname + ")</span>";
		}
		else
			happy = happy + bg.t_jo.title;
		happy = happy + "		</td>";
		happy = happy + "	</tr>";
		happy = happy + "	<tr>";
		happy = happy + "		<td style=\"border:0px solid red;\"></td>";
		happy = happy + "		<td style=\"padding-right:3px;color:#828282;font-size:9px;border:0px solid red;\">";
		happy = happy + bg.t_jo.score + " points by <a href=\"#\" id=\"op_screenname_link\" style=\"color:#828282\">" + bg.t_jo.by + "</a> ";
		if(bg.user_jo)
			happy = happy + "(<a href=\"#\" id=\"follow_link_" + bg.t_jo.by + "\" style=\"color:#828282\">follow</a>) ";
		if(typeof bg.t_jo.children === "undefined" || bg.t_jo.children === null)
			happy = happy + bg.agoIt(bg.t_jo.time * 1000) + " | 0 <a href=\"#\" id=\"comments_link\" style=\"color:#828282\">comments</a>";
		else
			happy = happy + bg.agoIt(bg.t_jo.time * 1000) + " | " + bg.t_jo.children.length + " <a href=\"#\" id=\"comments_link\" style=\"color:#828282\">comments</a>";
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
					followOrUnfollowUser(event.data.target_screenname, "followUser", "follow_link_" + event.data.target_screenname);
					return false;
				});
			}
			else
			{
				$("[id=follow_link_" + bg.t_jo.by + "]").text("unfollow");
				$("[id=follow_link_" + bg.t_jo.by + "]").click({target_screenname: bg.t_jo.by}, function(event) {
					event.stopImmediatePropagation();
					followOrUnfollowUser(event.data.target_screenname, "unfollowUser", "follow_link_" + event.data.target_screenname);
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
			var semirandom_id = "";
			for(var x=beginindex; x < endindex && x < bg.t_jo.children.length; x++) 
			{
				semirandom_id = bg.t_jo.children[x] + "-" + makeid(3);
				writeUnifiedCommentContainer(semirandom_id, "main_div", "append");
				doThreadItem(bg.t_jo.children[x], semirandom_id, "container_div_" + semirandom_id, 0, null); // don't highlight anything
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

function writeUnifiedCommentContainer(semirandom_id, anchor_dom_id, anchor_action) // main_div_HASH, append/before/after/prepend, etc
{
	var s = "";
	s = s + "<div id=\"container_div_" + semirandom_id + "\">";
	s = s + "	<div id=\"horizline_div_" + semirandom_id + "\" class=\"complete-horiz-line-div\"></div>"; // always shown
	s = s + "	<div style=\"padding:6px\">";
	s = s + "		<div id=\"message_div_" + semirandom_id + "\" class=\"container_message\"></div>"; // hidden unless message displayed
	s = s + "		<div id=\"header_div_" + semirandom_id + "\" class=\"container_header\"></div>"; // hidden except for notification page
	s = s + "		<div id=\"parent_div_" + semirandom_id + "\" class=\"container_parent\"></div>"; //hidden except for notification page
	s = s + "		<div id=\"comment_div_" + semirandom_id + "\" class=\"container_comment\"><div style=\"text-align:center\"><img src=\"" + chrome.extension.getURL("images/ajaxSnake.gif") + "\"></div></div>"; // always shown except for like/dislike on notification page
	s = s + "		<div id=\"child_div_" + semirandom_id + "\" class=\"container_child\"></div>"; // always hidden except when someone replies on notification page
	s = s + "	</div>";
	s = s + "</div>";
	if(anchor_action === "append")
		$("#" + anchor_dom_id).append(s);
	else if(anchor_action === "prepend")
		$("#" + anchor_dom_id).prepend(s);
	else if(anchor_action === "after")
		$("#" + anchor_dom_id).after(s);
	else if(anchor_action === "before")
		$("#" + anchor_dom_id).before(s);
}

function doThreadItem(comment_id, semirandom_id, anchor_dom_id, level, indicate_root, comment_id_to_highlight) // type = "initialpop", "newcomment", "reply"
{
	if(typeof level === "undefined" || level === null)
		level = 0;
	if(typeof indicate_root === "undefined" || indicate_root === null || !(indicate_root === true || indicate_root === false))
		indicate_root = false;
	$.ajax({ 
		type: 'GET', 
		url: "https://hacker-news.firebaseio.com/v0/item/" + comment_id + ".json", 
        dataType: 'json', 
        async: true, 
        success: function (data, status) {
        	if(data.error)
        	{
        		$("#comment_div_" + semirandom_id).css("color", "red");
        		if(data.error === "Permission denied")
        			$("#comment_div_" + semirandom_id).html("HN API: \"Permission denied\"");
        		else
        			$("#comment_div_" + semirandom_id).html("Unknown error from HN API");
        	}	
        	else
        	{
        		var hn_item_jo = data;
        		var isdead = false;
            	var isdeleted = false;
            	if(data.deleted !== null && data.deleted === true)
            		isdeleted = true;
            	if(data.dead && data.dead === true)
            		isdead = true;
            	
            	$.ajax({ 
					type: 'GET', 
					url: endpoint,
					data: {
						method: "getItem",
						id: comment_id
					},
			        dataType: 'json', 
			        async: true, 
			        success: function (data, status) { 
			        	if(isdeleted === true || isdead === true)
			        	{	
			        		if(data.response_status === "error")
    			        		$("#comment_div_" + semirandom_id).html("This deleted item was not found in the Hackbook database, so its text cannot be displayed. Sorry.");
    			        	else
    			        	{
    			        		if (data.response_status == "success" && (typeof data.item_jo.original_text === "undefined" || data.item_jo.original_text === null || data.item_jo.original_text === ""))
    			        			$("#comment_div_" + semirandom_id).html("This deleted item was found in the Hackbook database, but no original text was associated with it. Sorry.");
    			        		else
    			        			writeComment(data.item_jo.id, data.item_jo.by, data.item_jo.time, data.item_jo.original_text, hn_item_jo.text, semirandom_id, false, false, isdeleted, isdead);
    			        	}
			        	}
			        	else
			        	{
			        		if(data.response_status === "error") // couldn't find this item in the Hackbook database. Just show the HN API result.
    			        		writeComment(hn_item_jo.id, hn_item_jo.by, hn_item_jo.time, null, hn_item_jo.text, semirandom_id, indicate_root, (comment_id_to_highlight === hn_item_jo.id), isdeleted, isdead);
    			        	else if (data.response_status == "success" && (typeof data.item_jo.original_text === "undefined" || data.item_jo.original_text === null || data.item_jo.original_text === "")) // Found the item, but there was no original_text. Just show the HN API result.
    			        		writeComment(hn_item_jo.id, hn_item_jo.by, hn_item_jo.time, null, hn_item_jo.text, semirandom_id, indicate_root, (comment_id_to_highlight === hn_item_jo.id), isdeleted, isdead);
    			        	else
    			        		writeComment(data.item_jo.id, data.item_jo.by, data.item_jo.time, data.item_jo.original_text, hn_item_jo.text, semirandom_id, indicate_root, (comment_id_to_highlight === hn_item_jo.id), isdeleted, isdead);
			        	}	
			        },
			        error: function (XMLHttpRequest, textStatus, errorThrown) {	console.log(textStatus, errorThrown); }
				});
            	
            	var indent = (level) * 30;
            	$("#comment_div_" + semirandom_id).css("margin-left", indent + "px");
        		if(data.kids && data.kids.length > 0) // if this is a new reply on the notifications tab, it'll never have kids, so no worry here
        		{
        			var nested_semirandom_id = "";
    				for(var y=0; y < data.kids.length; y++) 
    	    		{  
    					nested_semirandom_id = data.kids[y] + "-" + makeid(3);
    					writeUnifiedCommentContainer(nested_semirandom_id, anchor_dom_id, "append");
    					doThreadItem(data.kids[y], nested_semirandom_id, "container_div_" + nested_semirandom_id, (level+1), false, comment_id_to_highlight);
    	    		}
        		}
        	}	
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        	displayMessage("Unable to retrieve HN comment. (ajax)", "red", "message_div_" + semirandom_id);
        	console.log(textStatus, errorThrown);
        }
	});	
}		

function strip(html)
{
	var tmp = document.createElement("DIV");
	tmp.innerHTML = html;
	return tmp.textContent || tmp.innerText || "";
}

// id
// by
// time
// text

function writeComment(id, by, time, original_text, current_text, semirandom_id, indicate_root, highlight, isdeleted, isdead)
{
	// NOTE: I tried changing semirandom_id to a random string, but it broke the saved text mechanism.
	// I've now switched to comment_id-semirandom_id so that the uniqueness is still there (Even if the same comment appears twice, as it can on notification/feed items)
	// but the save text can be put in using the comment_id prefix. 
	
	var writeReplyTD = false;
	var tempstr = "";
		
	// show this user's info
	if(highlight === true && bg.user_jo) // as of right now, highlights are only used on newsfeed and notifications tabs, which means the user is always logged in. OK to pair these for now.
		tempstr = tempstr + "<table style=\"border-left:1px solid #" + bg.hn_topcolor + ";padding:4px;\">";
	else
		tempstr = tempstr + "<table style=\"border:0px solid orange;border-collapse:collapse;\">";
	if(indicate_root === true)
	{
		tempstr = tempstr + "	<tr>";
		tempstr = tempstr + "		<td colspan=2 style=\"text-align:left;padding:5px;font-weight:bold\">root comment:</td>"; 
		tempstr = tempstr + "	</tr>";
	}	
	tempstr = tempstr + "	<tr>";
	tempstr = tempstr + "		<td style=\"vertical-align:top;width:10px;text-align:center;border:0px solid green\">"; 
	// UP AND DOWN ARROWS
	if(!isdeleted && !isdead)
	{	
		tempstr = tempstr + "			<table style=\"border:0px solid red;border-collapse:collapse\">";
		tempstr = tempstr + "				<tr>";
		tempstr = tempstr + "					<td style=\"padding-bottom:0px;border:0px solid black\"> ";
		tempstr = tempstr + "						<a href=\"#\" id=\"like_link_" + semirandom_id + "\"><img src=\"" + chrome.extension.getURL("images/grayarrow_up.gif") + "\"></a>";
		tempstr = tempstr + "					</td>";
		tempstr = tempstr + "				</tr>";			
		tempstr = tempstr + "				<tr>";
		tempstr = tempstr + "					<td style=\"padding-top:0px;border:0px solid black\"> ";
		if(bg.user_jo && bg.user_jo.hn_karma >=500)
			tempstr = tempstr + "					<a href=\"#\" id=\"dislike_link_" + semirandom_id + "\"><img src=\"" + chrome.extension.getURL("images/grayarrow_down.gif") + "\"></a>";
		tempstr = tempstr + "					</td>";
		tempstr = tempstr + "				</tr>";			
		tempstr = tempstr + "			</table>";
	}
	tempstr = tempstr + "		</td>";
	tempstr = tempstr + "		<td> <!-- everything else, right-hand side -->";
	tempstr = tempstr + "			<table style=\"border:0px solid purple;border-collapse:collapse\">";
	tempstr = tempstr + "				<tr>";
	tempstr = tempstr + "					<td style=\"vertical-align:middle;text-align:left;border:0px solid black;padding:2px 0px 0px 2px\" > "; 
	tempstr = tempstr + "						<table style=\"width:100%;float:left;border:0px solid brown;vertical-align:middle; border-collapse: separate\">";
	tempstr = tempstr + "							<tr> ";
	tempstr = tempstr + "		  					 	<td style=\"vertical-align:middle;text-align:left;color:#828282;font-size:11px\">";
	tempstr = tempstr + "		  					 		<a href=\"#\" id=\"screenname_link_" + semirandom_id + "\" style=\"color:#828282\"></a>";
	if(bg.user_jo)
		tempstr = tempstr + "		  					 		 (<a href=\"#\" id=\"follow_link_" + by + "\" style=\"color:#828282\">follow</a>)";
	if(isdeleted)
		tempstr = tempstr + " <span style=\"color:red;font-style:italic\">(deleted)</span>";
	if(isdead)
		tempstr = tempstr + " <span style=\"color:red;font-style:italic\">(flagkilled)</span>";
	tempstr = tempstr + "		  					 		 - <span id=\"time_ago_span_" + semirandom_id + "\" style=\"padding:5px;\"></span>";
	tempstr = tempstr + "		  					 	</td>";
	tempstr = tempstr + "							</tr>";
	tempstr = tempstr + "  						</table>";
	tempstr = tempstr + "					</td>";
	tempstr = tempstr + "				</tr>";
	tempstr = tempstr + "				<tr>";
	tempstr = tempstr + "					<td style=\"padding:5px;vertical-align:top;text-align:left;font-size:11px;\" id=\"comment_text_td_" + semirandom_id + "\"> ";
  	tempstr = tempstr + "					</td>";
  	tempstr = tempstr + "				</tr>";
  	if(!isdeleted && !isdead)
	{	
  		tempstr = tempstr + "				<tr id=\"reply_tr_" + semirandom_id + "\">";
  	  	tempstr = tempstr + "					<td style=\"padding:3px;text-align:left\"> ";
  	  //	alert(time*1 + " and " + bg.msfe_according_to_backend);
  	  	if((time*1000) > (bg.msfe_according_to_backend - 1209600000)) // this is less than 2 weeks old, show reply
  	  		tempstr = tempstr + "							<a href=\"#\" id=\"reply_link_" + semirandom_id + "\" style=\"font-size:11px\">reply</a>";
  	  	else
  	  		$("#comment_submission_form_div").hide();
  	  	tempstr = tempstr + "					</td>";
  	  	tempstr = tempstr + "				</tr>";
  	}
  	tempstr = tempstr + "			</table>";
  	tempstr = tempstr + "		</td>";
	tempstr = tempstr + "	</tr>";
  	tempstr = tempstr + "</table>"
  	
	$("#comment_div_" + semirandom_id).html(tempstr);//OK
	
  	$("[id=screenname_link_" + semirandom_id + "]").text(by);
  	$("[id=time_ago_span_" + semirandom_id + "]").text(bg.agoIt(time*1000));
  	if(isdeleted || isdead)
  	{
  		$("#comment_text_td_" + semirandom_id).css("color", "red");
  		$("#comment_text_td_" + semirandom_id).html(replaceAll(original_text, "<a href=", "<a class=\"newtab\" href="));
  	}
  	else if((original_text === null && current_text !== null) || (original_text !== null && current_text !== null && original_text === current_text)) // if there is only current_text or there's both and they're equal
  	{
  		$("#comment_text_td_" + semirandom_id).html(replaceAll(current_text, "<a href=", "<a class=\"newtab\" href="));
  	}
  	else if(original_text !== null && current_text !== null && original_text !== current_text) // if there's only both and they're not equal
  	{
  		$("#comment_text_td_" + semirandom_id).html(replaceAll(current_text, "<a href=", "<a class=\"newtab\" href=") + "<br><br><span style=\"font-style:italic;color:red\">NOTE: This comment was edited.</span> <a href=\"#\" style=\"text-decoration:underline\" id=\"showedits_link_" + semirandom_id + "\">show changes</a> <span style=\"font-style:italic\">(removes all HTML formatting)</span>");
  		$("#comment_text_td_" + semirandom_id).click({semirandom_id: semirandom_id, original_text: original_text, current_text: current_text}, function(event){
  			var loc_original_text = strip(event.data.original_text);
  			var loc_current_text = strip(event.data.current_text);
  			var dmp = new diff_match_patch();
  			dmp.Diff_Timeout = 1.0;
  			var d = dmp.diff_main(loc_original_text, loc_current_text);
  			dmp.diff_cleanupSemantic(d);
  			var ds = dmp.diff_prettyHtml(d);
  			$("#comment_text_td_" + event.data.semirandom_id).html(ds);
  			return false;
  		});
  	}

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
	
  	if(!isdeleted && !isdead)
	{	
  		$("[id=reply_link_" + semirandom_id + "]").click({comment_id: id}, function(event) { 
  		 	chrome.tabs.create({url:"https://news.ycombinator.com/reply?id=" + event.data.comment_id});
  		 	return false;
  		});

  		$("[id=like_link_" + semirandom_id + "]").click({semirandom_id: semirandom_id, comment_id: id}, function(event) {
  			//noteItemLikeOrDislike(event.data.semirandom_id, "like");
  			bg.likedislikemode = "commentlike";
  			$("[id=like_link_" + event.data.semirandom_id + "]").html("");
  			chrome.tabs.create({url:"https://news.ycombinator.com/reply?id=" + event.data.comment_id, active: false}, function(){});
  			return false;
  		});
  			 
  		$("[id=dislike_link_" + semirandom_id + "]").click({semirandom_id: semirandom_id, comment_id: id}, function(event) { 
  			//noteItemLikeOrDislike(event.data.semirandom_id, "dislike");
  			bg.likedislikemode = "commentdislike";
  			$("[id=dislike_link_" + event.data.semirandom_id + "]").html("");
  			chrome.tabs.create({url:"https://news.ycombinator.com/reply?id=" + event.data.comment_id, active: false}, function(){});
  			return false;
  		});
	}
	
	$("[id=screenname_link_"+ semirandom_id + "]").click({target_screenname: by}, function(event) { 
		chrome.tabs.create({url:"http://news.ycombinator.com/user?id=" + event.data.target_screenname});
		return false;
	});	
	
	if(bg.user_jo && (!bg.user_jo.following || bg.user_jo.following.indexOf(by) == -1))
	{
		$("[id=follow_link_" + by + "]").text("follow");
    	$("[id=follow_link_" + by + "]").click({target_screenname: by}, function(event) {
    		followOrUnfollowUser(event.data.target_screenname, "followUser", "follow_link_" + event.data.target_screenname);
			return false;
		});
	}
	else
	{
		$("[id=follow_link_" + by + "]").text("unfollow");
		$("[id=follow_link_" + by + "]").click({target_screenname: by}, function(event) { 
    		followOrUnfollowUser(event.data.target_screenname, "unfollowUser", "follow_link_" + event.data.target_screenname);
			return false;
		});
	}
}
