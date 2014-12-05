function doNewsfeedTab()
{
	tabmode = "newsfeed";
	drawTabHeader("News feed");
	
	$("#chat_tab_link").css("font-weight", "normal");
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


