var devel = false;
var endpoint = "https://secure.hackbook.club/endpoint";
if(devel === true)
	endpoint = "http://localhost:8080/hackbook-backend-MySQLHibernate/endpoint";

// functions found here must be loaded for the background page and the overlay. 

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function fromOtherBaseToDecimal(base, number ) {
	var baseDigits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	//alert("i "  + base + " and number " + number)
    var iterator = number.length;
    var returnValue = 0;
    var multiplier = 1;
  //  alert("t " + iterator);
    while( iterator > 0 ) {
        returnValue = returnValue + ( baseDigits.indexOf( number.substring( iterator - 1, iterator ) ) * multiplier );
        multiplier = multiplier * base;
        --iterator;
    }
   // alert("z");
    return returnValue;
}

// this is modified to handle our timestamps only. Had to chop off a string of zeros at the front with a hack (length - 7)
function fromDecimalToOtherBase ( base, decimalNumber ) {
	var baseDigits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var tempVal = decimalNumber == 0 ? "0" : "";
    var mod = 0;

    while( decimalNumber != 0 ) {
        mod = decimalNumber % base;
        tempVal = baseDigits.substring( mod, mod + 1 ) + tempVal;
        decimalNumber = decimalNumber / base;
    }
    return tempVal.substring(tempVal.length - 7);
}

function agoIt(inc_ts_in_ms)
{
	if(typeof bg.msfe_according_to_backend === "undefined" || bg.msfe_according_to_backend === null) // should never happen as bg sets msfe_according_to_backend to d.getTime() on load
	{
		var d = new Date();
		bg.msfe_according_to_backend = d.getTime();
	}	
	var millis_ago = bg.msfe_according_to_backend - inc_ts_in_ms;
	if(millis_ago < 0)
		millis_ago = 0;
	var minutes_ago = millis_ago/60000;
	var time_ago = 0;
	var time_ago_units = "";
	if(minutes_ago < 60)
	{
		time_ago = minutes_ago;
		time_ago_units = "mins";
	}
	else if ((minutes_ago > 60) && (minutes_ago < 1440))
	{
		time_ago = minutes_ago / 60;
		time_ago_units = "hrs";
	}
	else
	{	
		time_ago = minutes_ago / 1440;
		time_ago_units = "days";
	}
	return (time_ago.toFixed(0) + " " + time_ago_units + " ago");
}

