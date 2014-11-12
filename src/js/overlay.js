var bg = chrome.extension.getBackgroundPage();
var currentURL;
var currentHostname;
var scrollable = 0;
var beginindex;
var endindex;
var screenname;
var this_access_token;
var tabmode = "thread";

$(window).scroll(function() {
	if ($(window).scrollTop() + $(window).height() === $(document).height()) {
		if (scrollable === 1)
		{
			scrollable = 0;
			beginindex = beginindex + 5; 
			endindex = endindex + 5;
			if(tabmode === "thread")
				prepareGetAndPopulateThreadPortion();
			//else if(tabmode === "past") // FIXME
			//	getPastComments();
		}
	}
});

//when the overlay's html page has loaded, do this
document.addEventListener('DOMContentLoaded', function () {
	 chrome.tabs.getSelected(null, function(tab) {
		 currentURL = tab.url;
		 doOverlay();
	 });
});

function doOverlay()
{
	 currentHostname = currentURL.substring(currentURL.indexOf("://") + 3, currentURL.indexOf("/", currentURL.indexOf("://") + 3));
	 if (currentHostname.indexOf(".", currentHostname.indexOf(".")+1) === -1) // only has one "." assume www.
		 currentHostname = "www." + currentHostname;
	 initializeView();
	 screenname = bg.docCookies.getItem("screenname");
	 this_access_token = bg.docCookies.getItem("this_access_token");
	 if((typeof bg.user_jo !== "undefined" && bg.user_jo !== null && typeof bg.user_jo.notification_count !== "undefined" && bg.user_jo.notification_count !== null && bg.user_jo.notification_count > 0))
		 doNotificationsTab();
	 else if(bg.t_jo !== null && !isEmpty(bg.t_jo)) // if there's something
		 doThreadTab();
	 else
		 doNewsfeedTab();
}