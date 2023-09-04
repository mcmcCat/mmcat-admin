<template>
  <el-breadcrumb class="flx-align-center" style="height: 50px">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.path">
        <span
          v-if="
            item.redirect === 'noredirect' || index === breadcrumbs.length - 1
          "
          style="color: var(--el-disabled-text-color)"
        >
          {{ translateRouteTitleI18n(item.meta.title) }}
        </span>
        <a v-else @click.prevent="handleLink(item)">
          {{ translateRouteTitleI18n(item.meta.title) }}
        </a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup lang="ts">
// import { onBeforeMount, ref, watch } from "vue";
import { useRoute, RouteLocationMatched } from "vue-router";
import { compile } from "path-to-regexp";
import router from "@/router";
import { translateRouteTitleI18n } from "@/utils/i18n";

const currentRoute = useRoute();
const pathCompile = (path: string) => {
  const { params } = currentRoute; // 取到当前路由的请求参数，其实在这里的面包屑导航基本上只做跳转首页，所以路由对象的Param都为空对象即无请求参数

  const toPath = compile(path); // compile是主要用于处理复杂的动态路径的函数，但是上面说过了基本上只做跳转首页，未涉及到需要动态参数的请求路径，所以处理后的结果一致 path === toPath(params)

  return toPath(params); // 复杂的动态路径加上请求参数
};

const breadcrumbs = ref([] as Array<RouteLocationMatched>); // 用于存放拼接好的面包屑路由对象数组

function getBreadcrumb() {
  let matched = currentRoute.matched.filter(
    (item) => item.meta && item.meta.title
  );

  const first = matched[0];
  if (!isDashboard(first)) {
    matched = [
      { path: "/dashboard", meta: { title: "dashboard" } } as any,
    ].concat(matched); // 连接成了一个数组，包含面包屑中对应的路由对象
  }
  // 把连接好的数组变成ref响应式对象
  breadcrumbs.value = matched.filter((item) => {
    return item.meta && item.meta.title && item.meta.breadcrumb !== false;
  });
}

function isDashboard(route: RouteLocationMatched) {
  const name = route && route.name;

  // 因为没有name肯定不是首页
  if (!name) {
    return false;
  }
  // 有name不一定就是首页
  return (
    name.toString().trim().toLocaleLowerCase() ===
    "Dashboard".toLocaleLowerCase()
  );
}

function handleLink(item: any) {
  const { redirect, path } = item;
  if (redirect) {
    router.push(redirect).catch((err) => {
      console.warn(err);
    });
    return;
  }
  router.push(pathCompile(path)).catch((err) => {
    console.warn(err);
  });
}

watch(
  () => currentRoute.path,
  (newPath) => {
    if (newPath.startsWith("/redirect/")) {
      return;
    }
    getBreadcrumb();
  }
);

onBeforeMount(() => {
  getBreadcrumb();
});
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  margin-left: 8px;
  font-size: 14px;
  line-height: 50px;
}

// 覆盖 element-plus 的样式
.el-breadcrumb__inner,
.el-breadcrumb__inner a {
  font-weight: 400 !important;
}
</style>
