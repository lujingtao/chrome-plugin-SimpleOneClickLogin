@[toc](chrome自制插件--简单一键登录（附插件开发介绍）)

# 一、前言

chrome快速，简洁，插件丰富，于是赢得越来越多的市场份额。

本人现在工作情况是使用动易系统进行多个项目并行推进，同时要维护旧项目，但平时进入网站后台都挺麻烦的，要输入地址和密码，尽管chrome有记录账号功能，但经常失常。于是我想到了做一个十分人性化的一键登录后台插件，从而解决我们平时网站输出过程中进入后台的苦恼。

<font color="red">这篇只是前奏，以最简单的一键登录例子介绍如何开发chrome插件。
下篇文章哥将提供功能强大的，针对动易系统的一键登录插件，造福广大群众。
当然通过本文你也能学会开发chrome插件，也可以在本插件基础上修改来适应你的实际需求。
</font>

有需要的可以看功能强大的下篇[《chrome自制插件--动易网站后台一键登录v1.4》](https://blog.csdn.net/iamlujingtao/article/details/102576770)

# 二、需求
我需要实现的功能是这样的：
平时工作中，我在输出一个政府网站，此时我需要进入后台，那么我点击一下“一键登录”，它就自动新建一个网页并自动登录后台。

# 三、文件结构及代码
## 3.1 第一步：建立文件
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191015223906171.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2lhbWx1amluZ3Rhbw==,size_16,color_FFFFFF,t_70)
## 3.2 第二步：修改manifest.json，配置插件

```js
{ 
    "name" : "ZX.OneClickLogin", //插件名称 
    "version" : "1.0", //插件版本 
    "background": { "scripts": ["background.js"] }, //插件后台处理文件 
     "icons": { "16": "images/logo16.png","48": "images/logo48.png","128": "images/logo128.png" }, //插件logo图片位置 
 
    "browser_action": { 
        "default_icon" : "images/logo16.png", //小图标按钮图片位置 
        "default_title" : "一键登录" //小图标按钮浮动标题 
    }, 
    "permissions" : [ "tabs", "http://*/*","notifications" ] //插件权限设置 
} 
```

## 3.3 第三步：修改background.js文件，实现想要的功能
```js
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
```

## 3.4 第四步：修改contentscripts.js文件，用于自动登录
```js
//填写默认账号密码并登录，账号密码可以自己更改 
chrome.extension.sendRequest({}, function(response) { 
        $(".box1 input").val("admin"); 
        $(".box2 input").val("admin*888"); 
        $(".box3 input").val("8888"); 
        $("#IbtnEnter").click(); 
}); 
```

## 3.5 第五步：安装插件
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191015224157379.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2lhbWx1amluZ3Rhbw==,size_16,color_FFFFFF,t_70)
打开chrome，点击地址栏最右侧的“扳手按钮”--> 设置 --> 扩展程序 --> 勾选“开发人员模式” --> 载入正在开发的扩展程序


完成，好了，这时候你会看到chrome地址栏旁边多了一个“一键登录”按钮。
好，现在模拟一下平时工作情况：
我现在在输出一个政府网站，此时我需要登录后台，那么不管你在该网站哪一个页面，你直接点击“一键登录”按钮就可以了，它会自动新建一个tab然后进入后台，再自动填写contentscripts.js设置的账号和密码，如果正确那就直接进入后台了。

当然这是最简单，最理想的情况，真实环境可能会有更多问题。所以我在扩展成一个功能更强大的，更人性化的一键登录。现在已经差不多了，下个月可以放bate版给大家使用了。

# 四、GitHub源码
[--> GitHub源码](https://github.com/lujingtao/chrome-plugin-SimpleOneClickLogin)

# 五、参考资料
chrome插件开发参考文档地址：http://open.chrome.360.cn/html/dev_doc.html 360的提供的，很实用。