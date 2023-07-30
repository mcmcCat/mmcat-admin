<template>
  <div class="logo-container" :class="{ 'logo-color': !isDark }">
    <!-- transition组件控制组件的过渡效果 ，name="sidebarLogoFade" 意味着它将应用名为 sidebarLogoFade 的 CSS 过渡类名。-->
    <transition name="sidebarLogoFade">
      <!-- router-link中的key属性的作用是给vue识别，减小性能开销 -->
      <!-- 只展示logo和title其一的模式 -->
      <router-link v-if="collapse" key="collapse" class="logo-full flx-center" to="/">
        <img
          v-if="settingsStore.sidebarLogo"
          :src="logo"
          class="logoSize"
          title="click to home"
        />
        <span v-else class="logoText">{{ settingsStore.title }}</span>
      </router-link>

      <!-- logo和title都展示的模式 -->
      <router-link v-else key="expand" class="logo-full flx-center" to="/">
        <img v-if="settingsStore.sidebarLogo" :src="logo" class="logoSize" />
        <span class="logoText">{{ settingsStore.title }}</span>
      </router-link>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { useSettingsStore } from "@/store/modules/settings";

const settingsStore = useSettingsStore();

defineProps({
  collapse: {
    type: Boolean,
    required: true,
  },
});

const isDark = useDark(); // 控制logo区域在暗黑模式切换时改变背景颜色

const logo = ref(new URL(`../../../assets/cat1.jpg`, import.meta.url).href);
</script>

<style lang="scss" scoped>
// https://cn.vuejs.org/guide/built-ins/transition.html#the-transition-component

.logo-container {
  width: 100%;
  height: 50px;
  background-color: var(--el-bg-color-overlay);

  &.logo-color {
    color: #fff;
    background-color: #1f2937;
  }

  .logo-full {
    width: 100%;
    height: 100%;
    .logoSize {
      width: 1.25rem;
      height: 1.25rem;
    }

    .logoText {
      margin-left: 0.75rem;
      font-size: 0.875rem;
      font-weight: bold;
    }
  }
}

// 动画
.sidebarLogoFade {
  &-enter-active {
    transition: opacity 2s;
  }

  &-leave-active,
  &-enter-from,
  &-leave-to {
    opacity: 0;
  }
}
</style>
