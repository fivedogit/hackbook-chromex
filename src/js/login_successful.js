chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	  if(request.method === "userSuccessfullyFollowedSomeone")
	  {
		  //alert("received successful follow");
		  $("#follow_user_link_" + request.target_screenname).text("unfollow"); // just leave the link active
		  $("#follower_count_span_" + request.target_screenname).text($("#follower_count_span_" + request.target_screenname).text()*1+1);
		  $("#follow_user_link_" + request.target_screenname).unbind('click'); // lazy, but whatever
		  $("#follow_user_link_" + request.target_screenname).click({u:request.target_screenname}, function(event){
			  if(typeof event.processed === "undefined" || event.processed === null) // prevent this from firing multiple times by setting event.processed = true on first pass
			  {
				  event.processed = true;
				  unfollowUser(event.data.u);
			  }
			  return false;
		  });
	  }
	  else if(request.method === "userSuccessfullyUnfollowedSomeone")
	  {
		  //alert("received successful unfollow");
		  $("#follow_user_link_" + request.target_screenname).text("follow"); // just leave the link active
		  var followercount = $("#follower_count_span_" + request.target_screenname).text()*1;
		  if(followercount == 0) // never go below 0
			  $("#follower_count_span_" + request.target_screenname).text(0);
		  else
			  $("#follower_count_span_" + request.target_screenname).text(followercount-1);
		  $("#follow_user_link_" + request.target_screenname).unbind('click'); // lazy, but whatever
		  $("#follow_user_link_" + request.target_screenname).click({u:request.target_screenname}, function(event){
			  if(typeof event.processed === "undefined" || event.processed === null) // prevent this from firing multiple times by setting event.processed = true on first pass
			  {
				  event.processed = true;
				  logged_in = true;
				  followUser(event.data.u);
			  }
			  return false;
		  });
	  } 
	  else if(request.method === "userFailedToFollowOrUnfollowSomeone")
	  {
		  //alert("received follow/unfollow failure");
		  $("#follow_user_link_" + request.target_screenname).text(request.message); // just leave the link active
	  } 
  });


