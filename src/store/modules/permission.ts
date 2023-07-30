import { RouteRecordRaw } from "vue-router";
import { defineStore } from "pinia";
import { constantRoutes } from "@/router";
import { store } from "@/store";
import { listRoutes } from "@/api/menu";

// import.meta.glob 是一个新的标准化功能，用于动态导入多个模块。
// 获取 views 中所有的vue组件，返回的是数组形式，每个成员为键值对
// 键值对格式 "../../views/dashboard/components/BarChart.vue" : () => import("/src/views/dashboard/components/BarChart.vue")
const modules = import.meta.glob("../../views/**/**.vue"); 

const Layout = () => import("@/layout/index.vue");


/**
 * @description: 判断用当前户拥有的权限
 * @param {string} roles 当前用户角色集合
 * @param {RouteRecordRaw} route 路由
 * @return {*}
 */
const hasPermission = (roles: string[], route: RouteRecordRaw) => {
  if (route.meta && route.meta.roles) {
    // 角色【ROOT】拥有所有权限，忽略校验 （作者提供的账号密码是具有【ADMIN】的权限，所以接口返回的都是角色【ADMIN】的路由）
    if (roles.includes("ROOT")) {
      return true;
    }
    return roles.some((role) => { //some方法返回 boolean
      if (route.meta?.roles !== undefined) {
        return (route.meta.roles as string[]).includes(role); // includes方法返回 boolean
      }
    });
  }
  return false;
};


/**
 * @description: 递归过滤有权限的异步(动态)路由
 * @param {RouteRecordRaw} routes 接口返回的所有异步(动态)路由 
 * @param {string} roles 当前用户角色集合
 * @return {*} 返回用户有权限的异步(动态)路由
 */
const filterAsyncRoutes = (routes: RouteRecordRaw[], roles: string[]) => {
  
  // 当前用户有权限的路由 asyncRoutes
  const asyncRoutes: RouteRecordRaw[] = [];
  
  routes.forEach((route) => { // 每次拿一个路由项去查看当前用户是否具有该路由项的权限，若查找到子路由需要进行递归
    const tmpRoute = { ...route }; // ES6扩展运算符复制新对象 , 复制一份路由项
    
    // 判断用户(角色)是否有该路由的访问权限
    if (hasPermission(roles, tmpRoute)) {
      // 是 Layout 则直接走查看子路由
      if (tmpRoute.component?.toString() == "Layout") { //所有一级路由的展示都有Layout组件，展示的不同只是Layout组件展示的子路由组件不同
        tmpRoute.component = Layout;
      } else {
        const component = modules[`../../views/${tmpRoute.component}.vue`]; // 判断是否存在该路由组件
        
        if (component) {
          tmpRoute.component = component; // 存在则返回该路由组件
        } else {
          tmpRoute.component = modules[`../../views/error-page/404.vue`]; //不存在则返回404页面
        }
      }
      
      if (tmpRoute.children) {
        tmpRoute.children = filterAsyncRoutes(tmpRoute.children, roles);// 有子路由则进入递归，返回子路由组成的数组
      }

      asyncRoutes.push(tmpRoute); // 由于递归，所以先push子最后push父
    }
  });
  return asyncRoutes; // 先返回子路由，最后返回一级路由组成的大数组
};




// Setup

export const usePermissionStore = defineStore("permission", () => {
  // State
  const routes = ref<RouteRecordRaw[]>([]);

  // Actions
  function setRoutes(newRoutes: RouteRecordRaw[]) {
    // 静态路由拼接上动态路由结合成一个完整的路由
    routes.value = constantRoutes.concat(newRoutes);
  }
  /**
   * 生成动态路由
   *
   * @param roles 用户角色集合
   * @returns
   */
  function generateRoutes(roles: string[]) {
    return new Promise<RouteRecordRaw[]>((resolve, reject) => {
      // 接口获取所有动态路由，不管有无权限
      listRoutes()
        .then(({ data: asyncRoutes }) => { // 解构赋值 asyncRoutes = response.data
          const accessedRoutes = filterAsyncRoutes(asyncRoutes, roles); // 从所有动态路由中filter，获取当前角色拥有访问权限的路由
          setRoutes(accessedRoutes);
          resolve(accessedRoutes);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  return { routes, setRoutes, generateRoutes };
});

// 非setup
export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
