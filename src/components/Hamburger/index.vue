<template>
  <div class="hamburger-container" @click="toggleClick">
    <div :class="{ 'is-active': isActive }" class="hamburger flx-center">
      <svg-icon icon-name="hamburger" :size="'1.3em'"/>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  isActive: {
    required: true,
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["toggleClick"]);

function toggleClick() {
  emit("toggleClick");
}
</script>

<style lang="scss" scoped>
.hamburger-container {
  height: 50px; 
  line-height: 50px; 
  cursor: pointer; 
  &:hover {
    background-color: var(--el-fill-color-light);
  }
  // 此处的.dark为该 容器& 的父类
  .dark &:hover {
    /* 暗黑模式下的鼠标悬停样式 */
    background-color: var(--el-fill-color-dark);
  }

  .hamburger {
    width: 50px;
    height: 50px;
    vertical-align: -4px;

    &.is-active {
      transform: rotate(180deg);
    }
    transition: all 0.4s;
  }
}
</style>
