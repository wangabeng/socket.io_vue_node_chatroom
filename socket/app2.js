var express = require("express");
var app = express();

app.set("view engine","ejs");

app.use(express.static("./public"));
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

	next();
});

app.get('/api',(req, res) => {
	// res.send('heheh');
	res.json({
		a: 'abeng'
	});
});


// app.listen(3000);
// var serverPort = process.env.PORT || 3000;
var serverPort = process.env.PORT || 3000;
app.listen(serverPort);

// 当客户端发起ajax请求不成功的时候 解决方案
// 参考网址： https://stackoverflow.com/questions/18310394/no-access-control-allow-origin-node-apache-port-issue
