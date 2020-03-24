#  									skyCMS

​    																					![sky-cms](https://www.travis-ci.org/1912820899/skyCMS.svg?branch=master)


## 一、这是一个什么项目？

https://www.travis-ci.org/1912820899/skyCMS.svg?branch=master
基于Node.js Koa2 Vue SSR mongodb的一套博客网站，后台管理系统使用SPA前后端分离，前台拥有2套代码，使用Vue SSR构建和常规前后端分离构建。

博客线上地址是：http://www.9cka.cn

## 二、项目包含什么功能？

**2.1.  Node.js Koa2服务端 API**

	✅文章管理功能
	
	✅分类管理功能
	
	✅图片上传功能

**2.2. 博客前端展示采用2套代码实现**

- Vue SSR 服务器渲染
- Vue.js 前后端分离

**2.3. 后台管理系统**

	✅使用Vue.js Element ui 搭建的后台管理系统

**2.4. 优点**

- Ko2框架小巧强大
- MongoDB 是一个基于分布式文件存储的数据库，对JS奇效
- 使用webpack优化打包，gizp代码压缩，访问速度快，文件小
- ...

**2.5. 知识点**

- 服务端：Node.js Koa2 MongoDB 
- 前端服务端渲染：Vue-SSR  Ant Design Koa2 Vuex
- 前端SPA：Vue.js  Ant Design
- mongodb的简易封装
- webpack 打包优化
- 非常适合 想学习vue-ssr  koa2 mongodb的小伙伴 ，相信你一定能学到一些东西

## 三、如何在本地使用？

**3.1 克隆项目**

```shell
#克隆项目代码
$ git clone https://github.com:1912820899/skyCMS.git
```

**3.2  启动服务端**

```shell
#进入项目根目录
cd skyCMS 
#安装依赖
$ npm install
#启动koa2 服务端
$ npm start
```

**3.3 启动mongdb**

```shell
#mongodb 环境需要自己配置
$ mongodb
```

3.4启动前端vue ssr项目

```shell
#进入vue ssr项目根目录
$ cd antd-ssr
#安装依赖
$ npm install
#运行项目
$ npm run build
```

**3.5 启动前端SPA项目**

```shell
#进入前端 vue spa项目根目录
$ cd antd 
#安装依赖
$ npm install
#运行项目
$ npm run dev
```

**3.6 启动后台**

```shell
#进入views项目根目录
$ cd views 
#安装依赖
$ npm install
#运行项目
$ npm run dev
```

## last

如果喜欢或者对你有帮助，请点一个星星star 鼓励我，如果有更好的建议和意见，可以留言issues。
