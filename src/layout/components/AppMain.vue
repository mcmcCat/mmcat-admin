<script setup lang="ts">
import { useTagsViewStore } from "@/store/modules/tagsView";

const tagsViewStore = useTagsViewStore();
</script>

<template>
  <section class="app-main">
    <!-- { Component, route } 可以解构出当前路由实例对应的组件和路由信息 -->
    <router-view v-slot="{ Component, route }">
      <transition name="router-fade" mode="out-in">
        <!-- 
          在 Vue.js 中，当我们使用 v-for 或者 v-if 渲染一组数据列表时，可能需要指定一个唯一的 key 值来区分不同的数据项。这样可以提高性能，避免不必要的重新渲染和 DOM 操作。
          同样地，当我们使用 <router-view> 来动态渲染路由组件时，我们也需要指定一个唯一的 key 值来区分不同的路由组件，从而实现缓存和更新的效果。这个 key 值一般使用当前路由的完整路径来标识，以确保每个路由组件都有一个唯一的标识。
         -->
        <!-- :include="tagsViewStore.cachedViews" 将需要缓存的组件打包到一个数组中 -->
        <!-- 需要注意的是，如果我们没有指定 :include 属性，则 <keep-alive> 组件会自动缓存所有组件。 -->
        <!-- cachedViews告诉我们删除了对应的tag时，那么该组件的缓存销毁 -->
        <keep-alive :include="tagsViewStore.cachedViews">
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
      </transition>
    </router-view>
  </section>
</template>

<style lang="scss" scoped>
.app-main {
  position: relative;
  width: 100%;

  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  overflow: hidden;
  background-color: var(--el-bg-color-page);
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    min-height: 100vh;
    padding-top: 84px;
  }
}
</style>
