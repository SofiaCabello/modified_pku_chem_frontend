# DatabaseFrontend
中文请参考[README-zh.md](./README-zh.md)\
This is a secondarily developed database frontend based on the [vue-admin-template](https://github.com/PanJiaChen/vue-admin-template), which applies the [Vue.js](https://github.com/vuejs) and [Element-UI](https://github.com/ElemeFE/element). It is my course project of the DB course of the 2023 Spring Semester of [ZZU](http://www.zzu.edu.cn/).

For the backend, please refer to [DatabaseBackend](https://github.com/SofiaCabello/DatabaseBackend).

You can clone this project by the following command:
```
git clone https://github.com/SofiaCabello/DatabaseFrontend.git
```
After cloning, you can run the project by the following command, which requires [Node.js](https://nodejs.org/en/) environment:
```
npm install
npm run dev
```
If you cannot run it properly, perhaps there is a problem with openssl. You can try the following command before you run `npm run dev` again:
```
export NODE_OPTIONS=--openssl-legacy-provider
```
