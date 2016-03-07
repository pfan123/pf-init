#!/usr/bin/env node

/*
 * mac 和 linux 不支持 //注释
 * 资料：https://github.com/tj/commander.js?utm_source=jobboleblog
 */

var program = require('commander'),
  path = require('path'),
  fs = require("fs"),
  readline = require('readline'),
  gulp = require("gulp"),
  gulpfile = require("./gulpfile.js"),
   _exit = process.exit,
   chalk = require("chalk"),
   exec = require('child_process').exec;
var processPath = process.cwd();

var pfData = JSON.parse(readToFile(path.join(__dirname,"config.json"),function(err){if(err)throw err}));

function range (val) {
    return val.split('..').map(Number);
}

function list (val) {
    return val.split(',')
}

/*
 * 定义参数,以及参数内容的描述
 */
program
    .version('0.0.1')
    .usage('[options] [value ...]')
    .option('-c, --contact','contact information',contact)
    .option('-a, --author','output program author',author)
    .option('-m, --message <string>', 'a string argument')
    .option('-i, --integer <n>', 'input a integet argument.', parseInt)
    .option('-f, --float <f>', 'input a float arg', parseFloat)
    .option('-l, --list <items>', 'a list', list)
    .option('-r, --range <a>..<b>', 'a range', range)

function author(){
  console.log("author@pingfan")
}

function contact(){
  console.log("@email:768065158@qq.com")
}

/*
 * 添加额外的文档描述
 */
program.on('help', function() {
    console.log('');
    console.log('  Examples: pf init projectName');
    console.log('');
    console.log('  # copyright 2015 // questions mailto：768065158@qq.com');
});

/*
 * 定义命令  []可选，<>必须 name 项目名字，模板
 */
program
.command('init [name] [temp]')
.description("Create Project Directory")
.action(function(name,temp){
  (!exit.exited) && ( main(name,temp) );
  // console.log('Deploying "%s"', name);
});

/*
 *设置依赖包路径，安装依赖包
 */
program
.command('set')
.description("Create Project Directory")
.action(function(){
  if ( fs.existsSync(path.join(processPath, 'config.json'))){
      pfPath = processPath;
  } else {
      console.error( "Error: please enter config.json path" );
      throw "error";
  }
  pfData.pfPath = pfPath;
  writeToFile(pfData,path.join(__dirname,"config.json"),function(){
    console.log(chalk.red(curTime())+ chalk.green(" 文件依赖写入成功!"));
    console.log(chalk.red(curTime())+ chalk.green(" 开始安装npm module包……"));
    exec('npm i', function (error, stdout, stderr) {
      if (error) {
        // console.log(error.stack);
        console.log(chalk.red(curTime())+ chalk.green(' 安装npm依赖模块失败Error code: ' + error.code));
        return ;
      }
      console.log(chalk.red(curTime())+ chalk.green(" 安装npm依赖模块成功"));
    });
  });
});

program
.command('start <name>')
.description('Start gulp project!')
.action(function(name){
  gulp.start(["get"]);
  console.log('Deploying "%s"', name);
});



/*返回指定文件名的扩展名称
  console.log(path.extname("pp/index.html"));
  __dirname始终指向当前js代码文件的目录
 console.log("11111:"+path.join(__dirname, '..', 'templates', "ejs/index.ejs"));
*/

/*
 * 解析commandline arguments
 */
program.parse(process.argv);

/* console.info('--messsage:')
* console.log(program.message);
*/

/*
 * 命令没有参数，输出help结果
 */
if(!process.argv[2]) {
    program.help();
} else {
    //不打印关键字
    // console.log('Keywords: ' + program.args);
}


/*
 * Main program. 脚手架主要控制方法
 */
function main(projectPath,temp) {
  temp && temp != "" ? temp : temp = "default";

  if(pfData.pfPath == undefined){
    console.log(chalk.red(curTime())+ chalk.green(" 请先pf set 设置依赖路径，安装npm包！"));
    return ;
  }else{
    if (!fs.existsSync(path.join(pfData.pfPath, 'config.json'))){
        console.log(chalk.red(curTime())+ chalk.green(" 请先pf set 设置正确的依赖路径，安装npm包！"));
        return ;
    }
  }

  /* Path  如果输入空的参数，则默认为当前目录 获取第一个参数
  *var destinationPath = program.args.shift() || '.',
  */
  var destinationPath = projectPath || '.',
      // sourcePath = path.join(__dirname, '.', 'templates');
      sourcePath = path.join(pfData.pfPath, '.', 'templates/'+temp);

  /*
   * App name  path.resolve(opt)生成当前路径/opt
  */
  var appName = path.basename(path.resolve(destinationPath));

  /*
    Template engine
   */
  program.template = 'ejs';
  if (program.ejs) program.template = 'ejs';
  if (program.hogan) program.template = 'hjs';
  if (program.hbs) program.template = 'hbs';

  /*
   * Generate application
  */
  emptyDirectory(destinationPath, function (empty) {
    if (empty || program.force) {
      complete();
      mkdir(sourcePath,destinationPath,copyFile);
     /*
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

 /*
  * var wait = 5;
  */
  function complete() {
     /*
      ** if (--wait) return;
     */
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

/*
 * Determine if launched from cmd.exe
 */

function launchedFromCmd() {
  return process.platform === 'win32'
    && process.env._ === undefined;
}

/*
 * Graceful exit for async STDIO
 */

function exit(code) {
  /* flush output for Node.js Windows pipe bug
  * https://github.com/joyent/node/issues/6247 is just one bug example
  * https://github.com/visionmedia/mocha/issues/333 has a good discussion
   */
  function done() {
    if (!(draining--)) _exit(code);
  }

  var draining = 0;
  var streams = [process.stdout, process.stderr];

  exit.exited = true;

  streams.forEach(function(stream){
    /*
    * submit empty write request and wait for completion
    */
    draining += 1;
    stream.write('', done);
  });

  done();
}

/*
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


/*
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


/*
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
            if(filename == ".DS_Store"){return;}
            fs.stat(url,function(err, stats){
                if (err) throw err;
                if(stats.isFile()){
                   /*
                    *匹配到package.json改name字段
                   */
                   if(/package\.json/.test(url)){
                      var name = "";
                      (!process.argv[3]) ? name="pfan" : name = process.argv[3]
                      var packData = JSON.parse(readToFile(url));
                      packData.name = name;
                    	packData = JSON.stringify(packData,null, "\t");
                      fs.writeFileSync(dest,packData,'utf8');
                   }else{
                      /*创建读取流*/
                      readable = fs.createReadStream(url);
                      /*创建写入流 */
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


/*
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


/*
 * [writeToFile description]
 * @param  {[type]} data [数组数据列表]
 * @param  {[type]} path [写入的路径]
 */
 function writeToFile(data,path,calllback){
 	var data = JSON.stringify(data,null, "\t");
 	fs.writeFile(path,data,"utf-8",function(err){
 		if(err) throw err;
 		calllback && calllback();
 	});
 }

 /*
 * [readToFile 读取文件]
 * @param  {[type]} path [读取路径]
 */
function readToFile(path,calllback){
	var data = fs.readFileSync(path,'UTF-8');
	calllback && calllback();
	return data;
}


/*
 * [curTime 生成当前时间 例［2016-03-07 19:00:00］]
 * @return {[type]} [description]
 */
function curTime() {
    var date = new Date();
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    return "["+date.getFullYear() + "-" + month + "-" + currentDate+" "+hh + ":" + mm+"]";
    //返回格式：yyyy-MM-dd hh:mm
}
