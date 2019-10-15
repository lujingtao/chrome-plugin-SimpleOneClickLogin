var url="";

//插件按钮图标点击后进入后台
chrome.browserAction.onClicked.addListener(function(tab) {
	url = "http://"+(tab.url).split("/")[2]+"/admin/";
	chrome.tabs.create( { url:url }, function(){ postData() });
});


//进入后台后提交账号密码
function postData(){ 
		chrome.tabs.executeScript(null,{file:"jquery.js"});  //executeScript 相当于在当前页面插入js代码/文件
		chrome.tabs.executeScript(null,{file:"contentscripts.js"},function(){ //插入contentscripts.js文件，用户填写账号密码并登录
			chrome.tabs.onUpdated.addListener(updateTab);
		});
 }

//监测登录情况，判断是否登录成功
function updateTab( tabId, info, tab ) {	
	chrome.tabs.getSelected(null, function(tab) {
		var ary = (tab.url).split("/");
		if( info.status=="complete" ){ 
			chrome.tabs.onUpdated.removeListener(updateTab);
			if( ary.pop()=="Login.aspx" ){ 
				webkitNotifications.createNotification( 'logo.png',  '对不起',  '登录失败，自己动手吧~亲~'  ).show();
			}
		}//if
    });
}
