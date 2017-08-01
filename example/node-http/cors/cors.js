var http = require("http");	// 提供web服务
var query = require("querystring");	// 解析POST请求

http.createServer(function(req,res){
  	// 报头添加Access-Control-Allow-Origin标签，值为特定的URL或"*"(表示允许所有域访问当前域)
  	res.setHeader("Access-Control-Allow-Origin","*");
  	
  	var postdata = '';
    req.addListener("data",function(chunk){
        postdata += chunk;
    })

    // POST结束输出结果
    req.addListener("end",function(){
    	console.log(postdata); 	
        // 将接收到的字符串转换位为json对象
        var params = query.parse(postdata);
        if(params.userid == 'xiaoqingnian'){
        	res.end('{"name":"zhaomenghuan","age":"22"}');
        }
    })
}).listen(8080);