function hashFnv32a(str, asString, seed) {
    var i, l,
        hval = (seed === undefined) ? 0x811c9dc5 : seed;

    for (i = 0, l = str.length; i < l; i++) {
        hval ^= str.charCodeAt(i);
        hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
    }
    if( asString ){
        // Convert to 8 digit hex string
        return ("0000000" + (hval >>> 0).toString(16)).substr(-8);
    }
    return hval >>> 0;
}

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(string, find, replace) {
	return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function getHost(loc_url)
{
	var parser = document.createElement('a');
	parser.href = loc_url;
	return parser.host;
}

function getStandardizedHostname(inc_url)
{
	var h = getHost(inc_url);
	var count = (h.split(".").length - 1);
	if(count === 1)
		h = "www." + h;
	return h;
}

// do we want to check for double #?
function isValidURLFormation(inc_url)
{
	var validurl = true;
	if (typeof inc_url === "undefined" || inc_url === null || inc_url === "")
	{
		validurl = false;
	}
	else if((inc_url.substring(0,7) !== "http://") && (inc_url.substring(0,8) !== "https://"))
	{
		validurl = false;
	}
	else
	{	
		var host = getHost(inc_url);
		if(host.indexOf(":") != -1)
		{
			validurl = false;
		}	
		else if (host.indexOf(".") == -1)
		{
			validurl = false;
		}
		else
		{
			validurl = true;
		}
	}
	return validurl;
}

function has_scrollbar(elem_id) 
{ 
elem = document.getElementById(elem_id); 
if (elem.clientHeight < elem.scrollHeight) 
return true;
else 
return false;
} 

function drawTabHeader(header_title_html)
{
	$("#utility_table").show();
	var h = "<table style=\"width:100%\">";
	h = h + "	<tr>";
	h = h + "		<td style=\"text-align:left;font-size:14px;font-weight:bold\">" + header_title_html + "</td>";
	if(bg.user_jo && typeof bg.user_jo.hide_promo_links !== "undefined" && bg.user_jo.hide_promo_links !== null && bg.user_jo.hide_promo_links === false)
	{	
		var randomint = Math.floor(Math.random() * 2);
		// on 0, do nothing.
		h = h + "		<td style=\"text-align:right\" id=\"promo_td\">";
		if (randomint === 0)
		{
			h = h + "		<img src=\"images/twitter-bird_32x27.png\" style=\"width:16px;height:14px;vertical-align:middle\"> ";
			h = h + "		<a href=\"#\" id=\"twitter_link\" style=\"color:#828282;font-size:10px;text-decoration:underline\">Share Hackbook on Twitter</a>";
		
		}
		else if (randomint === 1)
		{	
			h = h + "		<img src=\"images/chrome.jpg\" style=\"width:16px;height:16px;vertical-align:middle\"> ";
			h = h + "		<a href=\"#\" id=\"5star_link\" style=\"color:#828282;font-size:10px;text-decoration:underline\">Rate Hackbook &#9733;&#9733;&#9733;&#9733;&#9733;</a>";
		}
		h = h + "		<a href=\"#\" id=\"hide_promos_link\" style=\"color:#A2A2A2;font-style:italic;font-size:9px\">hide</a>";
		h = h + "		</td>";
	}
	h = h + "	</tr>";
	h = h + "</table>";
	
	$("#utility_header_td").html(h);
	
	if(bg.user_jo && typeof bg.user_jo.hide_promo_links !== "undefined" && bg.user_jo.hide_promo_links !== null && bg.user_jo.hide_promo_links === false)
	{	
		$("#twitter_link").click( function (event) {
			chrome.tabs.create({url: "https://twitter.com/intent/tweet?text=Your%20tweet%20text%20goes%20here.&url=https%3A%2F%2Fchrome.google.com%2Fwebstore%2Fdetail%2Fhackbook%2Flogdfcelflpgcbfebibbeajmhpofckjh"});
			return false;
		});
		$("#5star_link").click( function (event) {	
			chrome.tabs.create({url: "https://chrome.google.com/webstore/detail/hackbook/logdfcelflpgcbfebibbeajmhpofckjh/reviews"});
			return false;
		});
		$("#hide_promos_link").click( function (event) {
			$("#promo_td").hide();
			$.ajax({
				type: 'GET',
				url: endpoint,
				data: {method: "setUserPreference", screenname: screenname, this_access_token: this_access_token, which: "hide_promo_links", value: "hide"},
		        dataType: 'json',
		        async: true,
		        success: function (data, status) {
		        	if (data.response_status === "error")
		        	{
		        		displayMessage(data.message, "red", "utility_message_td");
		            	if(data.error_code && data.error_code === "0000")
		        		{
		        			displayMessage("Your login has expired. Please relog.", "red");
		        			bg.user_jo = null;
		        			updateLogstat();
		        		}
		        	}
		        	else if (data.response_status === "success")
		        	{
		        		bg.user_jo.hide_promo_links = true;
		        		bg.getUser(false);
		        	}
		        	else { 
		        		// unknown response_status. This would be bad
		        	}
		        }
		        ,
		        error: function (XMLHttpRequest, textStatus, errorThrown) {
		        	displayMessage("ajax error", "red", "utility_message_td");
		            console.log(textStatus, errorThrown);
		        }
			});
			return false;
		});
	}
	
	$("#utility_message_td").hide();
	$("#utility_csf_td").hide();	
}

function displayMessage(inc_message, inc_color, dom_id, s)
{
	if(typeof dom_id === "undefined" || dom_id === null)
	{
		dom_id = "utility_message_td";
	}
	var ms;
	if(s === null || !$.isNumeric(s) ||  Math.floor(s) != s) // not a number or not an integer 
		ms = 3000;
	else
		ms = s * 1000;
	if (typeof inc_color === "undefined" || inc_color === null)
		inc_color = "red";
	$("#" + dom_id).css("color", inc_color);
	$("#" + dom_id).text(inc_message);
	$("#" + dom_id).show();
	setTimeout(function() { $("#" + dom_id).hide();}, ms);
}

function doNewtabClick(h)
{
// 	try to find h
// 	if(successful)
//			open it
//		else if(unsuccessful)
//			try with newh
//			if(unsuccessful)
//			{
//				open new tab with original url
//			}
//		}
var newh = "";
if(h.indexOf("://www.") != -1)
	 newh = h.replace("://www.", "://");
else
	 newh = h.replace("://", "://www.");

//alert("h=" + h + " and newh=" + newh);
var open_tab_id = null;
chrome.tabs.query({url: h}, function(tabs) { 
	 for (var i = 0; i < tabs.length; i++) { // try to find h
		 open_tab_id = tabs[i].id;
	 }
	 if(open_tab_id !== null) // found it
	 {
		 if(bg.currentId === open_tab_id)
			 displayMessage("That's the current page.", "black");
		 else
			 chrome.tabs.update(open_tab_id,{"active":true}, function(tab) {}); // open the existing tab
	 }
	 else // if(open_tab_id === null)  // didn't find h
	 {
		 chrome.tabs.query({url: newh}, function(tabs) {  // try to find newh
			 for (var i = 0; i < tabs.length; i++) {
				 open_tab_id = tabs[i].id;
			 }
			 if(open_tab_id !== null) // found it
			 {
				 if(bg.currentId === open_tab_id)
					 displayMessage("That's the current page.", "black");
				 else
					 chrome.tabs.update(open_tab_id,{"active":true}, function(tab) {}); // open the existing tab
			 }
			 else // if(open_tab_id === null)
				 chrome.tabs.create({url:h}); // all else fails, open new tab
		 });
	 }
});
}

var hasOwnProperty = Object.prototype.hasOwnProperty;

function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) {
    	//alert("returning isEmpty true (null)")
    	return true;
    }

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0) {
    	//alert("returning isEmpty false (length greater than 0 )")
    	return false;
    }
    if (obj.length === 0){
    	//alert("returning isEmpty true (length)")
    	return true;
    }

    // Otherwise, does it have any properties of its own?
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)){
        	//alert("returning isEmpty hasownproperty")
        	return false;
        }
    }
    //alert("returning isEmpty true default")
    return true;
}

