chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.method === "gotHNAuthToken") {
            if (request.token !== null && request.manual_or_automatic === "automatic") {
                var t = request.token;
                chrome.runtime.sendMessage({method: "setHNLoginStep",hn_login_step: 2}, function(response) {
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
            else if(request.token !== null && request.manual_or_automatic === "manual") {
            	chrome.runtime.sendMessage({method: "setHNLoginStep",hn_login_step: 2}, function(response) {
            		var h = "Token generated. Please add the following token to your \"about\" and click \"update\".<br>" +
            	 		"<b>Include BEGIN| and |END, exactly as shown. Quotes are not necessary.<br><br>" +
            	 		"\"<span style=\"color:#ff6600\">BEGIN|" + request.token + "|END</span>\"";
            		$('#explainer_div').html(h);
            	});
            }
            else {
                chrome.runtime.sendMessage({method: "setHNLoginStep", hn_login_step: 0}, function(response) {
                    alert("There was an error getting the auth token. Check your network\nand if that doesn't work, please notify the developer @fivedogit.")
                });
            }
        } else if (request.method === "gotHNUserVerificationResponse") {
            if (request.user_verified === true) {
                chrome.runtime.sendMessage({method: "setHNLoginStep",hn_login_step: 3}, function(response) {
                    chrome.runtime.sendMessage({
                        method: "getHNExistingAbout"
                    }, function(response) {
                        var hn_existing_about = response.hn_existing_about;
                        $('textarea[name=about]').val(hn_existing_about);
                        $('input:submit').trigger("click");
                    });
                });
            } else {
                chrome.runtime.sendMessage({method: "setHNLoginStep",hn_login_step: 4}, function(response) {
                    chrome.runtime.sendMessage({method: "getHNExistingAbout"}, function(response) {
                        var hn_existing_about = response.hn_existing_about;
                        $('textarea[name=about]').val(hn_existing_about);
                        $('input:submit').trigger("click");
                    });
                });
            }
        }
    });

chrome.runtime.sendMessage({
    method: "getHNLoginStep"
}, function(response) {
    if (response.hn_login_step === 0) {
        //alert("hn_login_step was 0. Do nothing.");
    } 
    else if (response.hn_login_step === 0.5) {
    	 var h = "<tr>";
         h = h + "	<td></td>";
         h = h + "	<td>";
         h = h + "		<div style=\"color:black;text-align:center;padding-bottom:10px\" id=\"explainer_div\">";
         h = h + "			To verify that you own this account, Hackbook needs to add a unique token<br>";
         h = h + "			to your \"about\" below. You can do it manually or let Hackbook do it automatically.<br>";
         h = h + "			<div style=\"padding-top:10px;text-align:center\"><input type=\"button\" id=\"verification_cancel\" value=\"cancel\"> <input type=\"button\" id=\"verification_manual\" value=\"manual\"> <input type=\"button\" id=\"verification_automatic\" value=\"automatic\"></div>";
         h = h + "		</div>";
         h = h + "	</td>";
         h = h + "</tr>";
         $('textarea[name=about]').parent().prepend(h);
         $("#verification_cancel").click(function(){
        	 chrome.runtime.sendMessage({method: "setHNLoginStep",hn_login_step: 0}, function(response) {
        		 chrome.runtime.sendMessage({method: "sendRedirect",location: "https://news.ycombinator.com/"}, function(response) {});
        	 });
        	 return false;
         });
         $("#verification_manual").click(function(){
        	 chrome.runtime.sendMessage({method: "setHNLoginStep",hn_login_step: 1}, function(response) {
        		 var detected_screenname = scrapeScreenname();
        		 var hn_existing_about = $('textarea[name=about]').val();
        		 chrome.runtime.sendMessage({method: "setHNExistingAbout",hn_existing_about: hn_existing_about}, function(response) {
        			 chrome.runtime.sendMessage({method: "getHNAuthToken",detected_screenname: detected_screenname, manual_or_automatic: "manual"}, function(response) {
        			 });
        		 });
             });
        	 return false;
         });
         $("#verification_automatic").click(function(){
        	 chrome.runtime.sendMessage({method: "setHNLoginStep",hn_login_step: 1}, function(response) {
                 //alert("hn_login_step was 3. hn_login_step has been set to 0 and we're redirecting to login_successful.html at " + chrome.extension.getURL("login_successful.html"));
                 chrome.runtime.sendMessage({method: "sendRedirect",location: document.URL}, function(response) {});
             });
        	 return false;
         });
    } 
    else if (response.hn_login_step === 1) {
        // Remove lingering BEGIN|asdfasdfa|END if it exists.
        var existing = $('textarea[name=about]').val();
        if (existing !== null && existing.indexOf("BEGIN|") !== -1 && existing.indexOf("|END") !== -1) {
            existing = existing.substring(0, existing.indexOf("BEGIN|")) + existing.substring(existing.indexOf("|END") + 4);
            $('textarea[name=about]').val(existing);
            $('input:submit').trigger("click");
            return;
        }
        var detected_screenname = scrapeScreenname();
        //alert("hn_login_step was \"1\". Switch about field and trigger submit.");
        var hn_existing_about = $('textarea[name=about]').val();
        chrome.runtime.sendMessage({method: "setHNExistingAbout",hn_existing_about: hn_existing_about}, function(response) {
            //alert("cs done setting bg.hn_existing_about... getting auth token from backend with detected_screenname=" + detected_screenname);
            chrome.runtime.sendMessage({method: "getHNAuthToken",detected_screenname: detected_screenname, manual_or_automatic: "automatic"}, function(response) {});
        });
    } else if (response.hn_login_step === 2) {
    	
    	function rgb2hex(rgb) {
    	    if (/^[0-9A-F]{6}$/i.test(rgb)) return rgb;

    	    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    	    function hex(x) {
    	        return ("0" + parseInt(x).toString(16)).slice(-2);
    	    }
    	    return hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
    	}
    	
        var elements_of_pagetop_class = $(".pagetop");
        var kids = null;
        var kid = null;
        var href = null;
        var detected_screenname = null;
        var hn_screenname_found = false;
        var topcolor = "ff6600";
        if (elements_of_pagetop_class.length && elements_of_pagetop_class.length > 0) {
            for (var x = 0; x < elements_of_pagetop_class.length && hn_screenname_found === false; x++) {
                if ($(elements_of_pagetop_class[x]).children()) {
                    kids = $(elements_of_pagetop_class[x]).children();
                    for (var y = 0; y < kids.length && hn_screenname_found === false; y++) {
                        kid = kids[y];
                        if (kid.tagName === "A") {
                            href = $(kid).attr("href");
                            if (href.indexOf("user?id=") === 0) {
                                var i = href.indexOf("id=") + 3;
                                detected_screenname = href.substr(i);
                                hn_screenname_found = true;
                                topcolor = rgb2hex($(kid).parent().parent().parent().parent().parent().parent().css("background-color"));
                                if(!(/^[0-9A-F]{6}$/i.test(topcolor))) // if the topcolor isn't formatted correctly, just reset to default orange.
                                	topcolor = "ff6600";
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
        h = h + "			A unique token has been added to your \"about\" text below and Hackbook is<br>";
        h = h + "			now verifying it via the Hacker News API as proof that you own this acct.<br>";
        h = h + "			<b>This may take up to 30 seconds.</b> Do not close the tab or window.";
        h = h + "		<div style=\"color:#ff6600;font-weight:bold;text-align:center;padding:10px\">PLEASE WAIT: <span id=\"vss\"></span></div>";
        h = h + "	</td>";
        h = h + "</tr>";
        $('textarea[name=about]').parent().prepend(h);
        var tabid = 0;
        chrome.runtime.sendMessage({method: "tellBackendToCheckUser", detected_screenname: detected_screenname, topcolor: topcolor}, function(response) {

        });
        
        // this is the 30-to-0 countdown
        $("#vss").text("30");
        setTimeout(function() {
            $("#vss").text("29");
            setTimeout(function() {
                $("#vss").text("28");
                setTimeout(function() {
                    $("#vss").text("27");
                    setTimeout(function() {
                        $("#vss").text("26");
                        setTimeout(function() {
                            $("#vss").text("25");
                            setTimeout(function() {
                                $("#vss").text("24");
                                setTimeout(function() {
                                    $("#vss").text("23");
                                    setTimeout(function() {
                                        $("#vss").text("22");
                                        setTimeout(function() {
                                            $("#vss").text("21");
                                            setTimeout(function() {
                                                $("#vss").text("20");
                                                setTimeout(function() {
                                                    $("#vss").text("19");
                                                    setTimeout(function() {
                                                        $("#vss").text("18");
                                                        setTimeout(function() {
                                                            $("#vss").text("17");
                                                            setTimeout(function() {
                                                                $("#vss").text("16");
                                                                setTimeout(function() {
                                                                    $("#vss").text("15");
                                                                    setTimeout(function() {
                                                                        $("#vss").text("14");
                                                                        setTimeout(function() {
                                                                            $("#vss").text("13");
                                                                            setTimeout(function() {
                                                                                $("#vss").text("12");
                                                                                setTimeout(function() {
                                                                                    $("#vss").text("11");
                                                                                    setTimeout(function() {
                                                                                        $("#vss").text("10");
                                                                                        setTimeout(function() {
                                                                                            $("#vss").text("9");
                                                                                            setTimeout(function() {
                                                                                                $("#vss").text("8");
                                                                                                setTimeout(function() {
                                                                                                    $("#vss").text("7");
                                                                                                    setTimeout(function() {
                                                                                                        $("#vss").text("6");
                                                                                                        setTimeout(function() {
                                                                                                            $("#vss").text("5");
                                                                                                            setTimeout(function() {
                                                                                                                $("#vss").text("4");
                                                                                                                setTimeout(function() {
                                                                                                                    $("#vss").text("3");
                                                                                                                    setTimeout(function() {
                                                                                                                        $("#vss").text("2");
                                                                                                                        setTimeout(function() {
                                                                                                                            $("#vss").text("1");
                                                                                                                            setTimeout(function() {
                                                                                                                                $("#vss").text("0")
                                                                                                                            }, 1100)
                                                                                                                        }, 1100)
                                                                                                                    }, 1100)
                                                                                                                }, 1100)
                                                                                                            }, 1100)
                                                                                                        }, 1100)
                                                                                                    }, 1100)
                                                                                                }, 1100)
                                                                                            }, 1100)
                                                                                        }, 1100)
                                                                                    }, 1100)
                                                                                }, 1100)
                                                                            }, 1100)
                                                                        }, 1100)
                                                                    }, 1100)
                                                                }, 1100)
                                                            }, 1100)
                                                        }, 1100)
                                                    }, 1100)
                                                }, 1100)
                                            }, 1100)
                                        }, 1100)
                                    }, 1100)
                                }, 1100)
                            }, 1100)
                        }, 1100)
                    }, 1100)
                }, 1100)
            }, 1100)
        }, 1100)
    } else if (response.hn_login_step === 3) {
        chrome.runtime.sendMessage({method: "setHNLoginStep",hn_login_step: 0}, function(response) {
            //alert("hn_login_step was 3. hn_login_step has been set to 0 and we're redirecting to login_successful.html at " + chrome.extension.getURL("login_successful.html"));
            chrome.runtime.sendMessage({method: "sendRedirect",location: chrome.extension.getURL("login_successful.html")}, function(response) {});
        });
    } else if (response.hn_login_step === 4) {
        chrome.runtime.sendMessage({
            method: "setHNLoginStep",
            hn_login_step: 0
        }, function(response) {
            alert("There was an error logging you in to Hackbook.\nSometimes there is latency from the HN API.\nMy apologies. Please try again one more time.");
        });
    }
});

// this is the inline follow portion of /user
chrome.runtime.sendMessage({method: "getHideInlineFollow"}, function(response) {
	 if(response.hide_inline_follow === false)
	 {	 
		 chrome.runtime.onMessage.addListener(
				    function(request, sender, sendResponse) {
				        if (request.method === "userSuccessfullyFollowedSomeone") {
				            //alert("received successful follow");
				            $("[id=follow_user_link_" + request.target_screenname + "]").text("unfollow");
				            $("[id=follow_user_link_" + request.target_screenname + "]").unbind('click');
				            $("[id=follow_user_link_" + request.target_screenname + "]").click({
				                u: request.target_screenname
				            }, function(event) {
				                if (typeof event.processed === "undefined" || event.processed === null) // prevent this from firing multiple times by setting event.processed = true on first pass
				                {
				                    event.processed = true;
				                    unfollowUser(event.data.u);
				                }
				                return false;
				            });
				        } else if (request.method === "userSuccessfullyUnfollowedSomeone") {
				            //alert("received successful unfollow");
				            $("[id=follow_user_link_" + request.target_screenname + "]").text("follow");
				            $("[id=follow_user_link_" + request.target_screenname + "]").unbind('click');
				            $("[id=follow_user_link_" + request.target_screenname + "]").click({
				                u: request.target_screenname
				            }, function(event) {
				                if (typeof event.processed === "undefined" || event.processed === null) // prevent this from firing multiple times by setting event.processed = true on first pass
				                {
				                    event.processed = true;
				                    followUser(event.data.u);
				                }
				                return false;
				            });
				        } else if (request.method === "userFailedToFollowOrUnfollowSomeone") {
				            //alert("received follow/unfollow failure");
				            $("[id=follow_user_link_" + request.target_screenname + "]").text(request.message); // just leave the link active
				        }
				    });


		 // detect screenname
		 var detected_screenname = scrapeScreenname();
		 if (detected_screenname !== null) // if user isn't even logged into hacker news (much less the ext), don't show any links
		 {
		 	var logged_in = false;
		 	
		     chrome.runtime.sendMessage({ method: "isUserLoggedInToExtension", detected_screenname: detected_screenname }, function(response) {
		         if (response.logged_in === "no")
		             logged_in = false;
		         else if (response.logged_in === "yes")
		             logged_in = true;

		         var u = "";
		         var userbox_text = u = $('td:contains("user:")').next().text();
		         
		         if(u !== detected_screenname) // don't do this on the user's own page.
		         {	
		         	userbox_text = userbox_text + " (<a style=\"color:#828282\" href=\"#\" id=\"follow_user_link_" + u + "\">follow</a>) ";
		             $('td:contains("user:")').next().html(userbox_text);
		             
		             $("[id=follow_user_link_" + u + "]").click({ u: u }, function(event) {
		                 if (typeof event.processed === "undefined" || event.processed === null) // prevent this from firing multiple times by setting event.processed = true on first pass
		                 {
		                     event.processed = true;
		                     if (logged_in === false) { // user might have logged in since this page was loaded. Check again.
		                         chrome.runtime.sendMessage({ method: "isUserLoggedInToExtension", detected_screenname: detected_screenname}, function(response) {
		                             if (response.logged_in === "no")
		                                 alert("You are not logged into Hackbook. Do that first.");
		                             else {
		                                 //alert("follow click + newly logged in");
		                                 logged_in = true;
		                                 followUser(event.data.u);
		                             }
		                         });
		                     } else {
		                         //alert("follow click + logged in");
		                         followUser(event.data.u);
		                     }
		                 }
		                 return false;
		             });
		         }
		     });
		 }
	 }
});

function followUser(target_screenname) {
    $("[id=follow_user_link_" + target_screenname + "]").text("processing");
    chrome.runtime.sendMessage({
        method: "followUser",
        target_screenname: target_screenname,
        runtime_or_tabs: "tabs"
    }, function(response) {});
}

function unfollowUser(target_screenname) {
    $("[id=follow_user_link_" + target_screenname + "]").text("processing");
    chrome.runtime.sendMessage({
        method: "unfollowUser",
        target_screenname: target_screenname,
        runtime_or_tabs: "tabs"
    }, function(response) {});
}

function scrapeScreenname()
{
	var elements_of_pagetop_class = $(".pagetop");
	var kids = null;
	var kid = null;
	var href = null;
	var detected_screenname = null;
	if (elements_of_pagetop_class.length && elements_of_pagetop_class.length > 0) {
	    for (var x = 0; x < elements_of_pagetop_class.length; x++) {
	        if ($(elements_of_pagetop_class[x]).children()) {
	            kids = $(elements_of_pagetop_class[x]).children();
	            for (var y = 0; y < kids.length; y++) {
	                kid = kids[y];
	                if (kid.tagName === "A") {
	                    href = $(kid).attr("href");
	                    if (href.indexOf("user?id=") === 0) {
	                        var i = href.indexOf("id=") + 3;
	                        detected_screenname = href.substr(i);
	                        return detected_screenname;
	                    }
	                }
	            }
	        }
	    }
	}
	return null;
}