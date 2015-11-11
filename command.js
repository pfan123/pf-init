#! /usr/bin/env node

var shell = require("shelljs"),
	argv = require("yargs"),
	path = require('path'),
	fs = require('fs'),
	readline = require('readline'),
	child = require("child_process"),
	gulp = require("gulp"),
	config = require("./package.json"),
	gulpfile = require("./gulpfile.js"),
	 _exit = process.exit; 




function init(yargs){
	var arguments = yargs.argv._;
  /**
   * 获取输入的第二个参数
   */
	var destinationPath = arguments[1] || '.',
  	    sourcePath = path.join(__dirname, '.', 'templates');

     /**
      * App name  path.resolve(opt)生成当前路径/opt
      */
 	 var appName = path.basename(path.resolve(destinationPath)); 

    /**
     * Generate application
     */
	  emptyDirectory(destinationPath, function (empty) {
	    if (empty) {
	      complete();
	      mkdir(sourcePath,destinationPath,copyFile);
       /**
        * copyFile(sourcePath,destinationPath)
        */
	    } else {
        /**
         * 提示文件路径是否为空，继续是否  
         */
	      confirm('destination is not empty, continue? [y/N] ', function (ok) {
	        if (ok) {
	          complete();
	          process.stdin.destroy();
	          copyFile(sourcePath,destinationPath);
	        } else {
	          console.error('aborting');
	          exit(1);
	        }
	      });
	    }
	  });

 /* var wait = 5;*/
  function complete() {
	   /* if (--wait) return;*/
	    var prompt = launchedFromCmd() ? '>' : '$';

	    console.log();
	    console.log('   \033[36minstall dependencies:\033[0m');
	    console.log('     %s cd %s && npm install', prompt, appName);
	    console.log();
	    console.log('   \033[36mrun the app:\033[0m');

	    if (launchedFromCmd()) {
	      console.log('     %s SET DEBUG=%s:* & npm start', prompt, appName);
	    } else {
	      console.log('     %s DEBUG=%s:* npm start', prompt, appName);
	    }

	    console.log();
  }	   	    
}


/**
 * [定义命令]
 * @param  {[type]} 第一个参数，命令
 * @param  {[type]} 第二个参数，描述
 * @param  {[type]} 第二个参数，回调函数
 */
argv.command("init","Create Project Directory",init)
	.command("start", "gulp start", function (yargs) {
		console.log("Good Morning");
		gulp.start(["get"]);
	})
	.command("replace","gulp replace",function(){
		gulp.start(["get"])
	})
	.command("hello","output hello",function(){
		console.log("output hello")
	})

.usage('Usage: pf [options]')
.example('pf init projectname', 'create a new project')
.help('h')
.alias('h', 'help')
.epilog('copyright 2015 // questions mailto: 768065158@qq.com')
.argv;



/**
 * Determine if launched from cmd.exe
 */

function launchedFromCmd() {
  return process.platform === 'win32'
    && process.env._ === undefined;
}

/**
 * Graceful exit for async STDIO
 */

function exit(code) {
  /*
    *flush output for Node.js Windows pipe bug
    *https://github.com/joyent/node/issues/6247 is just one bug example
    *https://github.com/visionmedia/mocha/issues/333 has a good discussion
   */
  function done() {
    if (!(draining--)) _exit(code);
  }

  var draining = 0;
  var streams = [process.stdout, process.stderr];

  exit.exited = true;

  streams.forEach(function(stream){
    /** submit empty write request and wait for completion */
    draining += 1;
    stream.write('', done);
  });

  done();
}

/**
 * [confirm Prompt for confirmation on STDOUT/STDIN]命令窗口，关闭和结束进程
 * @param  {[type]}   msg      [description]
 * @param  {Function} callback [description]
 */
function confirm(msg, callback) {
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question(msg, function (input) {
    rl.close();
    callback(/^y|yes|ok|true$/i.test(input));
  });
}

/**
 * [confirm Prompt for confirmation on STDOUT/STDIN]命令窗口，关闭和结束进程
 * @param  {[type]}   msg      [description]
 * @param  {Function} callback [description]
 */
function confirm(msg, callback) {
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question(msg, function (input) {
    rl.close();
    callback(/^y|yes|ok|true$/i.test(input));
  });
}


/**
 * [emptyDirectory  Check if the given directory `path` is empty.]
 * @param  {[type]}   path [description]
 * @param  {Function} fn   [description]
 */
function emptyDirectory(path, fn) {
  fs.readdir(path, function(err, files){
    if (err && 'ENOENT' != err.code) throw err;
    fn(!files || !files.length);
  });
}


/**
 * [copyFile 拷贝文件]
 * @param  {[type]}   sourcePath 输入路径
 * @param  {[type]}   destinationPath 目标路径
 */
function copyFile(sourcePath,destinationPath){
    fs.readdir(sourcePath,function(err,files){
        if(err){console.log(err);return;}
        files.forEach(function(filename){
            var url = path.join(sourcePath,filename),
                dest = path.join(destinationPath,filename);
            fs.stat(url,function(err, stats){
                if (err) throw err;
                if(stats.isFile()){
                   /**匹配到package.json改name字段*/
                   if(/package\.json/.test(url)){
                      var name = "";
                      (!process.argv[3]) ? name="pfan" : name = process.argv[3]
                      var str = fs.readFileSync(url,'utf8').replace(/"name"\: "test"/,'"name": "'+name+'"');
                      fs.writeFileSync(dest,str,'utf8');
                   }else{                   
                      /*创建读取流*/
                      readable = fs.createReadStream(url);
                      /*创建写入流*/ 
                      writable = fs.createWriteStream(dest,{ encoding: "utf8" });
                      readable.pipe(writable);
                   }
                    console.log('   \033[36mcreate\033[0m : ' + dest);
                }else if(stats.isDirectory()){
                    mkdir( url, dest, copyFile );
                }
            });
        });
    });	
}


/**
 * [mkdir 写入文件夹同步，如果存在则提示]  
 * @param  {[type]}   sourcePath 输入路径
 * @param  {[type]}   destinationPath 目标路径
 * @param  {Function} fn   
 */
function mkdir(sourcePath,destinationPath,fn){
  if(fs.existsSync(destinationPath)){
	    console.log('   \033[36mno create,file exist path\033[0m : ' + destinationPath);
	    fn && fn(sourcePath,destinationPath);
  }else{ 	
	fs.mkdir(destinationPath,0755,function(err){
		if(err) throw err;
		console.log('   \033[36mcreate\033[0m : ' + destinationPath);
   		fn && fn(sourcePath,destinationPath);
	});
  }
}