document.addEventListener('DOMContentLoaded', function () {
	
	$("#go_to_hacker_news_link").click(function(){
		var following = null;
		chrome.runtime.sendMessage({method: "getFollowing"}, function(response) {
			following = response.following;
			if(typeof following === "undefined" || following === null || typeof following.length === "undefined" || following.length === null || following.length === 0)
			{
				var r = confirm("You're not following anyone yet! Hackbook is pretty useless if you don't. Click 'cancel' to follow a few users or OK to continue to Hacker News.");
				if (r == true) {
					chrome.runtime.sendMessage({method: "sendRedirect", location: "https://news.ycombinator.com/"}, function(response) {
						
					});
				} else {
				   // do nothing, just close confirm dialog
				}
			}
			else
			{
				chrome.runtime.sendMessage({method: "sendRedirect", location: "https://news.ycombinator.com/"}, function(response) {
					
				});
			}	
		});
		return false;
	});
	
	chrome.runtime.sendMessage({method: "getEndpoint"}, function(response) {
		var endpoint = response.endpoint;
		var following = null;
		chrome.runtime.sendMessage({method: "getFollowing"}, function(response) {
			following = response.following;
			
			$("#most_followed_td").html("<img src=\"" + chrome.extension.getURL("images/ajaxSnake.gif") + "\">");
			$.ajax({ 
				type: 'GET', 
				url: endpoint, 
				data: {
					method: "getMostFollowedUsers",
		        },
		        dataType: 'json', 
		        async: true, // not sure how to accomplish this otherwise
		        success: function (data, status) {
		        	if(data.response_status === "success")
		        	{	
		        		var us = "";
		        		var x = 0;
		        		var most_followed_users = data.most_followed_users;
		        		
		        		most_followed_users.sort(function(a,b){
		    				a = a.num_followers;
		    				b = b.num_followers;
		    				return b - a;
		    			});
		        		
		        		while(x < most_followed_users.length/2)
		        		{
		        			if(most_followed_users[x].id === "fivedogit")
		        				us = us + "<span style=\"color:#ff6600\">&#9733;</span>";
		        			us = us + "<a href=\"https://news.ycombinator.com/user?id=" + most_followed_users[x].id + "\" style=\"font-weight:bold\">" + most_followed_users[x].id + "</a>" +  " (<span id=\"follower_count_span_" + most_followed_users[x].id + "\">" + most_followed_users[x].num_followers + "</span>) - <a href=\"#\" id=\"follow_user_link_" + most_followed_users[x].id + "\">";
		        			if(typeof following === "undefined" || following === null || following.indexOf(most_followed_users[x].id) === -1)
		        				us = us + "follow";
		        			else
		        				us = us + "unfollow";
		        			us = us + "</a><br>";
		        			x++;
		        		}	
		        		$("#most_followed_left_td").html(us);
		        		us="";
		        		while(x < most_followed_users.length)
		        		{
		        			if(most_followed_users[x].id === "fivedogit")
		        				us = us + "<span style=\"color:#ff6600\">&#9733;</span>";
		        			us = us + "<a href=\"https://news.ycombinator.com/user?id=" + most_followed_users[x].id + "\" style=\"font-weight:bold\">" + most_followed_users[x].id + "</a>" +  " (<span id=\"follower_count_span_" + most_followed_users[x].id + "\">" + most_followed_users[x].num_followers + "</span>) - <a href=\"#\" id=\"follow_user_link_" + most_followed_users[x].id + "\">";
		        			if(typeof following === "undefined" || following === null || following.indexOf(most_followed_users[x].id) === -1)
		        				us = us + "follow";
		        			else
		        				us = us + "unfollow";
		        			us = us + "</a><br>";
		        			x++;
		        		}	
		        		$("#most_followed_right_td").html(us);
		        		x=0;
		        		while(x < most_followed_users.length)
		        		{
		        			if(typeof following === "undefined" || following === null || following.indexOf(most_followed_users[x].id) === -1)
		        			{	
		        				$("#follow_user_link_" + most_followed_users[x].id).click({u:most_followed_users[x].id}, function(event){
			        				if(typeof event.processed === "undefined" || event.processed === null) // prevent this from firing multiple times by setting event.processed = true on first pass
			        				{
			        					event.processed = true;
			        					followUser(event.data.u);
			        				}
			        				return false;
			        			});
		        			}
		        			else
		        			{
		        				$("#follow_user_link_" + most_followed_users[x].id).click({u:most_followed_users[x].id}, function(event){
			        				if(typeof event.processed === "undefined" || event.processed === null) // prevent this from firing multiple times by setting event.processed = true on first pass
			        				{
			        					event.processed = true;
			        					unfollowUser(event.data.u);
			        				}
			        				return false;
			        			});
		        			}	
		        			x++;
		        		}
		        	}
		        	else if(data.response_status === "error")
		        	{
		        		$("#most_followed_td").html("error: response_status=error");
		        	}	
		        	else
		        	{
		        		$("#most_followed_td").html("error: no response status from server");
		        	}
		        },
		        error: function (XMLHttpRequest, textStatus, errorThrown) {
		            console.log(textStatus, errorThrown);
		            $("#most_followed_td").html("error: ajax");
		        }
			});
		  
			$("#random_users_td").html("<img src=\"" + chrome.extension.getURL("images/ajaxSnake.gif") + "\">");
			$.ajax({ 
				type: 'GET', 
				url: endpoint, 
				data: {
					method: "getRandomUsers",
		        },
		        dataType: 'json', 
		        async: true, // not sure how to accomplish this otherwise
		        success: function (data, status) {
		        	if(data.response_status === "success")
		        	{	
		        		var us = "";
		        		var x = 0;
		        		
		        		var random_users = data.random_users;
		        		
		        		random_users.sort(function(a,b){
		        			if(a.id < b.id) return -1;
		        			if(a.id > b.id) return 1;
		        			return 0;
		    			});
		        		
		        		while(x < random_users.length/2)
		        		{
		        			us = us + "<a href=\"https://news.ycombinator.com/user?id=" + random_users[x].id + "\" style=\"font-weight:bold\">" + random_users[x].id + "</a>" +  " (<span id=\"follower_count_span_" + random_users[x].id + "\">" + random_users[x].num_followers + "</span>) - <a href=\"#\" id=\"follow_user_link_" + random_users[x].id + "\">";
		        			if(typeof following === "undefined" || following === null || following.indexOf(random_users[x].id) === -1)
		        				us = us + "follow";
		        			else
		        				us = us + "unfollow";
		        			us = us + "</a><br>";
		        			x++;
		        		}	
		        		$("#random_users_left_td").html(us);
		        		us="";
		        		while(x < random_users.length)
		        		{
		        			us = us + "<a href=\"https://news.ycombinator.com/user?id=" + random_users[x].id + "\" style=\"font-weight:bold\">" + random_users[x].id + "</a>" +  " (<span id=\"follower_count_span_" + random_users[x].id + "\">" + random_users[x].num_followers + "</span>) - <a href=\"#\" id=\"follow_user_link_" + random_users[x].id + "\">";
		        			if(typeof following === "undefined" || following === null || following.indexOf(random_users[x].id) === -1)
		        				us = us + "follow";
		        			else
		        				us = us + "unfollow";
		        			us = us + "</a><br>";
		        			x++;
		        		}	
		        		x=0;
		        		$("#random_users_right_td").html(us);
		        		while(x < random_users.length)
		        		{
		        			if(typeof following === "undefined" || following === null || following.indexOf(random_users[x].id) === -1)
		        			{
		        				$("#follow_user_link_" + random_users[x].id).click({u:random_users[x].id}, function(event){
			        				if(typeof event.processed === "undefined" || event.processed === null) // prevent this from firing multiple times by setting event.processed = true on first pass
			        				{
			        					event.processed = true;
			        					followUser(event.data.u);
			        				}
			        				return false;
			        			});
		        			}
		        			else
		        			{
		        				$("#follow_user_link_" + random_users[x].id).click({u:random_users[x].id}, function(event){
			        				if(typeof event.processed === "undefined" || event.processed === null) // prevent this from firing multiple times by setting event.processed = true on first pass
			        				{
			        					event.processed = true;
			        					unfollowUser(event.data.u);
			        				}
			        				return false;
			        			});
		        			}	
		        			x++;
		        		}
		        	}
		        	else if(data.response_status === "error")
		        	{
		        		$("#random_users_td").html("error: response_status=error");
		        	}	
		        	else
		        	{
		        		$("#random_users_td").html("error: no response status from server");
		        	}
		        },
		        error: function (XMLHttpRequest, textStatus, errorThrown) {
		            console.log(textStatus, errorThrown);
		            $("#random_users_td").html("error: ajax");
		        }
			});
		});
	});
});

function followUser(target_screenname)
{
	$("#follow_user_link_" + target_screenname).html("processing");
	chrome.runtime.sendMessage({method: "followUser", target_screenname:target_screenname}, function(response) {
			
	});
}

function unfollowUser(target_screenname)
{
	$("#follow_user_link_" + target_screenname).html("processing");
	chrome.runtime.sendMessage({method: "unfollowUser", target_screenname:target_screenname}, function(response) {
	});
}
