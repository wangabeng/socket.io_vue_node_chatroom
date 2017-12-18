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
/*const socketArr = {};
var i = 0;*/
var sessionList = [];
var socketObj = {};

// var nsp = io.of('/my-namespace');
io.on('connection', function(socket){
	// 记录当前的socket 每次连接进来一个客服端产生的这个socket 都有一个唯一的id属性 即便没有发送消息 一旦连接 就会产生
	socketObj[socket.id] = socket;
	
	// console.log(socketObj);

	var setSessionId = true;

	socket.on('question', (message) => {
		// console.log('客户端第一次发问：' + message);
		// 设置sessionList各个元素的id值 利用messge
		// 设置一次sessionList的sessionName值为message.sayer这个元素的sessionId属性
		if (setSessionId) {
			for (var i = 0; i < sessionList.length; i++) {
				if (sessionList[i].sessionName === message.sayer) {
					sessionList[i].sessionId = message.id;
					// 关闭设置开关setSessionId
					setSessionId = false;
					// console.log('yes', sessionList[i].sessionId);
					break;
				}
			}
		}

		for (var key in socketObj) {
			socketObj[key].emit('answer', message);
		}
		// sokt.emit('answer', message); // 非广播模式
		// io.emit('answer', message); // 广播模式
	});

	// 监听 浏览器的createUser
	socket.on('createUser', (message) => {
		io.emit('createUserAnswer', message); // 广播模式
	});

	socket.on('disconnect', () => {
		// console.log('disnect', socket.id, sessionList);

		// 然后从sessionList 中删除id为当前socket.id的元素
		for (var i = 0; i < sessionList.length; i++) {
			if (sessionList[i].sessionId === socket.id) {
				sessionList.splice(i, 1);
				// console.log(sessionList);
				io.emit('userLeave', 'userLeave');
				break;
			}
		}
	});

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
		// 判断是否是第二次登录 如果是第二次登录 此时session存在 如果之前关闭流量拿起了 虽然session存在 但是 这个session已经从sessionList 中删除了 所以此时要把这个session值再添加到中
		for (var i =0; i < sessionList.length; i++) {
			if (sessionList[i].sessionName === req.session.name) {
				break;
			}
			if (i === sessionList.length-1) {
				// 此时说明没有找到
				sessionList.push({
					sessionName: req.session.name,
				});
				console.log(sessionList);
				// 如何让客户端重新刷新sessionList 数据
				io.emit('relogin', {
					userList: sessionList
				})
			}
		}	

		// 如果登录了 就设置sendData的sessionName为之前设置好的session的username
		res.send(req.session.name);
	}else{
		// 如果没有登录 就设置session值为一个随机数 注意转化成字符串 随机数为四位小写字母加上四位随机数字组成
		req.session.name = getRandomName();
		// sessionList.push(req.session.name);
		// 把sessionList变成一个对象
		sessionList.push({
			sessionName: req.session.name,
		});
		console.log('不存在 重新设置', sessionList);
		res.send(req.session.name);
	}
});

// 获取sessionList用户列表 每次有人发言 就请求一次
app.get('/getUserList', (req, res) => {
	// 遍历sessionList
	res.send({
		userList: sessionList
	});
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

// 一对一单独聊天的解决方法
// 比如有用户a 用户b 客服o
// 如果a 联系客服o 则在服务器端创建一个对象{aXX: a的socket, oxx, o的socket} 遍历此对象的socket 然后发送消息即可