<template>
  <!-- 顶部导航栏 -->
  <div class="navbar flx-between">
    <!-- 左侧面包屑 -->
    <div>
      <hamburger
        :is-active="appStore.sidebar.opened"
        @toggle-click="toggleSideBar"
      />
      <!-- <breadcrumb /> -->
    </div>

    <!-- 右侧导航设置 -->
    
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
// import { useRoute, useRouter } from "vue-router";a
import { useAppStore } from "@/store/modules/app";
// import { useTagsViewStore } from "@/store/modules/tagsView";
// import { useUserStore } from "@/store/modules/user";

const appStore = useAppStore();
// const tagsViewStore = useTagsViewStore();
// const userStore = useUserStore();

// const route = useRoute();
// const router = useRouter();

// const { device } = storeToRefs(appStore); // 设备类型：desktop-宽屏设备 || mobile-窄屏设备

/**
 * 左侧菜单栏显示/隐藏
 */
function toggleSideBar() {
  appStore.toggleSidebar(true);
}
/**
 * vueUse 全屏
 */
const { isFullscreen, toggle } = useFullscreen();

/**
 * 注销
 */
// function logout() {
//   ElMessageBox.confirm("确定注销并退出系统吗？", "提示", {
//     confirmButtonText: "确定",
//     cancelButtonText: "取消",
//     type: "warning",
//   }).then(() => {
//     userStore
//       .logout()
//       .then(() => {
//         tagsViewStore.delAllViews();
//       })
//       .then(() => {
//         router.push(`/login?redirect=${route.fullPath}`);
//       });
//   });
// }
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  background-color: #fff;
  box-shadow: 0 0 1px #0003;

  .setting-container {
    display: flex;
    align-items: center;

    .setting-item {
      display: inline-block;
      width: 30px;
      height: 50px;
      line-height: 50px;
      color: #5a5e66;
      text-align: center;
      cursor: pointer;

      &:hover {
        background: rgb(249 250 251 / 100%);
      }
    }
  }

  .avatar-container {
    display: flex;
    align-items: center;
    justify-items: center;
    margin: 0 5px;
    cursor: pointer;

    img {
      width: 40px;
      height: 40px;
      border-radius: 5px;
    }
  }
}
</style>
