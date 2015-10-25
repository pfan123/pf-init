//	js/app.js：指定确切的文件名。
//	js/*.js：某个目录所有后缀名为js的文件。
//	js/**/*.js：某个目录及其所有子目录中的所有后缀名为js的文件。
//	!js/app.js：除了js/app.js以外的所有文件。
//	*.+(js|css)：匹配项目根目录下，所有后缀名为js或css的文件。


//引入gulp插件node模块
var gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	//gminifycss = require('gulp-minify-css'),
	compass = require("gulp-compass"),
	jshint = require('gulp-jshint'),
	sourcemaps = require('gulp-sourcemaps'),
	mincss = require('gulp-mini-css'),
	connect = require('gulp-connect'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	concat = require('gulp-concat'),
	livereload = require('gulp-livereload'),
	notify = require('gulp-notify'),
	cache = require('gulp-cache'),				// 缓存通知
	watch = require('gulp-watch'),
	mozjpeg = require('imagemin-mozjpeg'),
	pngquant = require("imagemin-pngquant"),
	fileList = require('gulp-filelist'),      //生成文件列表
	revHash = require('gulp-rev-hash'),     //生成引入资源时间戳
	pfan = require('gulp-pfan'),            //自定义插件
	ftpEnv = require('gulp-ftp-env'),
	sftp = require('gulp-sftp'),
	replace = require("gulp-pf-replace"), //替换规则
	gutil = require('gulp-util');


	//替换方法
	function ypReplace(data){
	  return data.replace(/helloword/,"123")  
	}	
	
	gulp.task("replace",function(){
		return gulp.src("./tianzun/*.+(html|htm)",{buffer: true})
            .pipe(replace(ypReplace))
            .pipe(gulp.dest("./out"));
	});
	
	
	
	/*配置path路径变量*/
	var paths = {
			// static:{
			// 	scripts: './pfan/JD/js',
			// 	img: './pfan/JD/images',
			// 	css:'./pfan/JD/css',
			// 	scss:'./pfan/JD/scss',			
			// 	html:'./pfan/JD'			
			// },
			// compress:{
			// 	scripts: './compress/JD/js',
			// 	img: './compress/JD/images',
			// 	css:'./compress/JD/css',
			// 	scss:'./compress/JD/scss',
			// 	html:'./compress/JD'			
			// }
			
			//pc版

			static:{
				scripts: 'pc/js/cloud',
				img: 'pc/img/cloud',
				css:'pc/css/cloud',
				scss:'pc/css/cloud',			
				html:'pc/html/cloud'			
			},
			compress:{
				scripts: 'pc/js/cloud/compjs',
				img: 'pc/img/cloud/imagemin',
				css:'pc/css/cloud/mincss',
				scss:'pc/css/cloud',
				html:'pc/html/cloud'			
			}				
	};
	//Gulp 仅有 5 个方法就能组合出你需要的任务流程：task, run, watch, src, dest
	
	gulp.task("pfan",function(){
		console.log("大家好");
		pfan("你大爷的");
	});	

	// 定义web模块,类似于全局的http-server
	gulp.task('http-server', function() {
		connect.server({
			livereload: true,
			port:8080
		});
	});
	
	//gulp.task(name, fn)gulp模块的task方法，用于定义具体的任务。它的第一个参数是任务名，第二个参数是任务函数。
	//uglify对代码进行混淆
	gulp.task('uglify',function(){
	
		//gulp.src(glob)返回了一个可读的stream，如此行返回了./js/*.js下的全部
		gulp.src(paths.static.scripts+'/*.js')
			.pipe(uglify())
			 //gulp.dest(glob)返回一个可写的stream，如此行是将文件流写入到 ./dist/js 里的对应路径下			
			.pipe(gulp.dest(paths.compress.scripts))
			//.pipe(notify({message:'可以了 ok !'}))
	});
	
	//压缩样式
	gulp.task('mincss',function(){
		gulp.src(paths.static.css+'/*.css')
			.pipe(mincss())
			.pipe(rename(function(path){
				//patch.dirname += "/pfan";  //目录名
				path.basename += ".min";     //文件名，不带扩展路径
				//path.extname = ".css";   //扩展名
			}))			
			.pipe(gulp.dest(paths.compress.css))
	});
	
	//输出文件列表
	gulp.task('filelist',function(){
	  gulp.src(['./pfan/JD/css/*.{scss,css}', './pfan/JD/images/*.{png,jpg}'])
		  .pipe(fileList('filelist.json'))
		  .pipe(gulp.dest('out'))
	})
	
	//生成引入资源时间戳
	gulp.task('revhash', function () {
	    gulp.src(paths.static.html+"/*.html")
	        .pipe(revHash({assetsDir:'pc/css/cloud/'}))
	        .pipe(gulp.dest(paths.compress.html+"/rev"));
	});

	// 创建Compass任务
	gulp.task('compass', function() {
		//这里不能设置./JD/scss/不然会报样式不在sass驱动下，是由于sass工程导致的
		gulp.src(paths.static.scss+'/*.{scss,sass}')
			.pipe(compass({
				config_file: 'pc/config.rb',
				style:'nested',   //输出样式的形式 默认为nested expanded扩展 compact紧密 compressed压缩
 				comments: false,
				//import_path:true,
				sourcemap:true,
				relative:true,    //这里设置为true表示用相对路径，flase表示用绝对路径
				css: paths.static.scss,
				sass: paths.static.scss,
				image: paths.static.img
			})).pipe(gulp.dest(paths.compress.css));//输出到指定路径,可以不用输出
	});	
	
	//编译sass,可以用sass编译，则不受compass驱动文件限制
	gulp.task("sass",function(){
		gulp.src(paths.static.scss+'/*.{scss,sass}')
			.pipe(sourcemaps.init())
			.pipe(sass())
			.pipe(mincss())
			.pipe(sourcemaps.write('/'))
			.pipe(gulp.dest(paths.compress.scss))
	});
	
	//检查js
	gulp.task("jshint",function(){
		gulp.src(paths.static.scripts+"/*.js")
			.pipe(jshint())
			.pipe(jshint.reporter('default')); //导入到模块任务里面
	});
	
	// 合并、压缩文件
	gulp.task('scripts', function() {
		gulp.src(paths.static.scripts+'/*.js')
			.pipe(concat('all.js'))
			.pipe(gulp.dest(paths.compress.scripts))
			.pipe(rename(function(path){
				//patch.dirname += "/pfan";  //目录名
				path.basename += ".min";     //文件名，不带扩展路径
				//path.extname = ".css";   //扩展名
			}))
			.pipe(uglify())
			.pipe(gulp.dest(paths.compress.scripts))
			//.pipe(livereload())
	});	
	
	//压缩图片
	gulp.task('imagemin',function(){
		gulp.src(paths.static.img+'/*.*')
			//定义 PNG 图片优化水平
			.pipe(imagemin({optimizationLevel: 3,
							progressive: true,
							svgoPlugins: [{ removeViewBox: false }],
							use: [mozjpeg(),pngquant()]}))
			.pipe(gulp.dest(paths.compress.img))
			//.pipe(notify({message:'compress ok !'}))
	});
	
	// 检测HTML变化并刷新
	gulp.task("html",["css"],function(){
		//gulp.src('*.*')  此句会导致检测全部,有个问题就是，新增的文件要重新启动命令，会损耗性能
		gulp.src(paths.static.html+'/*.*')
			.pipe(livereload());		
	});
	
	// 检测HTML变化并刷新
	gulp.task("css",function(){
		//gulp.src('*.*')  此句会导致检测全部,有个问题就是，新增的文件要重新启动命令，会损耗性能
		gulp.src(paths.static.css+'/*.css*')
			.pipe(livereload());		
	});	
	
	//定义名为"watch"的任务
//	gulp.task('watch',function(){
//		gulp.watch('*.*');
//		gulp.watch(paths.static.html+'**/*.*');
//		gulp.watch(paths.static.html+'**/*.js',['scripts']);
//		gulp.watch(paths.static.html+'**/*.css',['mincss']);
//		gulp.watch(paths.static.html+'**/*.scss',['compass']);
//		gulp.watch(paths.static.images+'/*.*',['imagemin']);
		//livereload.listen();
//		console.log(11);
	//	gulp.run('compass', 'jshint', 'html','imagemin','scripts');
//	});
	
	
	
	//每个gulpfile.js里都应当有一个dafault任务，它是缺省任务入口（类似C语言的main()入口），运行gulp的时候实际只是调用该任务（从而来调用其它的任务）
	gulp.task('default',function(){
		 //gulp.run(tasks)表示运行对应的任务，这里表示执行名
		//gulp.run('http-server','uglify','imagemin','sass','html');
		gulp.run('http-server','uglify','imagemin','html');
		
		// 启动变化刷新
		livereload.listen(35729,function(){});
		
		// 监听文件变化
		gulp.watch([
			paths.static.html+'/*.*', 
			paths.static.css+'/*.*', 
			paths.static.scss+'/*.*', 
			paths.static.images+'/*.*',
			paths.static.scripts+'/*.js'], function() {
			console.log("开启了watch监听任务");
			//gulp.run('sass','imagemin','html','scripts','uglify');
			gulp.run('html');
		});		
	});
//gulp.task('default',['http-server','imagemin','compass','watch']);

	gulp.task('ftp', function() {   
		return gulp.src('src/**')   
			  .pipe(ftpEnv({   
				"host": "123.108.109.205",   
				"port": "21",   
				"user": "pfan5",   
				"pass": "GL2243011769",   
				"remotePath": "/pfan5/db/",  
				//设置版本占位符 
				"version":"none" 
				//关键字数组，发布时自动替换  
				//"keywords":[{"before":"51ping.com","after":"dianping.com"}]
			}));    
	});  

	gulp.task('sftp', function () {
		return gulp.src('pfan/JD/resource/fd/promote/201505/gwq_v3/css/hello.txt')
			.pipe(sftp({
				"host": '192.168.145.37',
				"user": 'wxsq_dev',
				"pass": 'wxsq_dev',
				"port":"22",
				"remotePath": "/export/wxsq/resource/fd/promote/201505/gwq_v3/css/",
			}));
	});

	gulp.task("get",function(){
		console.log("node命令开发")
	});

