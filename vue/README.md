# vue_websocket_chat_components
vue websocket企业聊天组件

用到的技术：
expres
socket.io
seession :后台 设置session 前台获取session
	获取的方法 
	1 通过ajax获取（如果前后端分离 可能涉及跨域请求）
	2 vue通过axios跨域请求 如果有跨域限制 需要设置请求头信息
	3 后台设置session 返回 一个数据给前台 前的设置一个隐藏的html元素 元素内容是通过后端渲染模板引擎把session数据传递给它的 然后前台通过js获取这个隐藏的html的内容 即可获取后台的session数据
