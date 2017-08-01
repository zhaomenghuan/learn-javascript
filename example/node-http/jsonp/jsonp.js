var http = require('http'); // 提供web服务
var url = require('url');	// 解析GET请求
  
var data = {
	'name': 'zhaomenghuan', 
	'age': '22'
};
  
http.createServer(function(req, res){  
	console.log(req.url);
	var params = url.parse(req.url, true);  
	console.log(params);
	// 查询参数
	if(params.query){
		// 根据附件条件查询
		if(params.query.userid === 'xiaoqingnian'){
			// 判断是否为jsonp方式请求，若是则使用jsonp方式，否则为普通web方式
			if (params.query.callback) {  
				var resurlt =  params.query.callback + '(' + JSON.stringify(data) + ')';
				res.end(resurlt);
			} else {  
				res.end(JSON.stringify(data));
			}
		} 
	}      
}).listen(8888);