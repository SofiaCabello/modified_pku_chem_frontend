# DatabaseFrontend
这是一个基于[vue-admin-template](https://github.com/PanJiaChen/vue-admin-template)二次开发的数据库前端，使用了[Vue.js](https://github.com/vuejs)和[Element-UI](https://github.com/ElemeFE/element)。这是我在[郑州大学](https://www.zzu.edu.cn)2023年春季学期数据库课程的课程项目。

关于后端，请参考[DatabaseBackend](https://github.com/SofiaCabello/DatabaseBackend)。

你可以通过以下命令克隆这个项目：
```
git clone
```
克隆之后，你可以通过以下命令运行这个项目，这需要[Node.js](https://nodejs.org/en/)环境：
```
npm install
npm run dev
```
如果你无法正常运行，可能是openssl的问题。你可以尝试以下命令后在再执行`npm run dev`：
```
export NODE_OPTIONS=--openssl-legacy-provider
```