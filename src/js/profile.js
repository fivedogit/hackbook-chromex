
/***
 *     _   _ _____ _____ _    _  ____________ ___________ _____ _      _____ 
 *    | | | |_   _|  ___| |  | | | ___ \ ___ \  _  |  ___|_   _| |    |  ___|
 *    | | | | | | | |__ | |  | | | |_/ / |_/ / | | | |_    | | | |    | |__  
 *    | | | | | | |  __|| |/\| | |  __/|    /| | | |  _|   | | | |    |  __| 
 *    \ \_/ /_| |_| |___\  /\  / | |   | |\ \\ \_/ / |    _| |_| |____| |___ 
 *     \___/ \___/\____/ \/  \/  \_|   \_| \_|\___/\_|    \___/\_____/\____/ 
 *                                                                           
 *                                                                           
 */

function viewProfile()
{
	tabmode = "profile";
	$("#utility_table").show();
	if(bg.user_jo)
	{
		$("#utility_header_td").html("<span style=\"text-align:left;font-size:14px;font-weight:bold\">Profile</span> <a href=\"#\" id=\"view_profile_on_hn_link\" style=\"font-size:10px;color:#828282\">(view on HN)</a>");
		$("#view_profile_on_hn_link").click(function(){
			chrome.tabs.create({url:"https://news.ycombinator.com/user?id=" + bg.user_jo.screenname});
		});
	}
	else
		$("#utility_header_td").html("<span style=\"text-align:left;font-size:14px;font-weight:bold\">Profile</span>");
	$("#utility_message_td").hide();
	$("#utility_csf_td").hide();
	
	$("#chat_tab_link").css("font-weight", "normal");
	$("#thread_tab_link").css("font-weight", "normal");
	$("#newsfeed_tab_link").css("font-weight", "normal");
	$("#notifications_tab_link").css("font-weight", "normal");
	$("#profile_link").css("font-weight", "bold");
	
	if(typeof bg.user_jo !== "undefined" && bg.user_jo !== null)
	{
		$("#notification_count_span").text(bg.user_jo.notification_count);
		$("#newsfeed_count_span").text(bg.user_jo.newsfeed_count);
		// count resets happen in getNotifications so the display can do the yellow background thing
	}
	
	if (bg.user_jo !== null)
	{	
		getProfile(); // get the specified profile (mine or someone else's)
	}
	else
	{
		$("#main_div").html("<div style=\"padding:20px\">Log in to see user profiles.</div>");//OK
	}
}

