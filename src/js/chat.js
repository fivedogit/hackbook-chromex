function doChatTab()
{
	tabmode = "chat";
	drawTabHeader("General chat<div style=\"color:#828282;font-style:italic;font-size:12px;font-weight:normal\">(Available while on news.ycombinator.com pages.)</div>");

	$("#chat_tab_link").css("font-weight", "bold");
	$("#thread_tab_link").css("font-weight", "normal");
	$("#newsfeed_tab_link").css("font-weight", "normal");
	$("#notifications_tab_link").css("font-weight", "normal");
	$("#profile_link").css("font-weight", "normal");
	
	if(typeof bg.user_jo !== "undefined" && bg.user_jo !== null)
	{
		$("#notification_count_span").text(bg.user_jo.notification_count);
		$("#newsfeed_count_span").text(bg.user_jo.newsfeed_count);
		// count resets happen in getNotifications so the display can do the yellow background thing
	}
	
	if(currentHostname !== "news.ycombinator.com")
	{
		$("#utility_table").hide();
		$("#main_div").html("<div style=\"padding:40px;text-align:center;\">Chat is only available while on <a href=\"#\" id=\"hn_chat_link\" style=\"text-decoration:underline\">news.ycombinator.com</a>.</div>");
		$("#hn_chat_link").click(function(event){
			chrome.tabs.create({url: "https://news.ycombinator.com"});
			return false;
		});
	}	
	else
	{
		if(bg.user_jo)
		{	
			h = "";
			h = h + "<div style=\"background-color:white;padding:0px 10px 0px 10px\">"; // padding
			h = h + "		<textarea id=\"chat_textarea\" style=\"font-family:Verdana, Geneva, sans-serif;vertical-align:bottom;background-color:black;color:#" + bg.hn_topcolor + ";border:2px solid #828282;height:300px;width:580px;resize:none\">Loading chat...</textarea>";
			h = h + "</div>";
			h = h + "<div style=\"background-color:white;padding:0px 10px 10px 10px\">";
			h = h + "	<div style=\"border-right:2px solid #828282;border-bottom:2px solid #828282;border-left:2px solid #828282;background-color:black\">";
			h = h + "		<table style=\"width:100%;border-collapse:collapse;\">";
			h = h + "			<tr>";
			h = h + "				<td style=\"background-color:black;color:#" + bg.hn_topcolor + ";width:10px;padding:2px 5px 2px 3px\">" + bg.user_jo.screenname + "></td>";
			h = h + "				<td><form id=\"chat_form\" method=\"GET\" action=\"#\" name=\"chatform\"><input type=text id=\"chat_input\" style=\"font-family:Verdana, Geneva, sans-serif;background-color:black;color:#" + bg.hn_topcolor + ";border:0px solid #828282;width:100%\"></form></td>";
			h = h + "			</tr>";
			h = h + "		</table>";
			h = h + " 	</div>";
			h = h + "</div>";
			h = h + "<div id=\"chat_error_div\" style=\"background-color:white;color:red;padding:0px 10px 0px 10px\"></div>";
			h = h + "<div style=\"background-color:white;color:black;padding:10px 10px 20px 10px;font-style:italic;color:#828282\">Tip: You can \"@username\" mention other Hackbook users to get their attention.</div>";
			$("#main_div").html(h);
			$("#chat_form").submit(function () {
				submitChatMessage($("#chat_input").val());
				return false;
			});
			$("#chat_input").focus();
			getChat();
		}
		else
		{
			$("#main_div").html("<div style=\"padding:20px\">Log in to view the chat box.</div>"); //OK
		}
	}
}

function getChat()
{
	$.ajax({
		type: 'GET',
		url: endpoint,
		data: {
            method: "getChat",
            screenname: screenname,          
            this_access_token: this_access_token
        },
        dataType: 'json',
        async: true,
        success: function (data, status) {
        	if (data.response_status === "error")
        	{
        		if(data.error_code && data.error_code === "0000")
        		{
        			displayMessage("Your login has expired. Please relog.", "red");
        			bg.user_jo = null;
        			updateLogstat();
        		}
        	}
        	else
        	{
        		if(typeof data.chat_ja !== "undefined" && data.chat_ja !== null)
        			displayChat(data.chat_ja);
        	}
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        } 
	})
	.then(function() {
		setTimeout(function(){getChat()},3000);
	});
}

