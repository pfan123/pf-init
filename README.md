### pf-init 扩展脚手架工具
pf-init 扩展脚手架工具，可以快速帮我们构建开发目录，提高开发效率，当然，我们还可以自定义扩展自己需要的命令。
目前系统默认生成的是系统快速开发express项目的目录结构：
>project
>
>  ├── bin   
>  
>	&#8195;&#8195;├── www
>
>  ├── public
>  
>	&#8195;&#8195;  ├── images
>
>	&#8195;&#8195;  ├── javascripts
>
>&#8195;&#8195;	  ├── stylesheets
>
>   ├── routes 
>   
> &#8195;&#8195; 	  ├── index.js
> 
> &#8195;&#8195; 	  ├── users.js
> 
>  ├── views
>  
>	&#8195;&#8195; ├── index.ejs 
>
>	&#8195;&#8195; ├── layout.ejs 
>
>&#8195;&#8195;	 ├── error.ejs 
>
>  ├── package.json
>  
 >  ├── app.js
	

### pf-init Install
>$ npm install pf-init

###  Instruction for use(option parsing)

>Usage： [options] [value ...]

>Commands：

>	&#8195;&#8195; init [name]    Create Project Directory

>	&#8195;&#8195; start*<*name>   Start gulp project!

>Options：

>	&#8195;&#8195; -h, --help         output usage information
>	
>	&#8195;&#8195; -v, --version      output the version number
>	
>	&#8195;&#8195; -c, --contact      contact information
>	
>&#8195;&#8195; 	-a, --author       output program author
>	
>&#8195;&#8195; 	-m, --message <string>    a string argument


目前pf-init脚手架还不是特别完善，后续将扩充自动化工程开发，欢迎拍砖！
