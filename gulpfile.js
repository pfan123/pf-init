//	js/app.js：指定确切的文件名。
//	js/*.js：某个目录所有后缀名为js的文件。
//	js/**/*.js：某个目录及其所有子目录中的所有后缀名为js的文件。
//	!js/app.js：除了js/app.js以外的所有文件。
//	*.+(js|css)：匹配项目根目录下，所有后缀名为js或css的文件。


//引入gulp插件node模块
var gulp = require('gulp');


	gulp.task("get",function(){
		console.log("node命令开发")
	});

