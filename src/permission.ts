import router from "@/router";
import { useUserStoreHook } from "@/store/modules/user";
import { usePermissionStoreHook } from "@/store/modules/permission";

import NProgress from "nprogress";
import "nprogress/nprogress.css";
NProgress.configure({ showSpinner: false }); // 进度条是否显示旋转的小圆圈

const permissionStore = usePermissionStoreHook();

// 白名单路由
const whiteList = ["/login"];

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  const hasToken = localStorage.getItem("accessToken");
  if (hasToken) {
    if (to.path === "/login") { 
      // 已登录且想去登录页 "/login" 则直接跳转首页 "/"
      next({ path: "/" });
      NProgress.done();
    } else { 
      // 已登录且想去除了登录页（白名单）的页面，则查看当前用户的角色（判断路由权限）
      const userStore = useUserStoreHook();
      /*
        查看当前用户角色是否被存储在了store中
        if(存储了){
          直接匹配对应的路由
        }else{
          没有存储，则获取并且存储当前用户的角色信息，然后生成该角色对应的动态路由 
        } 
      */
      const hasRoles = userStore.roles && userStore.roles.length > 0; // if([])判断为true所以要 &&运算
      if (hasRoles) {
        if (to.matched.length === 0) { // to.matched 是一个数组，包含了当前路由 to 匹配到的所有 route（从根路由开始匹配）
          // 有角色，但未匹配到任何路由，此前访问过路由则跳转上一个路由，此前无访问路由则跳转"/404"
          from.name ? next({ name: from.name }) : next("/404");
        } else {
          
          // 有角色，且匹配到路由，直接放行
          next();
        }
      } else {
        // 没有角色，则获取当前用户的角色信息
        try {
          const { roles } = await userStore.getInfo();
          // 根据用户的角色，做动态路由权限功能
          // 生成动态路由即生成可进入的路由 accessRoutes
          const accessRoutes = await permissionStore.generateRoutes(roles);
          console.log(accessRoutes);
          
          accessRoutes.forEach((route) => {
            router.addRoute(route); // 向路由实例的路由表添加动态路由对象
          });
          
          next({ ...to, replace: true }); //...to 主要是为了把 path 解构出来, replace是手动给路由对象指定跳转模式
        } catch (error) {
          /*
           catch在两种情况下会被执行：
            1. 在使用 await 关键字调用 userStore.getInfo() 方法时，该方法可能会因为某些错误而抛出异常，例如用户未登录、用户信息验证失败等。
            2. 在使用 await 关键字调用 permissionStore.generateRoutes(roles) 方法生成动态路由时，该方法可能抛出错误，例如权限验证失败、路由配置错误等。
            该错误处理逻辑通过调用 next('/login?redirect=${to.path}') 将用户导航到登陆页面，并携带一个 redirect 参数来指示用户在登陆后要跳转到的页面路径。
          */ 
          // 移除 token 并跳转登录页
          await userStore.resetToken();
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    // 未登录可以访问白名单页面
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      // 登录后token过期或者token被删除等情况
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
