<script setup lang="ts">
import { useAppStore } from "@/store/modules/app";
const appStore = useAppStore();
</script>

<template>
  <!-- 全局配置中的locale和size的切换是针对el原生组件的，对于自己封装的组件而言需要另外配置中英文切换等。。 -->
  <el-config-provider :locale="appStore.locale" :size="appStore.elSize">
    <router-view />
  </el-config-provider>
</template>
