<script lang="ts" setup>
import { isExternal } from "@/utils/index";
import { useRouter } from "vue-router";

import { useAppStore } from "@/store/modules/app";
const appStore = useAppStore();

const sidebar = computed(() => appStore.sidebar);
// TODO: 忽略了手机设备，后续看需不需要添加>>>>>
// const device = computed(() => appStore.device);

const props = defineProps({
  to: {
    type: String,
    required: true,
  },
});

const router = useRouter(); // 获取整个路由实例
function push() {
  // TODO: 忽略了手机设备的情况>>>>>
  // if (device.value === 'mobile' && sidebar.value.opened == true) {
  //   appStore.closeSideBar(false);
  // }

  // 进行路由跳转
  router.push(props.to).catch((err) => {
    console.error(err);
  });
}
</script>

<template>
  <!-- rel="noopener"这个属性的作用是告诉浏览器在新窗口打开链接时不要保留对原始窗口的引用。这样可以阻止新窗口访问原始窗口的 DOM 和方法，提高安全性。 -->
  <!-- 如果是外部链接则跳转到新的标签页打开 -->
  <a v-if="isExternal(to)" :href="to" target="_blank" rel="noopener">
    <slot></slot>
  </a>
  <!-- 如果不是外部链接则进行路由跳转 -->
  <div v-else @click="push">
    <slot></slot>
  </div>
</template>
