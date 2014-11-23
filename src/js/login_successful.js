chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	  if(request.method === "userSuccessfullyFollowedSomeone")
	  {
		  //alert("received successful follow");
		  if(request.target_screenname === $("#add_follow_input").val()) // if this username is in the specific box, then this must be a response to a specific follow
		  {
			  $("#add_follow_input").val("");
			  $("#add_follow_result_span").text("Success!");
			  setTimeout(function() {
					$("#add_follow_result_span").text("");
			  },2000);
		  } 
		  
		  // do these regardless of the above.
		  $("[id=follow_user_link_" + request.target_screenname + "]").text("unfollow"); 
		  $("[id=follower_count_span_" + request.target_screenname + "]").text($("[id=follower_count_span_" + request.target_screenname + "]").text()*1+1);
		  $("[id=follow_user_link_" + request.target_screenname + "]").unbind('click'); 
		  $("[id=follow_user_link_" + request.target_screenname + "]").click({u:request.target_screenname}, function(event){
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
		  $("[id=follow_user_link_" + request.target_screenname + "]").text("follow");
		  var followercount = $("[id=follower_count_span_" + request.target_screenname + "]").text()*1;
		  if(followercount == 0) // never go below 0
			  $("[id=follower_count_span_" + request.target_screenname + "]").text(0);
		  else
			  $("[id=follower_count_span_" + request.target_screenname + "]").text(followercount-1);
		  $("[id=follow_user_link_" + request.target_screenname + "]").unbind('click'); 
		  $("[id=follow_user_link_" + request.target_screenname + "]").click({u:request.target_screenname}, function(event){
			  if(typeof event.processed === "undefined" || event.processed === null) // prevent this from firing multiple times by setting event.processed = true on first pass
			  {
				  event.processed = true;
				  followUser(event.data.u);
			  }
			  return false;
		  });
	  } 
	  else if(request.method === "userFailedToFollowOrUnfollowSomeone")
	  {
		  //alert("received follow/unfollow failure");
		  if(request.target_screenname === $("#add_follow_input").val()) // if this username is in the specific box, then this must be a response to a specific follow
		  {
			  $("#add_follow_input").val("");
			  $("#add_follow_result_span").text("Error");
			  setTimeout(function() {
					$("#add_follow_result_span").text("");
			  },2000);
		  }
		  
		  // do this regardless of the above.
		  $("[id=follow_user_link_" + request.target_screenname + "]").text(request.message); // just leave the link active
	  } 
  });


document.addEventListener('DOMContentLoaded', function () {
	
	$("#add_follow_go_button").click(function () {
		$("#add_follow_result_span").text("Processing...");
		chrome.runtime.sendMessage({method: "followUser", target_screenname:$("#add_follow_input").val(), runtime_or_tabs: "runtime"}, function(response) {
		});
		return false;
	});
	
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
		        		
		        		while(x < most_followed_users.length/3)
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
		        		while(x < most_followed_users.length/3*2)
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
		        		$("#most_followed_center_td").html(us);
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
		        				$("[id=follow_user_link_" + most_followed_users[x].id + "]").click({u:most_followed_users[x].id}, function(event){
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
		        				$("[id=follow_user_link_" + most_followed_users[x].id + "]").click({u:most_followed_users[x].id}, function(event){
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
		 
		});
	});
});

function followUser(target_screenname)
{
	$("[id=follow_user_link_" + target_screenname + "]").html("processing");
	chrome.runtime.sendMessage({method: "followUser", target_screenname:target_screenname, runtime_or_tabs: "runtime"}, function(response) {
			
	});
}

function unfollowUser(target_screenname)
{
	$("[id=follow_user_link_" + target_screenname + "]").html("processing");
	chrome.runtime.sendMessage({method: "unfollowUser", target_screenname:target_screenname, runtime_or_tabs: "runtime"}, function(response) {
	});
}
