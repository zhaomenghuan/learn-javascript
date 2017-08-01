const https = require('https');
const cheerio = require('cheerio');

function htmlparser(html){
	var baseUrl = 'https://segmentfault.com';
	
	var $ = cheerio.load(html);
	var bloglist = $('.stream-list__item');
	
	var data = [];
	
	bloglist.each(function(item){
		var page = $(this);
		var summary = page.find('.summary');
		var blogrank = page.find('.blog-rank');
		
		var title = summary.find('.title a').text();
		var href = baseUrl + summary.find('.title a').attr('href');
		var author = summary.find('.author li a').first().text().trim();
		var origin = summary.find('.author li a').last().text().trim();
		var time = summary.find('.author li span')[0].nextSibling.data.trim();
		var excerpt = summary.find('p.excerpt').text().trim();
		var votes = blogrank.find('.votes').text().trim();
		var views = blogrank.find('.views').text().trim();
		
		data.push({
			title: title,
			href: href,
			author: author,
			origin: origin,
			time: time,
			votes: votes,
			views: views,
			excerpt: excerpt
		})
	})
	
	return data;
}

https.get('https://segmentfault.com/blogs', (res) => {
	console.log('statusCode: ', res.statusCode);
  	console.log('headers: ', res.headers);
  	var data = '';
  	res.on('data', (chunk) => {
    	data += chunk;
  	});
  	res.on('end', () => {
  		// 解析源码
  		var jsondata = htmlparser(data);
  		console.log(jsondata);
  	})
}).on('error', (e) => {
  	console.error(e);
});