function getProfile()
{
	var main_div_string = "";
	if (typeof bg.user_jo ==="undefined" || bg.user_jo === null) // not logged in nor was a target specified, 
	{									
		$("#main_div").html("<div style=\"padding:20px\">Log in to see user profiles.</div>");//OK
	}
	else
	{
    	main_div_string = main_div_string + "<div style=\"padding:5px;text-align:center\">";
    	main_div_string = main_div_string + "<table style=\"margin-right:auto;margin-left:auto;width:580px\">";
    	main_div_string = main_div_string + "<tr>";
    	main_div_string = main_div_string + "	<td>";
    	main_div_string = main_div_string + "		<table style=\"width:auto;border-collapse:separate;border-spacing:7px\">";
    	main_div_string = main_div_string + "			<tr><td style=\"text-align:left;color:#828282\">user:</td><td style=\"text-align:left\"><span id=\"profile_page_screenname_span\"></span> - <a href=\"#\" id=\"logout_link\">logout</a></td><td></td></tr>";
    	main_div_string = main_div_string + "			<tr><td style=\"text-align:left;color:#828282\">karma:</td><td style=\"text-align:left\" id=\"profile_page_karma_td\"></td><td></td></tr>";
    	main_div_string = main_div_string + "			<tr><td style=\"text-align:left;color:#828282;width:25%\">notification mode: </td>";
		main_div_string = main_div_string + "				<td colspan=2 style=\"text-align:left\">";
		main_div_string = main_div_string + "				<select id=\"notificationmode_selector\">";
		main_div_string = main_div_string + "					<option value=\"notifications_only\">my stuff only</option>";
		main_div_string = main_div_string + "					<option SELECTED value=\"newsfeed_and_notifications\">newsfeed and my stuff</option>";
		main_div_string = main_div_string + "				</select> ";
		main_div_string = main_div_string + "				(<a href=\"#\" id=\"notificationmode_explainer_link\">?</a>) <span id=\"notificationmode_result_td\"></span>";
		main_div_string = main_div_string + "				</td>";
		main_div_string = main_div_string + "			</tr>";
		main_div_string = main_div_string + "			<tr id=\"notificationmode_explainer_tr\" style=\"display:none\"><td></td><td colspan=2 style=\"text-align:left;color:black;font-size:11px\" id=\"notificationmode_explainer_td\"></td>";
    	main_div_string = main_div_string + "			<tr><td style=\"text-align:left;color:#828282;width:25%\">URL-checking mode: </td>";
		main_div_string = main_div_string + "				<td style=\"text-align:left\">";
		main_div_string = main_div_string + "					<select id=\"urlcheckingmode_selector\">";
		main_div_string = main_div_string + "						<option SELECTED value=\"stealth\">stealth</option>";
		main_div_string = main_div_string + "						<option value=\"notifications_only\">notifications only</option>";
		main_div_string = main_div_string + "					</select> ";
		main_div_string = main_div_string + "					(<a href=\"#\" id=\"urlcheckingmode_explainer_link\">?</a>) <span id=\"urlcheckingmode_result_span\" style=\"font-style:italic;color:#828282;font-size:10px\"></span>";
		main_div_string = main_div_string + "				</td>";
		main_div_string = main_div_string + "			</tr>";
		main_div_string = main_div_string + "			<tr id=\"urlcheckingmode_explainer_tr\" style=\"display:none\"><td></td><td colspan=2 style=\"text-align:left;color:black;font-size:11px\" id=\"urlcheckingmode_explainer_td\"></td>";
		main_div_string = main_div_string + "			<tr><td style=\"text-align:left;color:#828282;width:25%\">karma pool TTL: </td>";
		main_div_string = main_div_string + "				<td style=\"text-align:left\">";
		main_div_string = main_div_string + "					<form id=\"karma_pool_ttl_form\"><input type=text id=\"karma_pool_ttl_input\" style=\"width:40px\"> minutes (<a href=\"#\" id=\"karma_pool_explainer_link\">?</a>) <span id=\"karma_pool_result_span\" style=\"font-style:italic;color:#828282;font-size:10px\"></span></form>";
		main_div_string = main_div_string + "				</td>";
		main_div_string = main_div_string + "			</tr>";
		main_div_string = main_div_string + "			<tr id=\"karma_pool_explainer_tr\" style=\"display:none\"><td></td><td colspan=2 style=\"text-align:left;color:black;font-size:11px\" id=\"karma_pool_explainer_td\"></td>";
		main_div_string = main_div_string + "			<tr><td style=\"text-align:left;color:#828282;width:25%\">deep replies: </td>";
		main_div_string = main_div_string + "				<td style=\"text-align:left\">";
		main_div_string = main_div_string + "					<select id=\"hide_deep_reply_notifications_selector\">";
		main_div_string = main_div_string + "						<option value=\"hide\">hide</option>";
		main_div_string = main_div_string + "						<option SELECTED value=\"show\">show</option>";
		main_div_string = main_div_string + "					</select>";
		main_div_string = main_div_string + "					<span id=\"hide_deep_reply_notifications_result_span\" style=\"font-style:italic;color:#828282;font-size:10px\"></span>";
		main_div_string = main_div_string + "				</td>";
		main_div_string = main_div_string + "			</tr>";
		main_div_string = main_div_string + "			<tr><td style=\"text-align:left;color:#828282;width:25%\">promo rate/share links: </td>";
		main_div_string = main_div_string + "				<td style=\"text-align:left\">";
		main_div_string = main_div_string + "					<select id=\"hide_promo_links_selector\">";
		main_div_string = main_div_string + "						<option value=\"hide\">hide</option>";
		main_div_string = main_div_string + "						<option SELECTED value=\"show\">show</option>";
		main_div_string = main_div_string + "					</select>";
		main_div_string = main_div_string + "					<span id=\"hide_promo_links_result_span\" style=\"font-style:italic;color:#828282;font-size:10px\"></span>";
		main_div_string = main_div_string + "				</td>";
		main_div_string = main_div_string + "			</tr>";
		main_div_string = main_div_string + "			<tr>";
		main_div_string = main_div_string + "				<td style=\"text-align:left;color:#828282;width:25%;vertical-align:top\">";
		main_div_string = main_div_string + "					following:";
		main_div_string = main_div_string + "					<div style=\"padding-left:12px;font-size:8pt\"><a href=\"#\" id=\"get_suggestions_link\" style=\"color:#828282\">get suggestions</a></div>";
		main_div_string = main_div_string + "					<div style=\"padding-left:12px;font-size:8pt\"><a href=\"#\" id=\"add_follow_link\" style=\"color:#828282\">add specific</a></div>";
		main_div_string = main_div_string + "				</td>";
		main_div_string = main_div_string + "				<td colspan=2 style=\"text-align:left;font-size:11px\">";
		if(typeof bg.user_jo.following === "undefined" || bg.user_jo.following === null || isEmpty(bg.user_jo.following))
			main_div_string = main_div_string + "<i>none</i>";
		else
		{
			var x = 0;
			bg.user_jo.following.sort();
			while(x < bg.user_jo.following.length - 1)
			{
				main_div_string = main_div_string + "<a href=\"#\" id=\"unfollow_" + bg.user_jo.following[x] + "_link\">" + bg.user_jo.following[x] + "</a>, ";
				x++;
			}	
			main_div_string = main_div_string + "<a href=\"#\" id=\"unfollow_" + bg.user_jo.following[x] + "_link\">" + bg.user_jo.following[x] + "</a>";
		}
		main_div_string = main_div_string + "				</td>";
		main_div_string = main_div_string + "			</tr>";
		main_div_string = main_div_string + "						<tr id=\"add_follow_tr\" style=\"display:none\">";
		main_div_string = main_div_string + "							<td style=\"text-align:left;color:#828282;width:25%\"></td>";
		main_div_string = main_div_string + "							<td colspan=2 style=\"text-align:left;color:#828282;\"><input type=text style=\"width:150px\" id=\"add_follow_input\"> <input id=\"add_follow_go_button\" type=\"button\" value=\"add\"> <span id=\"add_follow_result_span\" style=\"font-style:italic;color:#828282;font-size:10px\"></span></td>";
		main_div_string = main_div_string + "						</tr>";
		main_div_string = main_div_string + "						<tr><td style=\"text-align:left;color:#828282\">followers: </td>";
		main_div_string = main_div_string + "							<td colspan=2 style=\"text-align:left;font-size:11px\">";
		if(typeof bg.user_jo.followers === "undefined" || bg.user_jo.followers === null || isEmpty(bg.user_jo.followers))
			main_div_string = main_div_string + "<i>none</i>";
		else
		{
			var x = 0;
			bg.user_jo.followers.sort();
			while(x < bg.user_jo.followers.length - 1)
			{
				main_div_string = main_div_string + bg.user_jo.followers[x] + ", ";
				x++;
			}	
			main_div_string = main_div_string + bg.user_jo.followers[x];
		}
		main_div_string = main_div_string + "							</td>";
		main_div_string = main_div_string + "						</tr>";
		main_div_string = main_div_string + "			<tr><td colspan=3 style=\"text-align:left;color:black;padding-top:10px\">HN page modifications<span style=\"padding-left:8px;font-style:italic;color:#828282;font-size:10px\">hide if Hackbook conflicts with other extensions</span></td></tr>";
		main_div_string = main_div_string + "			<tr><td style=\"text-align:left;color:#828282;width:25%\">inline follow: </td>";
		main_div_string = main_div_string + "				<td style=\"text-align:left\">";
		main_div_string = main_div_string + "					<select id=\"hide_inline_follow_selector\">";
		main_div_string = main_div_string + "						<option value=\"hide\">hide</option>";
		main_div_string = main_div_string + "						<option SELECTED value=\"show\">show</option>";
		main_div_string = main_div_string + "					</select> ";
		main_div_string = main_div_string + "					<span id=\"hide_inline_follow_result_span\" style=\"font-style:italic;color:#828282;font-size:10px\"></span>";
		main_div_string = main_div_string + "				</td>";
		main_div_string = main_div_string + "			</tr>";
		main_div_string = main_div_string + "			<tr><td colspan=3 style=\"padding-top:10px\"></td></tr>"; // spacer row 
		main_div_string = main_div_string + "			<tr><td style=\"text-align:left;color:#828282\"></td><td style=\"text-align:left;\"><a href=\"#\" id=\"profile_page_savedstories_link\">saved stories</a></td><td></td></tr>";
		main_div_string = main_div_string + "			<tr><td style=\"text-align:left;color:#828282\"></td><td style=\"text-align:left;\"><a href=\"#\" id=\"profile_page_submissions_link\">submissions</a></td><td></td></tr>";
		main_div_string = main_div_string + "			<tr><td style=\"text-align:left;color:#828282\"></td><td style=\"text-align:left;\"><a href=\"#\" id=\"profile_page_comments_link\">comments</a></td><td></td></tr>";
		main_div_string = main_div_string + "		</table>";
		main_div_string = main_div_string + "	</td>";
		main_div_string = main_div_string + "</tr>";
		main_div_string = main_div_string + "</table>";
		main_div_string = main_div_string + "</div>";
		$("#main_div").html(main_div_string); //OK
					
		$("#profile_page_screenname_span").text(bg.user_jo.screenname);

		$("#logout_link").click( function (event) { event.preventDefault();
			chrome.runtime.sendMessage({method: "logout"}, function(response) {
				bg.user_jo = null;
				doOverlay();
			});
		});
		
		$("#profile_page_since_td").html(bg.agoIt(bg.user_jo.since) + " <img src=\"" + chrome.extension.getURL("images/l18.png") + "\" style=\"border:1px solid white;height:14px;width:14px;vertical-align:middle\"> ");
		
		$("#profile_page_karma_td").html(bg.user_jo.hn_karma);
		
		if (bg.user_jo.notification_mode === "newsfeed_and_notifications")
			$("#notificationmode_selector").val("newsfeed_and_notifications");
		else if (bg.user_jo.notification_mode === "notifications_only")
			$("#notificationmode_selector").val("notifications_only");
		
		$("#notificationmode_selector").change(function () {
			$.ajax({
				type: 'GET',
				url: endpoint,
				data: {
		            method: "setUserPreference",
		            screenname: screenname,          
		            this_access_token: this_access_token,  
		            which: "notification_mode",
		            value: $("#notificationmode_selector").val() 
		        },
		        dataType: 'json',
		        async: true,
		        success: function (data, status) {
		        	if (data.response_status === "error")
		        	{
		        		$("#notificationmode_result_td").text(data.message);
		        		// on error, reset the selector to the bg.user_jo value
		        		if (bg.user_jo.notification_mode === "newsfeed_and_notifications")
		            		$("#notificationmode_selector").val("newsfeed_and_notifications");
		        		else if (bg.user_jo.notification_mode === "notifications_only")
		            		$("#notificationmode_selector").val("notifications_only");
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
		        		bg.user_jo.notification_mode = $("#notificationmode_selector").val();
		        		$("#notificationmode_result_td").text("updated");
		        		bg.doButtonGen();
		        	}
		        	setTimeout(function(){$("#notificationmode_result_td").text("");},3000);
		        }
		        ,
		        error: function (XMLHttpRequest, textStatus, errorThrown) {
		        	$("#notificationmode_result_td").text("ajax error");
		        	setTimeout(function(){$("#notificationmode_result_td").text("");},3000);
		            console.log(textStatus, errorThrown);
		        }
			});
		});

		$("#notificationmode_explainer_link").click(function () {
			$("#notificationmode_explainer_tr").show();
			$("#notificationmode_explainer_td").html("<div style=\"padding:5px 0px 5px 0px;\">When do you want the button to indicate new activity? Only when you have new notifications (for your stuff) or also when you have new news feed items (i.e. when those you're following do stuff)?</div>");
		});
		
		if (bg.user_jo.url_checking_mode === "stealth")
			$("#urlcheckingmode_selector").val("stealth");
		else if (bg.user_jo.url_checking_mode === "notifications_only")
			$("#urlcheckingmode_selector").val("notifications_only");
		
		$("#urlcheckingmode_selector").change(function () {
			$.ajax({
				type: 'GET',
				url: endpoint,
				data: {
		            method: "setUserPreference",
		            screenname: screenname,          
		            this_access_token: this_access_token,  
		            which: "url_checking_mode",
		            value: $("#urlcheckingmode_selector").val() 
		        },
		        dataType: 'json',
		        async: true,
		        success: function (data, status) {
		        	if (data.response_status === "error")
		        	{
		        		$("#urlcheckingmode_result_span").text(data.message);
		        		// on error, reset the selector to the bg.user_jo value
		        		if (bg.user_jo.url_checking_mode === "stealth")
		            		$("#urlcheckingmode_selector").val("stealth");
		        		else if (bg.user_jo.url_checking_mode === "notifications_only")
		            		$("#urlcheckingmode_selector").val("notifications_only");
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
		        		bg.user_jo.url_checking_mode = $("#urlcheckingmode_selector").val();
		        		$("#urlcheckingmode_result_span").text("updated");
		        		bg.doButtonGen();
		        	}
		        	setTimeout(function(){$("#urlcheckingmode_result_span").text("");},3000);
		        }
		        ,
		        error: function (XMLHttpRequest, textStatus, errorThrown) {
		        	$("#urlcheckingmode_result_span").text("ajax error");
		        	setTimeout(function(){$("#urlcheckingmode_result_span").text("");},3000);
		            console.log(textStatus, errorThrown);
		        }
			});
		});
		
		$("#urlcheckingmode_explainer_link").click(function () {
			$("#urlcheckingmode_explainer_tr").show();
			$("#urlcheckingmode_explainer_td").html("<div style=\"padding:5px 0px 5px 0px;\">STEALTH: The current URL is SHA256-hashed and checked aginst Hackbook for possible HN story threads. Hackbook's backend, which keeps a table of hashed URLs for all known HN threads, checks to see if your incoming hash is known and, if so, returns the thread. If not, the (irreversible) hash is meaningless and nothing is returned. In both cases, the hashed URL is discarded immediately."
					+ "<br><br>NOTIFICATIONS ONLY: No URL checking occurs, hashed or otherwise, but this means Hackbook cannot display HN threads in its overlay.</div>");
		});
		
		$("#karma_pool_ttl_input").val(bg.user_jo.karma_pool_ttl_mins);
		$("#karma_pool_ttl_form").submit( function (event) {
			$("#karma_pool_result_span").text("processing...");
			$.ajax({
				type: 'GET',
				url: endpoint,
				data: {
		            method: "setUserPreference",
		            screenname: screenname,          
		            this_access_token: this_access_token,  
		            which: "karma_pool_ttl",
		            value: $("#karma_pool_ttl_input").val() 
		        },
		        dataType: 'json',
		        async: true,
		        success: function (data, status) {
		        	if (data.response_status === "error")
		        	{
		        		$("#karma_pool_result_span").text(data.message);
		        		$("#karma_pool_ttl_input").val("");
		            	if(data.error_code && data.error_code === "0000")
		        		{
		        			displayMessage("Your login has expired. Please relog.", "red");
		        			bg.user_jo = null;
		        			updateLogstat();
		        		}
		        	}
		        	else
		        	{
		        		bg.user_jo.karma_pool_ttl_mins = $("#karma_pool_ttl_input").val()*1;
		        		$("#karma_pool_result_span").text("updated");
		        		bg.getUser(false);
		        	}
		        	setTimeout(function(){$("#karma_pool_result_span").text("");},3000);
		        }
		        ,
		        error: function (XMLHttpRequest, textStatus, errorThrown) {
		        	$("#karma_pool_result_span").text("ajax error");
		        	setTimeout(function(){$("#karma_pool_result_span").text("");},3000);
		            console.log(textStatus, errorThrown);
		        }
			});
			return false;
		});
		
		$("#karma_pool_explainer_link").click(function () {
			$("#karma_pool_explainer_tr").show();
			$("#karma_pool_explainer_td").html("<div style=\"padding:5px 0px 5px 0px;\">To prevent +1/-1 karma spam, Hackbook pools your karma changes together every X minutes.</div>");
		});
		
		if (bg.user_jo.hide_deep_reply_notifications === false)
			$("#hide_deep_reply_notifications_selector").val("show");
		else if (bg.user_jo.hide_deep_reply_notifications === true)
			$("#hide_deep_reply_notifications_selector").val("hide");
		
		$("#hide_deep_reply_notifications_selector").change(function () {
			$.ajax({
				type: 'GET',
				url: endpoint,
				data: {
		            method: "setUserPreference",
		            screenname: screenname,          
		            this_access_token: this_access_token,  
		            which: "hide_deep_reply_notifications",
		            value: $("#hide_deep_reply_notifications_selector").val() 
		        },
		        dataType: 'json',
		        async: true,
		        success: function (data, status) {
		        	if (data.response_status === "error")
		        	{
		        		$("#hide_deep_reply_notifications_result_span").text(data.message);
		        		// on error, reset the selector to the bg.user_jo value
		        		if (bg.user_jo.hide_deep_reply_notifications === false)
		        			$("#hide_deep_reply_notifications_selector").val("show");
		        		else if (bg.user_jo.hide_deep_reply_notifications === true)
		        			$("#hide_deep_reply_notifications_selector").val("hide");
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
		        		if($("#hide_deep_reply_notifications_selector").val() === "show")
		        			bg.user_jo.hide_deep_reply_notifications = false;
		        		else if($("#hide_deep_reply_notifications_selector").val() === "hide")
		        			bg.user_jo.hide_deep_reply_notifications = true;
		        		$("#hide_deep_reply_notifications_result_span").text("Updated.");
		        		bg.getUser(false);
		        	}
		        	setTimeout(function(){$("#hide_deep_reply_notifications_result_span").text("");},3000);
		        }
		        ,
		        error: function (XMLHttpRequest, textStatus, errorThrown) {
		        	$("#hide_deep_reply_notifications_result_span").text("ajax error");
		        	setTimeout(function(){$("#hide_deep_reply_notifications_result_span").text("");},3000);
		            console.log(textStatus, errorThrown);
		        }
			});
		});
		
		if (bg.user_jo.hide_promo_links === false)
			$("#hide_promo_links_selector").val("show");
		else if (bg.user_jo.hide_promo_links === true)
			$("#hide_promo_links_selector").val("hide");
		
		$("#hide_promo_links_selector").change(function () {
			$.ajax({
				type: 'GET',
				url: endpoint,
				data: {
		            method: "setUserPreference",
		            screenname: screenname,          
		            this_access_token: this_access_token,  
		            which: "hide_promo_links",
		            value: $("#hide_promo_links_selector").val() 
		        },
		        dataType: 'json',
		        async: true,
		        success: function (data, status) {
		        	if (data.response_status === "error")
		        	{
		        		$("#hide_promo_links_result_span").text(data.message);
		        		// on error, reset the selector to the bg.user_jo value
		        		if (bg.user_jo.hide_promo_links === false)
		        			$("#hide_promo_links_selector").val("show");
		        		else if (bg.user_jo.hide_promo_links === true)
		        			$("#hide_promo_links_selector").val("hide");
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
		        		if($("#hide_promo_links_selector").val() === "show")
		        			bg.user_jo.hide_promo_links = false;
		        		else if($("#hide_promo_links_selector").val() === "hide")
		        			bg.user_jo.hide_promo_links = true;
		        		$("#hide_promo_links_result_span").text("Updated.");
		        		bg.getUser(false);
		        	}
		        	setTimeout(function(){$("#hide_promo_links_result_span").text("");},3000);
		        }
		        ,
		        error: function (XMLHttpRequest, textStatus, errorThrown) {
		        	$("#hide_promo_links_result_span").text("ajax error");
		        	setTimeout(function(){$("#hide_promo_links_result_span").text("");},3000);
		            console.log(textStatus, errorThrown);
		        }
			});
		});
		
		if(typeof bg.user_jo.following === "undefined" || bg.user_jo.following === null)
		{ 
			// do nothing
		}
		else
		{
			var x = 0;
			while(x < bg.user_jo.following.length)
			{
				$("#unfollow_" + bg.user_jo.following[x] + "_link").mouseover({value:bg.user_jo.following[x]}, function(event) {
					$("#unfollow_" + event.data.value + "_link").text("unfollow");
				});
				$("#unfollow_" + bg.user_jo.following[x] + "_link").mouseout({value:bg.user_jo.following[x]}, function(event) {
					$("#unfollow_" + event.data.value + "_link").text(event.data.value);
				});
				$("#unfollow_" + bg.user_jo.following[x] + "_link").click({value:bg.user_jo.following[x]}, function(event) {
					$("#unfollow_" + event.data.value + "_link").unbind();
					followOrUnfollowUser(event.data.value, "unfollowUser", "unfollow_" + event.data.value + "_link");
					return false;
				});
				x++;
			}	
		}
		
	 	$("#add_follow_link").click(function () {
			$("#add_follow_tr").show();
			return false;
		});
		
		$("#add_follow_go_button").click(function () {
			followOrUnfollowUser($("#add_follow_input").val(), "followUser", "add_follow_result_span");
			return false;
		});

		$("#get_suggestions_link").click(function () {
			chrome.tabs.create({url: chrome.extension.getURL("login_successful.html")});
			return false;
		});
		
		if (bg.user_jo.hide_inline_follow === false)
			$("#hide_inline_follow_selector").val("show");
		else if (bg.user_jo.hide_inline_follow === true)
			$("#hide_inline_follow_selector").val("hide");
		
		$("#hide_inline_follow_selector").change(function () {
			$.ajax({
				type: 'GET',
				url: endpoint,
				data: {
		            method: "setUserPreference",
		            screenname: screenname,          
		            this_access_token: this_access_token,  
		            which: "hide_inline_follow",
		            value: $("#hide_inline_follow_selector").val() 
		        },
		        dataType: 'json',
		        async: true,
		        success: function (data, status) {
		        	if (data.response_status === "error")
		        	{
		        		$("#hide_inline_follow_result_span").text(data.message);
		        		// on error, reset the selector to the bg.user_jo value
		        		if (bg.user_jo.hide_inline_follow === false)
		        			$("#hide_inline_follow_selector").val("show");
		        		else if (bg.user_jo.hide_inline_follow === true)
		        			$("#hide_inline_follow_selector").val("hide");
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
		        		if($("#hide_inline_follow_selector").val() === "show")
		        			bg.user_jo.hide_inline_follow = false;
		        		else if($("#hide_inline_follow_selector").val() === "hide")
		        			bg.user_jo.hide_inline_follow = true;
		        		$("#hide_inline_follow_result_span").text("Updated. Refresh HN pages.");
		        		bg.getUser(false);
		        	}
		        	setTimeout(function(){$("#hide_inline_follow_result_span").text("");},3000);
		        }
		        ,
		        error: function (XMLHttpRequest, textStatus, errorThrown) {
		        	$("#hide_inline_follow_result_span").text("ajax error");
		        	setTimeout(function(){$("#hide_inline_follow_result_span").text("");},3000);
		            console.log(textStatus, errorThrown);
		        }
			});
		});
		
		$("#profile_page_savedstories_link").click( function (event) {	event.preventDefault();
			chrome.tabs.create({url: "https://news.ycombinator.com/saved?id=" + bg.user_jo.screenname});
		});
		
		$("#profile_page_submissions_link").click( function (event) {	event.preventDefault();
		chrome.tabs.create({url: "https://news.ycombinator.com/submitted?id=" + bg.user_jo.screenname});
		});
		
		$("#profile_page_comments_link").click( function (event) {	event.preventDefault();
			chrome.tabs.create({url: "https://news.ycombinator.com/threads?id=" + bg.user_jo.screenname});
		});
	}
}

