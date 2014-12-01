//INITIALIZE THE BASE HTML FOR THE WORDS VIEW along with all of its event triggers (mouseover + mouseout + click for each tab button + comment form events focus, blur, submit and keyup (charcount))
 function initializeView()
 {
	 var bs = ""; // body string to be inserted into hackbook_div  (which resides just inside <body>. Why not just use <body>? So this can be used as page injection. Can't override existing body there.
	 bs = bs + "<center>";
	 bs = bs + "<table style=\"background-color:#f6f6ef;width:600px;padding:6px;border:0px solid black;border-spacing:0px\">";
	 bs = bs + "	<tr>";
	 bs = bs + "		<td id=\"header_td\" bgcolor=\"#" + bg.hn_topcolor + "\">";
	 bs = bs + "			<table style=\"padding:2px\">";
	 bs = bs + "				<tr>";
	 bs = bs + "					<td style=\"width:18px;padding-right:4px;\">";
	 bs = bs + "						<img id=\"brand_logo\" src=\"" + chrome.extension.getURL("images/h_19.png") + "\" width=\"19\" height=\"19\" style=\"border:1px #ffffff solid;vertical-align:middle\"></img>";
	 bs = bs + "					</td>";
	 bs = bs + "					<td style=\"line-height:12pt; height:10px;\">";
	 bs = bs + "							<a id=\"brand_link\" href=\"#\" style=\"font-weight:bold\">Hackbook</a><img src=\"" + chrome.extension.getURL("images/s.gif") + "\" height=\"1\" width=\"10\">";
	 bs = bs + "							<a href=\"#\" id=\"thread_tab_link\">thread</a>";
	 bs = bs + " | ";
	 bs = bs + "							<a href=\"#\" id=\"newsfeed_tab_link\">feed</a> (<span id=\"newsfeed_count_span\">0</span>)";
	 bs = bs + " | ";
	 bs = bs + "							<a href=\"#\" id=\"notifications_tab_link\">notifications</a> (<span id=\"notification_count_span\">0</span>)";
	 bs = bs + "					</td>";
	 bs = bs + "					<td id=\"logstat_td\" style=\"text-align:right;padding-right:4px;line-height:12pt; height:10px;\">"; // this will be populated by updateLogstat()
	 bs = bs + "					</td>";
	 bs = bs + "				</tr>";
	 bs = bs + "			</table>";
	 bs = bs + "			<table id=\"utility_table\" style=\"width:100%;background-color:white\">";
	 bs = bs + "					<tr><td id=\"utility_header_td\" class=\"title\" style=\"padding:8px 0px 8px 0px;\"></td></tr>"; 
	 bs = bs + "					<tr><td id=\"utility_message_td\" style=\"text-align:left;padding:0px 0px 8px 0px;display:none\"></td></tr>";
	 bs = bs + "					<tr><td id=\"utility_csf_td\" style=\"padding:0px 0px 8px 0px;vertical-align:middle;\">";
	 // it feels like this shouldn't be here.
	 bs = bs + "						<input style=\"margin-top:8px\" type=\"button\" id=\"add_comment_button\" type=button value=\"add comment\"></input>";
	 bs = bs + "					</td></tr>"; // csf = comment submission form
	 bs = bs + "			</table>";
	 bs = bs + "			<div id=\"main_div\" style=\"width:100%;background-color:white\"><div style=\"padding:20px;\"></div></div>";
	 bs = bs + "			<div id=\"beforefooter_div\" style=\"background-color:#" + bg.hn_topcolor + ";height:3px;\"></div>";
	 bs = bs + "			<div id=\"footer_div\" style=\"background-color:white;height:15px;font-size:11px;text-align:center;padding:10px 0px 3px 0px;color:#828282;font-style:italic\">";
	 var new_version_avail = false;
	 if(typeof bg.latest_ext_version !== "undefined" && bg.latest_ext_version !== null)
	 {
		 if(chrome.runtime.getManifest().version*1 < bg.latest_ext_version*1)
			 new_version_avail = true;
	 }	 
	 if(new_version_avail)
		 bs = bs + "Version " + chrome.runtime.getManifest().version + ". <span style=\"background-color:#" + bg.hn_topcolor + ";color:black;border-radius: 3px;padding:1px 3px 1px 3px\">New version " + bg.latest_ext_version + " available.</span> <a href=\"#\" id=\"extensions_link\" style=\"color:#828282;text-decoration:underline\">Extensions</a> -> enable dev mode -> update ext now.";
	 else
		 bs = bs + "Version " + chrome.runtime.getManifest().version + ". Please send bug reports, feature requests and feedback to c@mailcyr.us.";
	 bs = bs + "			</div>";
	 bs = bs + "		</td>";
	 bs = bs + "	</tr>";
	 bs = bs + "</table>";
	 bs = bs + "</center>";
	 $("#hackbook_div").html(bs);//OK

 	$("#brand_logo").click( function (event) {
 		chrome.tabs.create({url: "https://news.ycombinator.com/"});
 		return false;
 	});

	$("#brand_link").click( function (event) {
		chrome.tabs.create({url: "https://news.ycombinator.com/"});
		return false;
	});
 	
 	$("#thread_tab_link").click( function (event) {
 		doThreadTab();
 		return false;
 	});
 	
	$("#newsfeed_tab_link").click( function (event) {
		doNewsfeedTab();
		return false;
	});
 	
 	$("#notifications_tab_link").click( function (event) {
 		doNotificationsTab();
 		return false;
 	});

 	// it feels like this shouldn't be here.
	$("#add_comment_button").click(function(event){
		chrome.tabs.create({url: "https://news.ycombinator.com/item?id=" + bg.t_jo.id });
		return false;
	});
	 
	if(new_version_avail)
	{
		$("#extensions_link").click( function (event) {
			chrome.tabs.create({url: "chrome://extensions/"});
			return false;
		}); 
	}	 
	
 	updateLogstat();
 }

// This is the first function run when this overlay is activated by the button.
// It is possible that the user object has not been retrieved yet, in which case, this will show a logged out state.
// Three reasons this should never happen:
// 1. In theory, the service should be fast enough to always have loaded before the user could even be capable of clicking the button
// 2. In practice, hardly anyone is going to click the activation button instantly when they visit a new page
// 3. After the first bg.bg.user_jo load, bg.bg.user_jo will be refreshed each time. Only deleted if logged out.

function updateLogstat()
{
	if (bg.user_jo !== null)
	{
		var hstr = "";
		hstr = hstr + "<a href=\"#\" id=\"profile_link\">" + bg.user_jo.screenname + "</a> ";
		hstr = hstr + "(" + bg.user_jo.hn_karma + ") <a href=\"#\" id=\"gear_link\"><img style=\"width:16px;height:16px;vertical-align:middle\" src=\"images/gear_64.png\"></a>";// <a href=\"#\" id=\"gear_link\">&#9881;</a>";
		$("#logstat_td").html(hstr); //OK
		$("#profile_link").click( function () { 
			viewProfile();
			return false;
		});
		
		$("#gear_link").click( function () { 
			viewProfile();
			return false;
		});
		
		$("#notification_count_span").text(bg.user_jo.notification_count);
		$("#newsfeed_count_span").text(bg.user_jo.newsfeed_count);
	}
	else
	{
		$("#logstat_td").html("<a href=\"#\" id=\"login_link\">login</a>"); //OK
		$("#login_link").click( function (event) {	event.preventDefault();
			bg.hn_login_step = 0.5;
			bg.hn_existing_about = "";
			chrome.tabs.create({url: "https://news.ycombinator.com/login"});
		});
	}
}


