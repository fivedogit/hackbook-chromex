

	chrome.runtime.sendMessage({method: "getHNLoginStep"}, function(response) { 
		if(response.hn_login_step === 0)
		{
			//alert("hn_login_step was 0. Do nothing.");
		}
		else if(response.hn_login_step === 1)
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
			
			//alert("hn_login_step was \"1\". Switch about field and trigger submit.");
			var hn_existing_about = $('textarea[name=about]').val();
			chrome.runtime.sendMessage({method: "setHNExistingAbout", hn_existing_about: hn_existing_about}, function(response) {
				//alert("cs done setting bg.hn_existing_about... getting auth token from backend with detected_screenname=" + detected_screenname);
				chrome.runtime.sendMessage({method: "getHNAuthToken", detected_screenname: detected_screenname}, function(response) { 
					//alert("cs got response, checking token");
					if(response.token !== null)
					{	
						//alert("cs Got response token=" + response.token + " setting hn_login_step to 2 and submitting");
						var t = response.token;
						chrome.runtime.sendMessage({method: "setHNLoginStep", hn_login_step: 2}, function(response) { 
							var logmsg = "";
							logmsg = logmsg + hn_existing_about + "\n";
							logmsg = logmsg + "------------------------------------------\n";
							logmsg = logmsg + "BEGIN|" + t + "|END\n";
							logmsg = logmsg + "##########################################\n";
							logmsg = logmsg + "#   Hackbook is verifying that you own   #\n";  
							logmsg = logmsg + "#  this acct. Please wait up to 30 sec.  #\n";
							logmsg = logmsg + "#   The previous text (below) will be    #\n";
							logmsg = logmsg + "#     restored. Don't close this tab.    #\n";
							logmsg = logmsg + "#       Yes, 30 sec is a long time.      #\n";
							logmsg = logmsg + "#            Just keep waiting.          #\n";
							logmsg = logmsg + "##########################################\n";
							$('textarea[name=about]').val(logmsg);
							$('input:submit').trigger("click");
						});
					}
					else
					{
						//alert("cs Couldn't get auth token from backend");
						chrome.runtime.sendMessage({method: "setHNLoginStep", hn_login_step: 0}, function(response) {});
					}	
				});
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
			
			//alert("hn_login_step was 2. Getting previous text. Telling backend to check user.");
			chrome.runtime.sendMessage({method: "getHNExistingAbout"}, function(response) {
				var existing = response.hn_existing_about;
				chrome.runtime.sendMessage({method: "tellBackendToCheckUser", detected_screenname: detected_screenname}, function(response) { 
					if(response.user_validated === true)
					{
						//alert("user validated, setting hn_login_step to 3, replacing previous text (" + existing + ") and triggering submit");
						chrome.runtime.sendMessage({method: "setHNLoginStep", hn_login_step: 3}, function(response) {
							$('textarea[name=about]').val(existing);
							$('input:submit').trigger("click");
						});
					}	
					else
					{
						//alert("user not validated, setting hn_login_step to 0, replacing previous text (" + existing + ") and triggering submit");
						chrome.runtime.sendMessage({method: "setHNLoginStep", hn_login_step: 0}, function(response) {
							$('textarea[name=about]').val(existing);
							$('input:submit').trigger("click");
						});
					}	
				});
			});
		}
		else if(response.hn_login_step === 3)
		{
			chrome.runtime.sendMessage({method: "setHNLoginStep", hn_login_step: 0}, function(response) {
				//alert("hn_login_step was 3. hn_login_step has been set to 0 and we're redirecting to login_successful.html at " + chrome.extension.getURL("login_successful.html"));
				chrome.runtime.sendMessage({method: "sendRedirect", location: chrome.extension.getURL("login_successful.html")}, function(response) {});
			});
		}
	});




