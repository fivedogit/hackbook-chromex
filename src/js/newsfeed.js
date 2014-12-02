function doNewsfeedTab()
{
	tabmode = "newsfeed";
	$("#utility_table").show();
	var h = "<table style=\"width:100%\">";
	h = h + "	<tr>";
	h = h + "		<td style=\"text-align:left;font-size:14px;font-weight:bold\">News feed</td>";
	if(bg.user_jo && typeof bg.user_jo.hide_promo_links !== "undefined" && bg.user_jo.hide_promo_links !== null && bg.user_jo.hide_promo_links === false)
	{	
		var randomint = Math.floor(Math.random() * 3);
		// on 0, do nothing.
		if (randomint === 1)
			h = h + "		<td style=\"text-align:right\"><img src=\"images/twitter-bird_32x27.png\" style=\"width:16px;height:14px;vertical-align:middle\"> <a href=\"#\" id=\"twitter_link\" style=\"color:#828282;font-size:10px;text-decoration:underline\">Share Hackbook on Twitter</a></td>";
		else if (randomint === 2)
			h = h + "		<td style=\"text-align:right\"><img src=\"images/chrome.jpg\" style=\"width:16px;height:16px;vertical-align:middle\"> <a href=\"#\" id=\"5star_link\" style=\"color:#828282;font-size:10px;text-decoration:underline\">Rate Hackbook &#9733;&#9733;&#9733;&#9733;&#9733;</a></td>";
	}
	h = h + "	</tr>";
	h = h + "</table>";
	
	$("#utility_header_td").html(h);
	
	if(bg.user_jo && typeof bg.user_jo.hide_promo_links !== "undefined" && bg.user_jo.hide_promo_links !== null && bg.user_jo.hide_promo_links === false)
	{	
		$("#twitter_link").click( function (event) {	event.preventDefault();
			chrome.tabs.create({url: "https://twitter.com/intent/tweet?text=Your%20tweet%20text%20goes%20here.&url=https%3A%2F%2Fchrome.google.com%2Fwebstore%2Fdetail%2Fhackbook%2Flogdfcelflpgcbfebibbeajmhpofckjh"});
		});
		$("#5star_link").click( function (event) {	event.preventDefault();
			chrome.tabs.create({url: "https://chrome.google.com/webstore/detail/hackbook/logdfcelflpgcbfebibbeajmhpofckjh/reviews"});
		});
	}
	
	$("#utility_message_td").hide();
	$("#utility_csf_td").hide();

	if(currentHostname === "news.ycombinator.com")
		$("#thread_tab_link").text("chat");
	else
		$("#thread_tab_link").text("thread");
	$("#thread_tab_link").css("font-weight", "normal");
	$("#newsfeed_tab_link").css("font-weight", "bold");
	$("#notifications_tab_link").css("font-weight", "normal");
	$("#profile_link").css("font-weight", "normal");
	
	$("#main_div").html("");//OK
	
	if(typeof bg.user_jo !== "undefined" && bg.user_jo !== null)
	{
		$("#notification_count_span").text(bg.user_jo.notification_count);
		$("#newsfeed_count_span").text(bg.user_jo.newsfeed_count);
		// count resets happen in getNotifications so the display can do the yellow background thing
	}
	getNotifications("newsfeed");
	
}


