chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.method === "gotParentOfItem") { 
        	if(request.item_jo !== null && request.index !== null)
        	{
        		//alert(request.item_jo.id + " " + request.index);
        		var span_elements_with_deleted = $( "span:contains('[deleted]')" );
        		var tempstr = "<table style=\"border:0px solid orange;border-collapse:collapse;margin-top:7px\">";
        		tempstr = tempstr + "	<tr>";
        		tempstr = tempstr + "		<td style=\"vertical-align:top;width:10px;text-align:center;border:0px solid green\">"; 
        		tempstr = tempstr + "		</td>";
        		tempstr = tempstr + "		<td> <!-- everything else, right-hand side -->";
        		tempstr = tempstr + "			<table style=\"border:0px solid purple;border-collapse:collapse\">";
        		tempstr = tempstr + "				<tr>";
        		tempstr = tempstr + "					<td style=\"vertical-align:middle;text-align:left;border:0px solid black;padding:2px 0px 0px 2px\" > "; 
        		tempstr = tempstr + "						<table style=\"width:100%;float:left;border:0px solid brown;vertical-align:middle; border-collapse: separate\">";
        		tempstr = tempstr + "							<tr> ";
        		tempstr = tempstr + "		  					 	<td style=\"vertical-align:middle;text-align:left;color:#828282;font-size:11px;color:black\">" + request.item_jo.by;
        		tempstr = tempstr + "		  					 		 - <span style=\"padding:5px;\">" + request.time_ago_string + "</span> <span style=\"color:red;font-style:italic\">(deleted)</span>";
        		tempstr = tempstr + "		  					 	</td>";
        		tempstr = tempstr + "							</tr>";
        		tempstr = tempstr + "  						</table>";
        		tempstr = tempstr + "					</td>";
        		tempstr = tempstr + "				</tr>";
        		tempstr = tempstr + "				<tr>";
        		tempstr = tempstr + "					<td style=\"padding:5px;vertical-align:top;text-align:left;font-size:11px;color:black\">" + request.item_jo.original_text + "</td>";
        	  	tempstr = tempstr + "				</tr>";
        	  	tempstr = tempstr + "			</table>";
        	  	tempstr = tempstr + "		</td>";
        		tempstr = tempstr + "	</tr>";
        	  	tempstr = tempstr + "</table>";
        		$(span_elements_with_deleted[request.index]).html(tempstr);
        	}
        }
    });