// Courtesy of user Phrogz on StackOverflow --> http://stackoverflow.com/questions/4673527/converting-milliseconds-to-a-date-jquery-js
Date.prototype.customFormat = function(formatString){
    var YYYY,YY,MMMM,MMM,MM,M,DDDD,DDD,DD,D,hhh,hh,h,mm,m,ss,s,ampm,AMPM,dMod,th;
    var dateObject = this;
    YY = ((YYYY=dateObject.getFullYear())+"").slice(-2);
    MM = (M=dateObject.getMonth()+1)<10?('0'+M):M;
    MMM = (MMMM=["January","February","March","April","May","June","July","August","September","October","November","December"][M-1]).substring(0,3);
    DD = (D=dateObject.getDate())<10?('0'+D):D;
    DDD = (DDDD=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][dateObject.getDay()]).substring(0,3);
    th=(D>=10&&D<=20)?'th':((dMod=D%10)==1)?'st':(dMod==2)?'nd':(dMod==3)?'rd':'th';
    formatString = formatString.replace("#YYYY#",YYYY).replace("#YY#",YY).replace("#MMMM#",MMMM).replace("#MMM#",MMM).replace("#MM#",MM).replace("#M#",M).replace("#DDDD#",DDDD).replace("#DDD#",DDD).replace("#DD#",DD).replace("#D#",D).replace("#th#",th);

    h=(hhh=dateObject.getHours());
    if (h==0) h=24;
    if (h>12) h-=12;
    hh = h<10?('0'+h):h;
    AMPM=(ampm=hhh<12?'am':'pm').toUpperCase();
    mm=(m=dateObject.getMinutes())<10?('0'+m):m;
    ss=(s=dateObject.getSeconds())<10?('0'+s):s;
    return formatString.replace("#hhh#",hhh).replace("#hh#",hh).replace("#h#",h).replace("#mm#",mm).replace("#m#",m).replace("#ss#",ss).replace("#s#",s).replace("#ampm#",ampm).replace("#AMPM#",AMPM);
}

function displayChat(chat_ja)
{
	var h = "";
	var x = 0;
	
	chat_ja.sort(function(a,b){
		a = a.msfe;
		b = b.msfe;
		return a - b;
	});
	
	while(x < chat_ja.length)
	{
		var date = new Date(chat_ja[x].msfe);
		if(x < chat_ja.length - 1)
			h = h + date.customFormat( "#MM#-#DD# #hhh#:#mm#" ) + " <" + chat_ja[x].user_id + ">: " +  chat_ja[x].text + "\n";
		else
			h = h + date.customFormat( "#MM#-#DD# #hhh#:#mm#" ) + " <" + chat_ja[x].user_id + ">: " +  chat_ja[x].text;
		x++;
	}	
	var prev = $("#chat_textarea").val();
	if(prev !== h)
	{	
		$("#chat_textarea").val(h);
		var textarea = document.getElementById('chat_textarea');
		if(typeof textarea !== "undefined" && textarea !== null)
			textarea.scrollTop = textarea.scrollHeight;
		//$('#chat_textarea').scrollTop($('#chat_textarea')[0].scrollHeight);
	}
}

function submitChatMessage(message)
{
	$("#chat_input").val("");
	$.ajax({
		type: 'GET',
		url: endpoint,
		data: {
            method: "submitChatMessage",
            screenname: screenname,          
            this_access_token: this_access_token, 
            message: message 
        },
        dataType: 'json',
        async: true,
        success: function (data, status) {
        	if (data.response_status === "error")
        	{
        		if(data.error_code && data.error_code === "0000")
        		{
        			displayMessage("Your login has expired. Please relog.", "red");
        			bg.user_jo = null;
        			updateLogstat();
        		}
        		$("#chat_error_div").text(data.message);
        		setTimeout(function() {$("#chat_error_div").text("");}, 3000);
        	}
        	else
        	{
        		if(typeof data.chat_ja !== "undefined" && data.chat_ja !== null)
        			displayChat(data.chat_ja);
        	}
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
	});
}
