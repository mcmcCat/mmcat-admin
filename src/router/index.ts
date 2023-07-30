import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

export const Layout = () => import('@/layout/index.vue');

// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue') //会经过重定向组件转发跳转路由
      }
    ]
  },

  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: { hidden: true }//这个hidden属性的值是true，意味着这个路由是隐藏的不需要在导航栏或侧边栏中显示。
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'homepage', affix: true }
      }
    ]
  }
];

/**
 * @description: 创建路由
 * @return {*}
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes as RouteRecordRaw[], // 路由表，运行时会调用 router.addRoute(route) 来添加 accessRoutes 动态路由 
});

/**
 * @description: 重置路由
 * @return {*}
 */
export function resetRouter() {
// 这样就可以强制用户返回到登录页面并进行重新认证。
  router.replace({ path: '/login' });
  location.reload(); // 重新加载页面
}

export default router;
