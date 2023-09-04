<template>
  <!-- aria-hidden="true"：这个属性表示图标应该被屏蔽屏幕阅读器的语音提示功能，因为图标是本身没有声音意义的，只是为了视觉展示而存在。 -->
  <svg
    aria-hidden="true"
    class="svg-icon"
    :style="'width:' + size + ';height:' + size"
  >
    <!-- 这是 SVG 的 use 元素，它能够动态引用其他 SVG 的元素，可以实现 SVG 图标的复用。 -->
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script setup lang="ts">
const props = defineProps({
  // 前缀
  prefix: {
    type: String,
    default: "icon",
  },
  iconName: {
    // 组件使用该属性传值时是使用横杠分隔法 icon-name = ""
    type: String,
    required: false,
  },
  color: {
    type: String,
  },
  size: {
    type: String,
    default: "1em",
  },
});

// symbolId 是 "#前缀-类名" 拼接而成
const symbolId = computed(() => `#${props.prefix}-${props.iconName}`);
</script>

<style scoped>
/* 官方推荐样式 */
.svg-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  overflow: hidden;
  vertical-align: -0.15em; /* 因icon大小被设置为和字体大小一致，而span等标签的下边缘会和字体的基线对齐，故需设置一个往下的偏移比例，来纠正视觉上的未对齐效果 */
  outline: none;
  fill: currentcolor; /* 定义元素的颜色，currentColor是一个特殊的关键字，表示使用当前元素的color属性值作为填充颜色，如果当前元素未设置color值，则从父元素继承 */
}
</style>
