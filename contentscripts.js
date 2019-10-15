 //填写默认账号密码并登录，账号密码可以自己更改
chrome.extension.sendRequest({}, function(response) {
		$(".box1 input").val("admin");
		$(".box2 input").val("admin*888");
		$(".box3 input").val("8888");
		$("#IbtnEnter").click();
});

