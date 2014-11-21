document.addEventListener('DOMContentLoaded', function () {
	$("#login_link").click(function(){
		chrome.runtime.sendMessage({method: "setHNLoginStep", hn_login_step: 0.5}, function(response) {
			chrome.runtime.sendMessage({method: "setHNExistingAbout", hn_existing_about: ""}, function(response) {
				chrome.runtime.sendMessage({method: "sendRedirect", location: "https://news.ycombinator.com/login"}, function(response) {
					
				});
			});
		});
		return false;
	});
});