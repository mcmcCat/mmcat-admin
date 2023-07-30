import { defineStore } from "pinia";

import { loginApi } from "@/api/auth";
import { getUserInfo } from "@/api/user"
import { store } from "@/store";

import { LoginData } from "@/api/auth/types";
import { UserInfo } from "@/api/user/types"

import { useStorage } from "@vueuse/core";// @vueuse/core库中的 useStorage Hook 用于在Vue组件中存取数据。 它通过 localStorage 来存储和获取值。

export const useUserStore = defineStore("user", () => {
  // State
  const token = useStorage("accessToken", ""); //存储在localStorage中
  const userId = ref();
  const nickname = ref("");
  const avatar = ref("");
  const roles = ref<Array<string>>([]); // 用户角色编码集合 → 判断路由权限
  const perms = ref<Array<string>>([]); // 用户权限编码集合 → 判断按钮权限
  
  // Action

  /**
   * @description: 登录调用 --- (token,...)
   * @param {LoginData} loginData
   * @return {*}
   */
  function login(loginData: LoginData) {
    return new Promise<void>((resolve, reject) => {
      loginApi(loginData)
        .then((response) => {
          console.log('服务器响应信息:',response);
          // 将获取的token存入 localStorage
          const { tokenType, accessToken } = response.data;
          token.value = tokenType + " " + accessToken; // Bearer eyJhbGciOiJIUzI1NiJ9.xxx.xxx
          resolve(); // axios实例返回的 Promise对象被resolve()之后，即请求成功才会触发请求拦截器
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * @description: 获取用户信息 --- (用户Id、用户昵称、头像、角色集合、权限集合)
   * @return {*}
   */    
  function getInfo() {
    return new Promise<UserInfo>((resolve, reject) => {
      getUserInfo()
        .then(({ data }) => {
          console.log('获取到的用户信息：',data);
          if (!data) {
            return reject("验证失败,请重新登录！");
          }
          if (!data.roles || data.roles.length <= 0) {
            reject("getUserInfo: roles must be a non-null array!");
          }
          userId.value = data.userId;
          nickname.value = data.nickname;
          avatar.value = data.avatar;
          roles.value = data.roles;
          perms.value = data.perms;
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

   // 重置
   function resetToken() {
    token.value = "";
    nickname.value = "";
    avatar.value = "";
    roles.value = [];
    perms.value = [];
  }


  return {
    token,
    userId, // 当前用户登录Id
    nickname,
    avatar,
    roles,
    perms,
    login,
    getInfo,
    // logout,
    resetToken,

  };
});

// 非setup
export function useUserStoreHook() {
  return useUserStore(store);
}
