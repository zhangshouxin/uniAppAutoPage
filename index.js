const express = require('express')
const app = express();
const server = require('http').Server(app);
const querystring = require('querystring');
const path = require('path')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const url = require("url");
const proPath = path.resolve(__dirname, '..'); //当前项目的根目录
const template =require("./template.js")

app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}))

app.use(cookieParser());


//-------------页面路由----------------
//get       通过req.query.[key]  获取参数
//post     通过 req.body.[key]   获取参数
//拦截所有请求
app.all('/*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers','Content-Type,Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE,OPTIONS');
	//console.log("客户端访问IP地址" + req.hostname);
	var pathname = url.parse(req.url).pathname;
	//当url的ip加端口号的后1到7位为img/png时，返回以该路径下对应的png图片
	if (pathname.split(".")[1] == 'txt') {
		console.log(pathname + "-==-=-" + req.url);
		fs.readFile(pathname.substring(1), function(err, data) {
			res.writeHead(200, {
				'Content-Type': 'txt'
			});
			res.end(data);
		});
	} else {
		next();
	}
});
app.get('/test', function(req, res) {
	res.send("连接成功");
	
});
app.get('/', function(req, res) {
	template.createPage("",function(statu,msg){
		res.send(msg);
	})
	
});
/**新增拖动组件
 * @param {Object} req
 * @param {Object} res
 */
app.post('/template',function(req, res){
	template.createPage(req.body,function(statu,msg){
		res.send(msg);
	})
})
/**修改当前编辑组件
 * @param {Object} req
 * @param {Object} res
 */
app.post('/templateUpdate',function(req, res){
	template.updatePage(req.body,function(statu,msg){
		res.send(msg);
	})
})
/**删除选中的组件
 * @param {Object} req
 * @param {Object} res
 */
app.post('/templateDel',function(req, res){
	template.delPage(req.body,function(statu,msg){
		res.send(msg);
	})
})
/**清空当前页面的所有组件
 * @param {Object} req
 * @param {Object} res
 */
app.post('/clearPage',function(req, res){
	template.clearPage(req.body,function(statu,msg){
		res.send(msg);
	})
})

/**保存当前页面
 * @param {Object} req
 * @param {Object} res
 */
app.post('/savePage',function(req, res){
	template.savePage(req.body,function(statu,msg){
		res.send(msg);
	})
})
/**删除已经生成的页面
 * @param {Object} req
 * @param {Object} res
 */
app.post('/delAlaPage',function(req, res){
	template.delAlaPage(req.body,function(statu,msg){
		res.send(msg);
	})
})
//--------------页面路由---------------
server.listen(8090, function() {
	console.log('服务已启动listening on *:8090' + __dirname);
});

