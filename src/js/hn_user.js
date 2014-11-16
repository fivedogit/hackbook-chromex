chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.method === "gotHNAuthToken") {
        	if(request.token !== null)
        	{	
				var t = request.token;
				chrome.runtime.sendMessage({method: "setHNLoginStep", hn_login_step: 2}, function(response) { 
					var hn_existing_about = "";
					chrome.runtime.sendMessage({method: "getHNExistingAbout"}, function(response) {
						var hn_existing_about = response.hn_existing_about;
						var logmsg = "";
						logmsg = logmsg + hn_existing_about + "\n\n";
						logmsg = logmsg + "BEGIN|" + t + "|END";
						$('textarea[name=about]').val(logmsg);
						$('input:submit').trigger("click");
					});
				});
        	}
        	else
        	{
        		chrome.runtime.sendMessage({method: "setHNLoginStep", hn_login_step: 0}, function(response) { 
        			alert("There was an error getting the auth token. Check your network\nand if that doesn't work, please notify the developer @fivedogit.")
        		});
        	}	
        } 
        else if (request.method === "gotHNUserVerificationResponse") {
        	if(request.user_verified === true)
        	{
        		chrome.runtime.sendMessage({method: "setHNLoginStep", hn_login_step: 3}, function(response) { 
        			chrome.runtime.sendMessage({method: "getHNExistingAbout"}, function(response) {
        				var hn_existing_about = response.hn_existing_about;
        				$('textarea[name=about]').val(hn_existing_about);
        				$('input:submit').trigger("click");
                	});
        		});
        	}	
        	else
        	{
        		chrome.runtime.sendMessage({method: "setHNLoginStep", hn_login_step: 4}, function(response) { 
        			chrome.runtime.sendMessage({method: "getHNExistingAbout"}, function(response) {
        				var hn_existing_about = response.hn_existing_about;
        				$('textarea[name=about]').val(hn_existing_about);
        				$('input:submit').trigger("click");
                	});
        		});
        	}	
        }
    });

	chrome.runtime.sendMessage({method: "getHNLoginStep"}, function(response) { 
		if(response.hn_login_step === 0)
		{
			//alert("hn_login_step was 0. Do nothing.");
		}
		else if(response.hn_login_step === 1)
		{
			// Remove lingering BEGIN|asdfasdfa|END if it exists.
			var existing = $('textarea[name=about]').val();
			if(existing !== null && existing.indexOf("BEGIN|") !== -1 && existing.indexOf("|END") !== -1)
			{
				existing = existing.substring(0,existing.indexOf("BEGIN|")) + existing.substring(existing.indexOf("|END")+4);
				$('textarea[name=about]').val(existing);
				$('input:submit').trigger("click");
				return;
			}
			var elements_of_pagetop_class = $(".pagetop");
			var kids = null;
			var kid = null;
			var href = null;
			var detected_screenname = null;
			var hn_screenname_found = false;
			if(elements_of_pagetop_class.length && elements_of_pagetop_class.length > 0)
			{
				for(var x=0; x < elements_of_pagetop_class.length && hn_screenname_found === false; x++)
				{
					if($(elements_of_pagetop_class[x]).children())
					{
						kids = $(elements_of_pagetop_class[x]).children();
						for(var y=0; y < kids.length && hn_screenname_found === false; y++)
						{
							kid = kids[y];
							if(kid.tagName === "A")
							{
								href = $(kid).attr("href");
								if(href.indexOf("user?id=")===0)
								{
									var i = href.indexOf("id=") + 3;
									detected_screenname = href.substr(i);
									hn_screenname_found = true;
								}	
							}	
						}	
					}	
				}	
			}	
			
			//alert("hn_login_step was \"1\". Switch about field and trigger submit.");
			var hn_existing_about = $('textarea[name=about]').val();
			chrome.runtime.sendMessage({method: "setHNExistingAbout", hn_existing_about: hn_existing_about}, function(response) {
				//alert("cs done setting bg.hn_existing_about... getting auth token from backend with detected_screenname=" + detected_screenname);
				chrome.runtime.sendMessage({method: "getHNAuthToken", detected_screenname: detected_screenname}, function(response) { });
			});
		}	
		else if(response.hn_login_step === 2)
		{
			var elements_of_pagetop_class = $(".pagetop");
			var kids = null;
			var kid = null;
			var href = null;
			var detected_screenname = null;
			var hn_screenname_found = false;
			if(elements_of_pagetop_class.length && elements_of_pagetop_class.length > 0)
			{
				for(var x=0; x < elements_of_pagetop_class.length && hn_screenname_found === false; x++)
				{
					if($(elements_of_pagetop_class[x]).children())
					{
						kids = $(elements_of_pagetop_class[x]).children();
						for(var y=0; y < kids.length && hn_screenname_found === false; y++)
						{
							kid = kids[y];
							if(kid.tagName === "A")
							{
								href = $(kid).attr("href");
								if(href.indexOf("user?id=")===0)
								{
									var i = href.indexOf("id=") + 3;
									detected_screenname = href.substr(i);
									hn_screenname_found = true;
								}	
							}	
						}	
					}	
				}	
			}	
			var h = "<tr>";
			h = h + "	<td></td>";
			h = h + "	<td>";
			h = h + "		<div style=\"color:black;text-align:center\">";
			h = h + "			Hackbook has added a unique token below to verify that you own<br>";
			h = h + "			this HN acct. When verified, the previous text will be restored.<br>";
			h = h + "			<b>This may take up to 30 seconds.</b> Do not close the tab or window.";
			h = h + "		<div style=\"color:#ff6600;font-weight:bold;text-align:center;padding:10px\">PLEASE WAIT: <span id=\"vss\"></span></div>";
			h = h + "	</td>";
			h = h + "</tr>";
			$('textarea[name=about]').parent().prepend(h);
			chrome.runtime.sendMessage({method: "tellBackendToCheckUser", detected_screenname: detected_screenname}, function(response) { 
				
			});
			$("#vss").text("30");setTimeout(function(){$("#vss").text("29");setTimeout(function(){$("#vss").text("28");setTimeout(function(){$("#vss").text("27");setTimeout(function(){$("#vss").text("26");setTimeout(function(){$("#vss").text("25");setTimeout(function(){$("#vss").text("24");setTimeout(function(){$("#vss").text("23");setTimeout(function(){$("#vss").text("22");setTimeout(function(){$("#vss").text("21");setTimeout(function(){$("#vss").text("20");setTimeout(function(){$("#vss").text("19");setTimeout(function(){$("#vss").text("18");setTimeout(function(){$("#vss").text("17");setTimeout(function(){$("#vss").text("16");setTimeout(function(){$("#vss").text("15");setTimeout(function(){$("#vss").text("14");setTimeout(function(){$("#vss").text("13");setTimeout(function(){$("#vss").text("12");setTimeout(function(){$("#vss").text("11");setTimeout(function(){$("#vss").text("10");setTimeout(function(){$("#vss").text("9");setTimeout(function(){$("#vss").text("8");setTimeout(function(){$("#vss").text("7");setTimeout(function(){$("#vss").text("6");setTimeout(function(){$("#vss").text("5");setTimeout(function(){$("#vss").text("4");setTimeout(function(){$("#vss").text("3");setTimeout(function(){$("#vss").text("2");setTimeout(function(){$("#vss").text("1");setTimeout(function(){$("#vss").text("0")},1e3)},1e3)},1e3)},1e3)},1e3)},1e3)},1e3)},1e3)},1e3)},1e3)},1e3)},1e3)},1e3)},1e3)},1e3)},1e3)},1e3)},1e3)},1e3)},1e3)},1e3)},1e3)},1e3)},1e3)},1e3)},1e3)},1e3)},1e3)},1e3)},1e3)
		}
		else if(response.hn_login_step === 3)
		{
			chrome.runtime.sendMessage({method: "setHNLoginStep", hn_login_step: 0}, function(response) {
				//alert("hn_login_step was 3. hn_login_step has been set to 0 and we're redirecting to login_successful.html at " + chrome.extension.getURL("login_successful.html"));
				chrome.runtime.sendMessage({method: "sendRedirect", location: chrome.extension.getURL("login_successful.html")}, function(response) {});
			});
		}
		else if(response.hn_login_step === 4)
		{
			chrome.runtime.sendMessage({method: "setHNLoginStep", hn_login_step: 0}, function(response) {
				alert("There was an error logging you in to Hackbook. Our apologies. Please try again.");
			});
		}
	});




