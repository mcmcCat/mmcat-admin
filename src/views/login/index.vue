<template>
  <h1>login页面</h1>
  <el-button @click="handlerLogin">登录</el-button>
</template>

<script setup lang="ts">
// 状态管理依赖
import { useUserStore } from "@/store/modules/user";

// API依赖
import { LoginData } from "@/api/auth/types";
import { LocationQuery, LocationQueryValue, useRoute } from "vue-router";

import router from "@/router";

const userStore = useUserStore();
const route = useRoute();

const loginData = ref<LoginData>({
  username: "admin",
  password: "123456",
});


function handlerLogin() {
  userStore
    .login(loginData.value)
    .then(() => {
      /* 
        处理登录路由传参的情况
        即 /login?redirect=/dashboard 的情况，对参数进行处理，并且在登录后跳转到参数给的路由地址 
      */
      const query: LocationQuery = route.query; // 此时 query == { redirect:'/dashboard' }
      const redirect = (query.redirect as LocationQueryValue) ?? "/";
      const otherQueryParams = Object.keys(query).reduce( // ["redirect"].reduce()
        (acc: any, cur: string) => {
          if (cur !== "redirect") {
            acc[cur] = query[cur];
          }

          return acc; // 键值对
        },
        {} //return acc 即往这个空对象累加键值对
      );

      // 登录后跳转到参数给的路由地址
      router.push({ path: redirect, query: otherQueryParams });
    })
    .catch(() => {
      console.log("接口调用失败！！");
    });
}
</script>

<style lang="scss" scoped></style>