chrome.runtime.sendMessage({method: "getHideInlineFollow"}, function(response) {
	 if(response.hide_inline_follow === false)
	 {	 
		 chrome.runtime.onMessage.addListener( 
				 function(request, sender, sendResponse) 
				 {
				        if (request.method === "userSuccessfullyFollowedSomeone") 
				        {
				            //alert("received successful follow");
				            $("[id=follow_user_link_" + request.target_screenname + "]").text("unfollow");
				            $("[id=follow_user_link_" + request.target_screenname + "]").unbind('click');
				            $("[id=follow_user_link_" + request.target_screenname + "]").click({u: request.target_screenname}, function(event) {
				                if (typeof event.processed === "undefined" || event.processed === null) // prevent this from firing multiple times by setting event.processed = true on first pass
				                {
				                    event.processed = true;
				                    unfollowUser(event.data.u);
				                }
				                return false;
				            });
				        }
				        else if (request.method === "userSuccessfullyUnfollowedSomeone") 
				        {
				            //alert("received successful unfollow");
				            $("[id=follow_user_link_" + request.target_screenname + "]").text("follow");
				            $("[id=follow_user_link_" + request.target_screenname + "]").unbind('click');
				            $("[id=follow_user_link_" + request.target_screenname + "]").click({u: request.target_screenname}, function(event) {
				                if (typeof event.processed === "undefined" || event.processed === null) // prevent this from firing multiple times by setting event.processed = true on first pass
				                {
				                    event.processed = true;
				                    followUser(event.data.u);
				                }
				                return false;
				            });
				        } 
				        else if (request.method === "userFailedToFollowOrUnfollowSomeone") 
				        {
				            //alert("received follow/unfollow failure");
				            $("[id=follow_user_link_" + request.target_screenname + "]").text(request.message); // just leave the link active
				        }
				 });

				// comment like/dislike:
				// 1. user clicks arrow. likedislikemode set to "like" or "dislike". Tab opened to /reply
				// 2. on /reply, first up arrow is located and tab redirectd to location at /vote
				// 3. /vote automatically redirects to /x 
				// 4. process is complete. Tab is closed.

				// story like/dislike
				// 1. user clicks arrow. likedislikemode set to "like" or "dislike". tab opened to /item
				// 2. on /item, first up arrow is located and tab redirected to location at /vote
				// 3. /vote automatically redirects to /item 
				// 4. process is complete. tab is closed.

		 chrome.runtime.sendMessage({method: "getLikeDislikeMode"}, 
				 function(response) 
				 {
					if(response.likedislikemode === "storylike") // page like, find the first "up" on this page and redirect to it
					{
						var a = $('a[id^="up_"]');
						chrome.runtime.sendMessage({method: "setLikeDislikeMode", likedislikemode: "storyliking"}, function(response) { // /vote will redirect back here (to /item) again, so to advance to "liking" state
							chrome.runtime.sendMessage({method: "sendRedirect", location: "https://news.ycombinator.com/" + $(a[0]).attr("href")}, function(response) {});
						});
					}	
					else if(response.likedislikemode === "storydislike")
					{
						var a = $('a[id^="down_"]');
						chrome.runtime.sendMessage({method: "setLikeDislikeMode", likedislikemode: "storydisliking"}, function(response) { 
							chrome.runtime.sendMessage({method: "sendRedirect", location: "https://news.ycombinator.com/" + $(a[0]).attr("href")}, function(response) {});
						});
					}
					else if(response.likedislikemode === "storyliking" || response.likedislikemode === "storydisliking") // we've returned from /vote and /x and are done liking/disliking this item.
					{
						chrome.runtime.sendMessage({method: "setLikeDislikeMode", likedislikemode: "none"}, function(response) {   // return mode to normal
							chrome.runtime.sendMessage({method: "closeTab"}, function(response) {});							   // and close
						});
					}
					else
					{
						// detect screenname
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

						if(hn_screenname_found === true) // if user isn't even logged into hacker news (much less the ext), don't show any links
						{	
							var a = $('a[href^="user?id="]');
							var x = 1;
							var u = "";
							var s = "";
							var ss = "";
							var f = "";
							var logged_in = false;
							var following = null;

							chrome.runtime.sendMessage({method: "isUserLoggedInToExtension", detected_screenname: detected_screenname}, function(response) {
								if(response.logged_in === "no")
									logged_in = false;
								else if(response.logged_in === "yes")
									logged_in = true;
								
								//alert("logged_in=" + logged_in);
								
								chrome.runtime.sendMessage({method: "getFollowing"}, function(response) {
									following = response.following;
									while(x < a.length)
									{
										u = a.eq(x).html();
										if(u.indexOf("<font color") === -1) // don't even bother with these green dudes
										{
											s = a.eq(x).parent().html();
											ss = s.split(u + "</a>");
											if(following === null || following.indexOf(u) === -1)
											{
												f = ss[0] + u + "</a>" + " (<a href=\"#\" id=\"follow_user_link_" + u + "\">follow</a>) " + ss[1];
												a.eq(x).parent().html(f);
												$("[id=follow_user_link_" + u + "]").click({u:u}, function(event){
													if(typeof event.processed === "undefined" || event.processed === null) // prevent this from firing multiple times by setting event.processed = true on first pass
							        				{
							        					event.processed = true;
							        					if(logged_in === false) 
														{	// user might have logged in since this page was loaded. Check again.
															chrome.runtime.sendMessage({method: "isUserLoggedInToExtension", detected_screenname: detected_screenname}, function(response) {
																if(response.logged_in === "no")
																	alert("You are not logged into Hackbook. Do that first.");
																else
																{	
																	//alert("follow click + newly logged in");
																	logged_in = true;
																	followUser(event.data.u);
																}
															});
														}
														else
														{
															//alert("follow click + logged in");
															followUser(event.data.u);
														}
							        				}
													return false;
												});
											}
											else
											{	
												f = ss[0] + u + "</a>" + " (<a href=\"#\" id=\"follow_user_link_" + u + "\">unfollow</a>) " + ss[1];
												a.eq(x).parent().html(f);
												$("[id=follow_user_link_" + u + "]").click({u:u}, function(event){
													if(typeof event.processed === "undefined" || event.processed === null) // prevent this from firing multiple times by setting event.processed = true on first pass
							        				{
							        					event.processed = true;
							        					if(logged_in === false) 
														{	// user might have logged in since this page was loaded. Check again.
															chrome.runtime.sendMessage({method: "isUserLoggedInToExtension", detected_screenname: detected_screenname}, function(response) {
																if(response.logged_in === "no")
																	alert("You are not logged into Hackbook. Do that first.");
																else
																{	
																	logged_in = true;
																	unfollowUser(event.data.u);
																}
															});
														}
														else
														{
															unfollowUser(event.data.u);
														}
							        				}
													return false;
												});
											}
										}
										x++;
									}	
								});
							});
						}
					}
				});

				function followUser(target_screenname)
				{
					$("[id=follow_user_link_" + target_screenname + "]").text("processing");
					chrome.runtime.sendMessage({method: "followUser", target_screenname:target_screenname, runtime_or_tabs: "tabs"}, function(response) {
					});
				}

				function unfollowUser(target_screenname)
				{
					$("[id=follow_user_link_" + target_screenname + "]").text("processing");
					chrome.runtime.sendMessage({method: "unfollowUser", target_screenname:target_screenname, runtime_or_tabs: "tabs"}, function(response) {
					});
				}
	 }
 });

 var span_elements_with_deleted = $( "span:contains('[deleted]')" );
 var kids = null; 
 var kid = null;
 var detected_child_id = null;
 if(span_elements_with_deleted.length && span_elements_with_deleted.length > 0)
 {
	 for(var x=0; x < span_elements_with_deleted.length; x++)
	 {
		 //alert($(span_elements_with_deleted[x]).parent().parent().parent().parent().parent().parent().next().children(":first").children(":first").children(":first").children(":first").children(":first").next().next().children(":first").children(":first").html());
		 if($(span_elements_with_deleted[x]).parent().parent().parent().parent().parent().parent().next().children(":first").children(":first").children(":first").children(":first").children(":first").next().next().children(":first").children(":first").children())
		 {
			 kids = $(span_elements_with_deleted[x]).parent().parent().parent().parent().parent().parent().next().children(":first").children(":first").children(":first").children(":first").children(":first").next().next().children(":first").children(":first").children();
			 for(var y=0; y < kids.length; y++)
			 {
				 kid = kids[y];
				 if(kid.tagName === "A")
				 {
					 href = $(kid).attr("href");
					 if(href.indexOf("item?id=")===0)
					 {
						 var i = href.indexOf("id=") + 3;
						 detected_child_id = href.substr(i);
						 chrome.runtime.sendMessage({method: "getParentOfItem", detected_child_id:detected_child_id, index:x}, function(response) { });
					 }	
				 }	
			 }	
		 } 
	 }	
 }	
