function doNewsfeedTab()
{
	tabmode = "newsfeed";
	$("#utility_table").show();
	var h = "<table style=\"width:100%\">";
	h = h + "	<tr>";
	h = h + "		<td style=\"text-align:left\">News feed</td>";
	h = h + "		<td style=\"text-align:right\"><a href=\"#\" id=\"5star_link\" style=\"color:#828282;font-size:10px;text-decoration:underline\">Rate Hackbook &#9733;&#9733;&#9733;&#9733;&#9733;</a></td>";
	h = h + "	</tr>";
	h = h + "</table>";
	
	$("#utility_header_td").html(h);
	$("#5star_link").click( function (event) {	event.preventDefault();
		chrome.tabs.create({url: "https://chrome.google.com/webstore/detail/hackbook/logdfcelflpgcbfebibbeajmhpofckjh/reviews"});
	});
	
	$("#utility_message_td").hide();
	$("#utility_csf_td").hide();

	$("#thread_tab_link").css("font-weight", "normal");
	$("#newsfeed_tab_link").css("font-weight", "bold");
	$("#notifications_tab_link").css("font-weight", "normal");
	$("#profile_link").css("font-weight", "normal");
	
	$("#main_div").html("");//OK
	getNotifications("newsfeed");
}


