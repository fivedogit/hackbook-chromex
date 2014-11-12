var elements_of_pagetop_class = $(".pagetop");
if(elements_of_pagetop_class.length && elements_of_pagetop_class.length > 0)
{
	var prev = $(elements_of_pagetop_class[0]).html();
	var newhtml = prev + " | <a href=\"#\" id=\"feed_link\">feed</a> | <a href=\"#\" id=\"notification_link\">notifications</a> (<span id=\"notification_count_span\">-</span>) ";
	newhtml = newhtml + "<span id=\"use_button_span\" style=\"padding-left:10px;display:none\">Use <img style=\"vertical-align:middle\" src=\"" + chrome.extension.getURL("images/hn2go_button_19_gray.png") + "\"></span>";
	$(elements_of_pagetop_class[0]).html(newhtml);
	$("#feed_link").click(function(){
		$("#use_button_span").show();
		setTimeout(function() { $("#use_button_span").hide(); }, 2000);
		return false;
	});
	$("#notification_link").click(function(){
		$("#use_button_span").show();
		setTimeout(function() { $("#use_button_span").hide(); }, 2000);
		return false;
	});
	chrome.runtime.sendMessage({method: "getNotificationCount"}, function(response) { 
		if(typeof response.notification_count !== "undefined" && response.notification_count !== null)
		{
			$("#notification_count_span").text(response.notification_count);
		}	
	});
}			

