import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: '仪表盘',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '仪表盘', icon: 'dashboard' }
    }]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/database/drug',
  }
]

export const asyncRoutes = [
  {
    path: '/database',
    component: Layout,
    redirect: '/database/drug',
    name: '数据库',
    meta: { title: '数据库', icon: 'el-icon-s-help',roles: ['admin','user'] },
    children: [
      {
        path: 'drug',
        name: '试剂库',
        component: () => import('@/views/database/drug/index'),
        meta: { title: '试剂库', icon: 'table',roles: ['admin','user'] }
      },
      {
        path: 'buy',
        name: '购买申请',
        component: () => import('@/views/database/request/buy/index'),
        meta: { title: '我的申请', icon: 'table', roles: ['admin','user']}
      },
      {
        path: 'user',
        name: '用户管理',
        component: () => import('@/views/database/user/index'),
        meta: { title: '用户管理', icon: 'table' ,roles: ['admin']}
      },
      {
        path: 'dictionary',
        name: '选项管理',
        component: () => import('@/views/database/dictionary/index'),
        meta: { title: '选项管理', icon: 'table',roles: ['admin']} 
      },
      {
        path: 'approve',
        name: '申请审批',
        component: () => import('@/views/database/approve/index'),
        meta: { title: '申请审批', icon: 'table', roles: ['admin']}
      }
    ]
  },
  // {
  //   path: '/dashboard',
  //   redirect: '/dashboard/index',
  //   name: 'Dashboard',
  //   component: () => import('@/views/dashboard/index'),
  //   meta: { title: '仪表盘', icon: 'el-icon-s-help',roles: ['admin','user'] },
  //   component: Layout,
  // },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
