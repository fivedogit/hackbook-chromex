 chrome.runtime.sendMessage({method: "getHideEmbeddedCounts"}, function(response) {
	 if(response.hide_embedded_counts === false)
	 {	 
		 var elements_of_pagetop_class = $(".pagetop");
		 if(elements_of_pagetop_class.length && elements_of_pagetop_class.length > 0)
		 {
		 	var prev = $(elements_of_pagetop_class[0]).html();
		 	var newhtml = prev + " | <a href=\"#\" id=\"feed_link\">feed</a> (<span id=\"nfs\">-</span>) | <a href=\"#\" id=\"notification_link\">notif.</a> (<span id=\"nos\">-</span>) ";
		 	newhtml = newhtml + "<span id=\"use_button_span\" style=\"padding-left:5px;display:none\">Use <img style=\"width:16px;height:16px;vertical-align:middle\" src=\"" + chrome.extension.getURL("images/h_button_1notification_19.png") + "\"></span>";
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
		 	
		 	 chrome.runtime.sendMessage({method: "getCounts"}, function(e) {
		 		 $("#nos").text(e.no);
		 		 $("#nfs").text(e.nf);
		 		
		 		// this line checks for feed number updates every 5 seconds, stopping after 10 minutes
		 		 setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},
		 				 function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(
		 						 function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},
		 								 function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(
		 										 function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},
		 												 function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(
		 														 function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},
		 																 function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);
		 																 setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){chrome.runtime.sendMessage({method:"getCounts"},function(e){$("#nos").text(e.no);$("#nfs").text(e.nf);setTimeout(function(){$("#nos").text("-");$("#nfs").text("-");}
		 		 ,5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)})},5e3)
		 	});
		 }			
	 }
});
	