function resetNotificationCount() // error message always goes to utility_message_td
{
	$.ajax({
        type: 'GET',
        url: endpoint,
        data: {
            method: "resetNotificationCount",
            screenname: screenname,           
            this_access_token: this_access_token  
        },
        dataType: 'json',
        async: true,
        success: function (data, status) {

            if (data.response_status === "error") 
            {
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
            	bg.user_jo.notification_count = 0;
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        	displayMessage("Ajax error for resetNotificationCount method.", "red", "utility_message_td");
            console.log(textStatus, errorThrown);
        } 
	});
}

function resetNewsfeedCount() // error message always goes to utility_message_td
{
	$.ajax({
        type: 'GET',
        url: endpoint,
        data: {
            method: "resetNewsfeedCount",
            screenname: screenname,           
            this_access_token: this_access_token  
        },
        dataType: 'json',
        async: true,
        success: function (data, status) {

            if (data.response_status === "error") 
            {
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
            	bg.user_jo.newsfeed_count = 0;
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        	displayMessage("Ajax error for resetNewsfeedCount method.", "red", "utility_message_td");
            console.log(textStatus, errorThrown);
        } 
	});
}

function followOrUnfollowUser(target_screenname, method, msg_dom_id) // which = "followUser" or "unfollowUser"
{
	$("[id=" + msg_dom_id + "]").text("processing...");
	$.ajax({
	    type: 'GET',
	    url: endpoint,
	    data: {
	        method: method,
	        target_screenname: target_screenname,
	        screenname: screenname,  
            this_access_token: this_access_token
	    },
	    dataType: 'json',
	    async: true,
	    success: function (data, status) {
	        if (data.response_status == "error") 
	        {
            	if(data.error_code && data.error_code === "0000")
        		{
        			bg.user_jo = null;
        			updateLogstat();
        			$("[id=" + msg_dom_id + "]").text("login expired");
        		}
            	else
            	{
            		$("[id=" + msg_dom_id + "]").text(data.message);
            		if(tabmode === "profile")
            		{
            			setTimeout(function() {
            				$("[id=" + msg_dom_id + "]").text("");
            			},1500);
            		}
            	}
	        }
	        else if (data.response_status === "success")
	        {
	        	bg.getUser(false);
	        	if(tabmode === "profile")
	        	{
	        		setTimeout(function() {
	        			viewProfile();
	        		}, 1500);
	        		
	        	}
	        	else // thread, feed, notifications
	        	{
	        		$("[id=" + msg_dom_id + "]").unbind();
	        		if(method === "unfollowUser")
	        		{
	        			$("[id=" + msg_dom_id + "]").text("follow");
		        		$("[id=" + msg_dom_id + "]").click({target_screenname: target_screenname}, function(event) { 
		        			event.stopImmediatePropagation();
		        			followOrUnfollowUser(event.data.target_screenname, "followUser", msg_dom_id);
			    			return false;
			    		});
	        		}	
	        		else if(method === "followUser")
	        		{	
	        			$("[id=" + msg_dom_id + "]").text("unfollow");
		        		$("[id=" + msg_dom_id + "]").click({target_screenname: target_screenname}, function(event) { 
		        			event.stopImmediatePropagation();
		        			followOrUnfollowUser(event.data.target_screenname, "unfollowUser", msg_dom_id);
			    			return false;
			    		});
	        		}
	        	}
	        }
	    },
	    error: function (XMLHttpRequest, textStatus, errorThrown) {
	    	$("[id=" + msg_dom_id + "]").text("AJAX error");
	        console.log(textStatus, errorThrown);
	    }
	});
	
}
function makeid(limit)
{
	if(typeof limit === "undefined" || limit === null)
		limit = 32;
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < limit; i++ )
    	text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}