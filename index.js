#! /usr/bin/env node

var gulp = require("gulp"),
	child = require("child_process"),
	shell = require("shelljs"),
	argv = require("yargs"),
	config = require("./package.json"),
	gulpfile = require("./gulpfile.js");

console.log("pf start！");

argv.command("start", "gulp start", function (yargs) {
console.log("Good Morning");
gulp.start(["default"]);
})
.command("replace","gulp replace",function(){
gulp.start(["replace"])
})
.command("hello","output hello",function(){
	console.log("output hello")
})
.argv;


	
	

