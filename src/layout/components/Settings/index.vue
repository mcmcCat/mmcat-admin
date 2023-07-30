<template>
  <div class="settings-container">

    <h3>项目配置</h3>

    <el-divider>主题</el-divider>

    <div class="flx-center" @click.stop>
      <el-switch
        v-model="isDark"
        inline-prompt
        :active-icon="IconEpMoon"
        :inactive-icon="IconEpSunny"
        style="
          --el-switch-on-color: var(--el-fill-color-dark);
          --el-switch-off-color: var(--el-color-primary);
        "
        @change="toggleDark"
      />
    </div>

    <el-divider>界面设置</el-divider>

    <div class="bar-py flx-between">
      <span>开启 Tags-View</span>
      <el-switch v-model="settingsStore.tagsView" />
    </div>

    <div class="bar-py flx-between">
      <span>固定 Header</span>
      <el-switch v-model="settingsStore.fixedHeader" />
    </div>

    <div class="bar-py flx-between">
      <span>侧边栏 Logo</span>
      <el-switch v-model="settingsStore.sidebarLogo" />
    </div>

    <el-divider>主题颜色</el-divider>

    <ul class="theme-item">
      <li
        v-for="(color, index) in themeColors"
        :key="index"
        class="li-item"
        :style="{ background: color }"
        @click="changeThemeColor(color)"
      />
    </ul>

    <el-divider>导航设置</el-divider>

    <ul class="layout">
      <el-tooltip content="左侧模式" placement="bottom">
        <li
          class="layout-item layout-left"
          :class="(settingsStore.layout == 'left' ? 'is-active' : '')"
          @click="changeLayout('left')"
        >
          <div />
          <div />
        </li>
      </el-tooltip>
      <el-tooltip content="顶部模式" placement="bottom">
        <li
          class="layout-item layout-top"
          :class="(settingsStore.layout == 'top' ? 'is-active' : '')"
          @click="changeLayout('top')"
        >
          <div />
          <div />
        </li>
      </el-tooltip>
      <el-tooltip content="混合模式" placement="bottom">
        <li
          class="layout-item layout-mix"
          :class="(settingsStore.layout == 'mix' ? 'is-active' : '')"
          @click="changeLayout('mix')"
        >
          <div />
          <div />
        </li>
      </el-tooltip>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@/store/modules/settings";

import IconEpSunny from "~icons/ep/sunny";
import IconEpMoon from "~icons/ep/moon";
/**
 * 暗黑模式
 */
const settingsStore = useSettingsStore();
const isDark = useDark();

const toggleDark = () => useToggle(isDark);

/**
 * 切换布局
 */
function changeLayout(layout: string) {
  settingsStore.changeSetting({ key: "layout", value: layout });
  window.document.body.setAttribute("layout", settingsStore.layout);
}

// 主题颜色
const themeColors = ref<string[]>([
  "#409EFF",
  "#304156",
  "#11a983",
  "#13c2c2",
  "#6959CD",
  "#f5222d",
]);

/**
 * 切换主题颜色
 */
function changeThemeColor(color: string) {
  document.documentElement.style.setProperty("--el-color-primary", color); // 饿了么组件的源码实现就是使用该css变量名给组件添加颜色的
}

// onMounted(() => {
//   window.document.body.setAttribute("layout", settingsStore.layout);
// });
</script>

<style lang="scss" scoped>
.settings-container {
  padding: 16px;
  .bar-py {
    padding: 8px 0;
  }
  /* 
    主题颜色
  */
  .theme-item {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 2rem;
    padding-bottom: 2rem;
    > * + * {
      // > 表示直接后代选择器，* 表示所有元素，+ 表示相邻兄弟选择器，> * + * 这个选择器的作用是为除了第一个子元素以外的所有子元素添加 2px 左边距（Margin），实现子元素在横向上的 0.5em 间距
      margin-left: 0.5em;
    }
    .li-item {
      display: inline-block;
      width: 30px;
      height: 30px;
      cursor: pointer;
    }
  }
  .layout {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    width: 100%;
    height: 50px;

    &-item {
      position: relative;
      width: 18%;
      height: 45px;
      overflow: hidden;
      cursor: pointer;
      background: #f0f2f5;
      border-radius: 4px;
    }

    &-item.is-active {
      border: 2px solid var(--el-color-primary);
    }

    &-mix div:nth-child(1) {
      width: 100%;
      height: 30%;
      background: #1b2a47;
      box-shadow: 0 0 1px #888;
    }

    &-mix div:nth-child(2) {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 30%;
      height: 70%;
      background: #1b2a47;
      box-shadow: 0 0 1px #888;
    }

    &-top div:nth-child(1) {
      width: 100%;
      height: 30%;
      background: #1b2a47;
      box-shadow: 0 0 1px #888;
    }

    &-left div:nth-child(1) {
      width: 30%;
      height: 100%;
      background: #1b2a47;
    }

    &-left div:nth-child(2) {
      position: absolute;
      top: 0;
      right: 0;
      width: 70%;
      height: 30%;
      background: #fff;
      box-shadow: 0 0 1px #888;
    }
  }
}
</style>
