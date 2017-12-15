var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server); // 创建IO对象后 客户端访问服务器 即可获得http://localhost:3000/socket.io/socket.io.js的文件

var session = require('express-session');
// 设置session基本配置
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true/*,
  cookie: { secure: true }*/
}));

/*app.set('view engine','ejs');
app.use(express.static('./views'));*/



// io在服务器端监听连接事件 客户端一旦连接服务器发送http协议 就会自动转化成tcp协议 类似QQ的协议 
io.on('connection', function(socket){
	// console.log(socket);
	socket.on('question', (message) => {
		console.log('客户端第一次请求：' + message);
		// socket.emit('answer', 'chile' + message); // 非广播模式
		io.emit('answer', 'chile' + message); // 广播模式
		socket.on('question2', (message) => {
			console.log('客户端第一次请求：' + message);
		});
	})
});


// 增加一个中间件 设置访问权限 'Access-Control-Allow-Origin', 'http://localhost:8080' 只允许 'http://localhost:8080'访问
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
	// res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Credentials', true);
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	next();
});

// 增加一个中间件 第一次连接 读取session是否有login值是否为true 如果为true 就读取session的username值 返回给浏览器
// 如果第一次连接 读取session是否有login值为空 则给其session设置一个随机的值返回给浏览器
// 设置session值

app.get('/api', (req, res) => {
	// 检查是否登录
	if (req.session.name) {
		// 如果登录了 就设置sendData的sessionName为之前设置好的session的username
		res.send(req.session.name);
	}else{
		// 如果没有登录 就设置session值为一个随机数 注意转化成字符串 随机数为四位小写字母加上四位随机数字组成
		req.session.name = getRandomName();
		console.log('不存在 重新设置');
		res.send('data' + req.session.name);
	}
});


app.get('/getsession', (req, res) => {
	var data = req.session.name;
	console.log(data);
	res.send(data);
});


app.get('/',function(req,res){
	console.log(req.session.name);
	if (req.session.login=='1') {
		res.send('welcome'+req.session.name);
	}else{
		res.send(req.session.login);	
	}
	
})

app.get('/login',function(req,res){
	if (!req.session.name) {
		req.session.login='1';
		req.session.name=getRandomName();		
	}

	res.send('login in success ' + req.session.name);
});


server.listen(3000);

// 产生一个随机数
function getRandomName () {
	var randomName = ''
	for (var i = 0; i < 4; i++) {
		randomName += String.fromCharCode(97 + Math.ceil(Math.random() * 25));
	}
	return randomName + (Math.random() + '').slice(-5, -1);
}
