<template>
  <div ref="rightPanel" :class="{ show: show }">
    <div class="right-panel-overlay"></div>
    <div class="right-panel-container">
      <div
        class="right-panel-btn"
        :style="{
          top: buttonTop + 'px',
        }"
        @click="show = !show"
      >
        <i-ep-close v-show="show" />
        <i-ep-setting v-show="!show" />
      </div>
      <div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { addClass, removeClass } from "@/utils/index"; // 工具函数添加移除类名

const show = ref(false);

defineProps({
  buttonTop: {
    default: 250,
    type: Number,
  },
});

watch(show, (value) => {
  if (value) {
    addEventClick();
  }
  if (value) {
    addClass(document.body, "showRightPanel");
  } else {
    removeClass(document.body, "showRightPanel");
  }
});

function addEventClick() {
  /* 
    在开发中经常会遇到某些事件监听函数调用 preventDefault() 方法，以便阻止一些默认行为（例如，滚动事件的默认行为是滚动页面）。然而， preventDefault() 方法的调用会阻止页面的主线程（main thread）并停止浏览器的默认行为，这可能会导致页面的滚动卡顿、卡顿和性能问题。
  */
  window.addEventListener("click", closeRightPanel, { passive: true });
}

/* 
  注意为什么要判断 e.target.closest() 是否捕获祖先元素 
  这个点击事件的监听是添加在window上的所以我们在right-panel-container内，即侧边栏内点击操作是不会关闭侧边栏的，
  但是如果点击侧边栏以外的空白区域就会关闭侧边栏
*/
function closeRightPanel(e: any) {
  // 主题选择点击不关闭
  let parent = e.target.closest(".right-panel-container"); // element.closest(selector) 在当前元素及其祖先元素中查找符合指定选择器的元素
  // 这段代码中的 if 判断语句用于判断点击事件发生的元素是否在 .right-panel-container 元素内，从而确定是否需要关闭侧边栏。简单来说，在侧边栏内控制show的按钮则不要关闭侧边栏，在侧边栏外的按钮会关闭侧边栏
  if (!parent) {
    show.value = false;
    // 另外，还需要将 closeRightPanel 函数从 window 的 click 事件监听器中移除，避免再次点击时重复关闭侧边栏。
    window.removeEventListener("click", closeRightPanel);
  }
}

const rightPanel = ref(); // 由标签内的ref属性同名的ref常量可以取得该dom元素

function insertToBody() {
  const body = document.querySelector("body") as any;
  body.insertBefore(rightPanel.value, body.firstChild);
}

onMounted(() => {
  insertToBody();
});

onBeforeUnmount(() => {
  rightPanel.value.remove();
});
</script>

<style lang="scss" scoped>
.showRightPanel {
  position: relative;
  width: calc(100% - 15px);
  overflow: hidden;
}

.right-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  background: rgb(0 0 0 / 20%);
}

.right-panel-container {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 999;
  width: 100%;
  max-width: 300px;
  height: 100vh;
  background-color: var(--el-bg-color-overlay);
  box-shadow: 0 0 15px 0 rgb(0 0 0 / 5%);
  transition: all 0.25s cubic-bezier(0.7, 0.3, 0.1, 1);
  transform: translate(100%);
}

.show {
  transition: all 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);

  .right-panel-overlay {
    z-index: 99;
    width: 100%;
    height: 100%;
    opacity: 1;
  }

  .right-panel-container {
    transform: translate(0);
  }
}

.right-panel-btn {
  position: absolute;
  left: -36px;
  width: 36px;
  height: 36px;
  color: var(--el-color-white);
  text-align: center;
  cursor: pointer;
  background-color: var(--el-color-primary);
  border-radius: 6px 0 0 6px;

  svg {
    width: 20px;
    height: 20px;
    vertical-align: -10px;
  }
}
</style>
