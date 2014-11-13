
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
		$("#utility_header_td").html("Profile <a href=\"#\" id=\"view_profile_on_hn_link\" style=\"font-size:10px;color:#828282\">(view on HN)</a>");
		$("#view_profile_on_hn_link").click(function(){
			chrome.tabs.create({url:"https://news.ycombinator.com/user?id=" + bg.user_jo.screenname});
		});
	}
	else
		$("#utility_header_td").html("Profile");
	$("#utility_message_td").hide();
	$("#utility_csf_td").hide();
	
	$("#thread_tab_link").css("font-weight", "normal");
	$("#newsfeed_tab_link").css("font-weight", "normal");
	$("#notifications_tab_link").css("font-weight", "normal");
	$("#profile_link").css("font-weight", "bold");
	
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
    	main_div_string = main_div_string + "		<table style=\"width:auto;border-collapse:separate;border-spacing:4px\">";
    	main_div_string = main_div_string + "			<tr><td style=\"text-align:left;color:#828282\">user:</td><td style=\"text-align:left\"><span id=\"profile_page_screenname_span\"></span></td><td></td></tr>";
    	main_div_string = main_div_string + "			<tr><td style=\"text-align:left;color:#828282\">karma:</td><td style=\"text-align:left\" id=\"profile_page_karma_td\"></td><td></td></tr>";
    	main_div_string = main_div_string + "			<tr><td style=\"text-align:left;color:#828282;width:25%\">notification mode: </td>";
		main_div_string = main_div_string + "				<td colspan=2 style=\"text-align:left\">";
		main_div_string = main_div_string + "				<select id=\"notificationmode_selector\">";
		main_div_string = main_div_string + "					<option value=\"notifications_only\">notifications only</option>";
		main_div_string = main_div_string + "					<option SELECTED value=\"newsfeed_and_notifications\">newsfeed and notifications</option>";
		main_div_string = main_div_string + "				</select> ";
		main_div_string = main_div_string + "				<a href=\"#\" id=\"notificationmode_explainer_link\">?</a> <span id=\"notificationmode_result_td\"></span>";
		main_div_string = main_div_string + "				</td>";
		main_div_string = main_div_string + "			</tr>";
		main_div_string = main_div_string + "			<tr><td></td><td colspan=2 style=\"text-align:left;color:black;font-size:11px\" id=\"notificationmode_explainer_td\"></td>";
    	main_div_string = main_div_string + "			<tr><td style=\"text-align:left;color:#828282;width:25%\">url checking mode: </td>";
		main_div_string = main_div_string + "				<td style=\"text-align:left\">";
		main_div_string = main_div_string + "					<select id=\"urlcheckingmode_selector\">";
		main_div_string = main_div_string + "						<option value=\"active\">active</option>";
		main_div_string = main_div_string + "						<option SELECTED value=\"stealth\">stealth</option>";
		main_div_string = main_div_string + "						<option value=\"notifications_only\">notifications only</option>";
		main_div_string = main_div_string + "					</select> ";
		main_div_string = main_div_string + "					<a href=\"#\" id=\"urlcheckingmode_explainer_link\">?</a> <span id=\"urlcheckingmode_result_span\"></span>";
		main_div_string = main_div_string + "				</td>";
		main_div_string = main_div_string + "			</tr>";
		main_div_string = main_div_string + "			<tr><td></td><td colspan=2 style=\"text-align:left;color:black;font-size:11px\" id=\"urlcheckingmode_explainer_td\"></td>";
		main_div_string = main_div_string + "			<tr><td style=\"text-align:left;color:#828282;width:25%\">following: <span style=\"font-size:8pt\">(<a href=\"#\" id=\"add_follower_link\" style=\"color:#828282\">add</a>)</span></td>";
		main_div_string = main_div_string + "				<td colspan=2 style=\"text-align:left;font-size:11px\">";
		if(typeof bg.user_jo.following === "undefined" || bg.user_jo.following === null || isEmpty(bg.user_jo.following))
			main_div_string = main_div_string + "<i>none</i>";
		else
		{
			var x = 0;
			while(x < bg.user_jo.following.length - 1)
			{
				main_div_string = main_div_string + "<a href=\"#\" id=\"unfollow_" + bg.user_jo.following[x] + "_link\">" + bg.user_jo.following[x] + "</a>, ";
				x++;
			}	
			main_div_string = main_div_string + "<a href=\"#\" id=\"unfollow_" + bg.user_jo.following[x] + "_link\">" + bg.user_jo.following[x] + "</a>";
		}
		main_div_string = main_div_string + "							</td>";
		main_div_string = main_div_string + "						</tr>";
		main_div_string = main_div_string + "						<tr id=\"add_follower_tr\" style=\"display:none\">";
		main_div_string = main_div_string + "							<td style=\"text-align:left;color:#828282;width:25%\">add follower: </td>";
		main_div_string = main_div_string + "							<td colspan=2 style=\"text-align:left;color:#828282;\"><input type=text style=\"width:150px\" id=\"add_follower_input\"> <input id=\"add_follower_go_button\" type=\"button\" value=\"add\"> <span id=\"add_follower_result_span\"></span></td>";
		//main_div_string = main_div_string + "							<td style=\"text-align:left;color:#828282;font-size:8pt\" id=\"add_follower_result_td\"></td>";
		main_div_string = main_div_string + "						</tr>";
		main_div_string = main_div_string + "						<tr><td style=\"text-align:left;color:#828282\">followers: </td>";
		main_div_string = main_div_string + "							<td colspan=2 style=\"text-align:left;font-size:11px\">";
		if(typeof bg.user_jo.followers === "undefined" || bg.user_jo.followers === null || isEmpty(bg.user_jo.followers))
			main_div_string = main_div_string + "<i>none</i>";
		else
		{
			var x = 0;
			while(x < bg.user_jo.followers.length - 1)
			{
				main_div_string = main_div_string + bg.user_jo.followers[x] + ", ";
				x++;
			}	
			main_div_string = main_div_string + bg.user_jo.followers[x];
		}
		main_div_string = main_div_string + "							</td>";
		main_div_string = main_div_string + "						</tr>";
		main_div_string = main_div_string + "						</tr>";
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
		$("#profile_page_since_td").html(agoIt(bg.user_jo.since) + " <img src=\"" + chrome.extension.getURL("images/l18.png") + "\" style=\"border:1px solid white;height:14px;width:14px;vertical-align:middle\"> ");
		$("#profile_page_karma_td").html(bg.user_jo.hn_karma);
		
		$("#profile_page_savedstories_link").click( function (event) {	event.preventDefault();
			chrome.tabs.create({url: "https://news.ycombinator.com/saved?id=" + bg.user_jo.screenname});
		});
		
		$("#profile_page_submissions_link").click( function (event) {	event.preventDefault();
		chrome.tabs.create({url: "https://news.ycombinator.com/submitted?id=" + bg.user_jo.screenname});
		});
		
		$("#profile_page_comments_link").click( function (event) {	event.preventDefault();
			chrome.tabs.create({url: "https://news.ycombinator.com/threads?id=" + bg.user_jo.screenname});
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
					$("#unfollow_" + event.data.value + "_link").text("processing...");
					followOrUnfollowUser(event.data.value, "unfollowUser");
					return false;
				});
				x++;
			}	
		}
			
	    	
		
	 	$("#add_follower_link").click(function () {
			$("#add_follower_tr").show();
			return false;
		});
		
		$("#add_follower_go_button").click(function () {
			followOrUnfollowUser($("#add_follower_input").val(), "followUser");
			$("#add_follower_result_span").text("Processing...");
			return false;
		});

		if (bg.user_jo.notification_mode === "newsfeed_and_notifications")
			$("#notificationmode_selector").val("newsfeed_and_notifications");
		else if (bg.user_jo.notification_mode === "notifications_only")
			$("#notificationmode_selector").val("notifications_only");
		
		if (bg.user_jo.url_checking_mode === "active")
			$("#urlcheckingmode_selector").val("active");
		else if (bg.user_jo.url_checking_mode === "stealth")
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
		        		else if (bg.user_jo.url_checking_mode === "active")
		            		$("#urlcheckingmode_selector").val("active");
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
			$("#notificationmode_explainer_td").html("<div style=\"padding:5px 0px 5px 0px;\">When do you want the button to indicate new activity? Only when you have new notifications (for your stuff) or also when you have new news feed items (i.e. when those you're following do stuff)?</div>");
		});
		
		$("#urlcheckingmode_explainer_link").click(function () {
			$("#urlcheckingmode_explainer_td").html("<div style=\"padding:5px 0px 5px 0px;\">ACTIVE: URLs are checked against the Hackbook backend to find HN story items, then HN's Algolia search engine if not found. Hackbook <em>never</em> stores URLs. Lookups against Algolia are anonymized through Hackbook." +
					"<br><br>STEALTH: URLs are checked only against the Hackbook backend, never stored and never sent to Algolia. This is sufficient almost all of the time." +
					"<br><br>NOTIFICATIONS ONLY: URLs never leave your computer.</div>");
		});
	}
}

