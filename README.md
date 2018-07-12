基于React打造画廊
====
项目概览
--
 * 预览地址：https://manuzs.github.io/react-gallery/
 * 根据慕课网 Materliu老师的在线课程 React实战--打造画廊应用
 
 项目下载运行：
 ---
 1、下载项目：git clone git@github.com:manuzs/react-gallery.git
 2、下载依赖：进入到react-gallery目录，命令行运行npm install
 3、运行： npm start即可在http://localhost:8000上查看
 
 总结一下：
 ---
 1、该项目与课程上的有些差别，项目使用的是最新版的React（16），很多react的写法与课程上的差别很大；其中课程中的webpack.config.js在项目中在cfg文件下的default.js。
 2、另外老师在查找DOM时有用到React.findDOMNode这个方法，但是没有说明首先需要在Main.js文件中import ReactDOM form 'react-dom';然后才使用ReactDOM.findDOMNode()。
 3、运行命令可在package.json中查看相应的命令
 
 发布项目到gh-pages
 =====
 1、git步骤命令(运行命令前需要打包dist，运行npm run dist即可打包)
  * git add dist
  * git commit -m "add dist"
  * git subtree push --prefix=dist origin gh-pages
 2、成功发布到gh-pages,打开gh-pages的预览地址，发现无法打开网页，app.js找不到。 解决方法： - 修改default.js中的publicPath:'/assets' 为：  `publicPath:'assets'改为相对路径.
  - 修改index.html中的
    ```
       `<script type="text/javascript" src="/assets/app.js"></script>`
        为：`<script type="text/javascript" src="assets/app.js"></script>` 
    ```
    - 再重新运行上面列出的git步骤命令即可。
 3、app.js找到之后，却又发现图片都找不到404了。我们在package.json文件中的scripts可以看到：
 "serve:dist": "node server.js --env=dist",
  "dist": "npm run copy & webpack --env=dist",
  "copy": "copyfiles -f ./src/index.html ./src/favicon.ico ./src/images ./dist",
这三个脚本命令，老师课程上说的grunt serve:dist 实际就是 "serve:dist" ，输入 npm run serve:dist。
 
