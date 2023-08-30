<script setup lang="ts">
import { useTagsViewStore, TagView } from "@/store/modules/tagsView";

const tagAndTagSpacing = ref(4);
const { proxy } = getCurrentInstance() as any;

const emits = defineEmits(["scroll"]);
const emitScroll = () => {
  emits("scroll");
};

const tagsViewStore = useTagsViewStore();

// wrapRef是滚动条组件包裹的 ref 对象，即 Ref<HTMLDivElement>
const scrollWrapper = computed(
  () => proxy?.$refs.scrollContainer.$refs.wrapRef
);

// 这段代码的作用是在组件挂载后将 scroll 事件监听器绑定到 scrollWrapper 的元素上，并在组件即将卸载前解绑该事件监听器，以防止内存泄漏。这样当 scrollWrapper 的元素发生滚动时，会触发 emitScroll 的逻辑。
onMounted(() => {
  // 这里的scroll是监听滑动条发生移动（不管是点击拖动还是滚轮滚动触发的）
  scrollWrapper.value.addEventListener("scroll", emitScroll, true);
});
onBeforeUnmount(() => {
  scrollWrapper.value.removeEventListener("scroll", emitScroll);
});


/* 这里的handleScroll是监听鼠标滚轮发生滚动 */
function handleScroll(e: WheelEvent) {
  // 在不同的浏览器和操作系统中，wheelDelta 和 deltaY 的值可能会有所不同。
  // 滚轮上滚一下wheelDelta为120，下滚一下为-120，它是一个用于非标准的滚轮事件增量值的属性。
  // 滚轮上滚一下deltaY为-100，下滚一下为100，它代表了滚轮事件在垂直方向上的增量值，可以用于自定义计算增量值
  const eventDelta = (e as any).wheelDelta || -e.deltaY * 40;
  
  // 目的是根据滚轮事件的增量值调整水平滚动的位置。将增量值除以4是为了减缓滚动速度，而不是直接滚动120的距离，使滚动效果更平滑一些。
  scrollWrapper.value.scrollLeft = scrollWrapper.value.scrollLeft + eventDelta / 4;
}

/* 根据点击的tag的位置情况来判断是否需要滚动滚动条 */
function moveToTarget(currentTag: TagView) {
  // $container就是scroll-container元素
  const $container = proxy.$refs.scrollContainer.$el;
  // $containerWidth 是scroll-container元素,即滚动条的宽度（包括元素边框）
  const $containerWidth = $container.offsetWidth;
  // $scrollWrapper.scrollWidth 是整个滚动容器宽度
  // $scrollWrapper.scrollLeft 是滚动条偏移量
  const $scrollWrapper = scrollWrapper.value;

  // 总结：滚动条偏移量 + 滚动条的宽度 === 整个滚动容器宽度
  // $scrollWrapper.scrollLeft + $container.offsetWidth === $scrollWrapper.scrollWidth
  
  let firstTag = null;
  let lastTag = null;

  // find first tag and last tag
  if (tagsViewStore.visitedViews.length > 0) {
    firstTag = tagsViewStore.visitedViews[0];
    lastTag = tagsViewStore.visitedViews[tagsViewStore.visitedViews.length - 1];
  }

  if (firstTag === currentTag) {
    // scrollLeft 滚动条偏移量
    $scrollWrapper.scrollLeft = 0;
  } else if (lastTag === currentTag) {
    // 即让滚动条滚到尽头
    $scrollWrapper.scrollLeft = $scrollWrapper.scrollWidth - $containerWidth;
  } else {
    const tagListDom = document.getElementsByClassName("tags-item");
    const currentIndex = tagsViewStore.visitedViews.findIndex(
      (item) => item === currentTag
    );
    let prevTag = null;
    let nextTag = null;
    // for循环遍历查找到 prevTag和nextTag
    for (const k in tagListDom) {
      // 首先检查当前属性 k 是否不等于 “length”，并且该属性确实存在于 tagListDom 对象中（通过 Object.hasOwnProperty.call(tagListDom, k) 来判断）
      if (k !== "length" && Object.hasOwnProperty.call(tagListDom, k)) {
        if (
          (tagListDom[k] as any).dataset.path ===
          tagsViewStore.visitedViews[currentIndex - 1].path
        ) {
          prevTag = tagListDom[k];
        }
        if (
          (tagListDom[k] as any).dataset.path ===
          tagsViewStore.visitedViews[currentIndex + 1].path
        ) {
          nextTag = tagListDom[k];
        }
      }
    }

    /* 总体而言，下面该代码段根据下一个标签元素 nextTag 和上一个标签元素 prevTag 的位置来判断是否需要滚动滚动条，以使当前的标签元素可见。 */

    // the tag's offsetLeft after of nextTag
    // 计算下一个标签元素的后面位置的偏移量
    const afterNextTagOffsetLeft =
      (nextTag as any).offsetLeft +
      (nextTag as any).offsetWidth +
      tagAndTagSpacing.value;

    // the tag's offsetLeft before of prevTag
    // 计算上一个标签元素的前面位置的偏移量
    const beforePrevTagOffsetLeft =
      (prevTag as any).offsetLeft - tagAndTagSpacing.value;

    /* 判断是否大于或小于可视的当前的滚动范围 */
    if (afterNextTagOffsetLeft > $scrollWrapper.scrollLeft + $containerWidth) {
      // 如果是则滚到下一个标签元素的后面位置
      $scrollWrapper.scrollLeft = afterNextTagOffsetLeft - $containerWidth;
    } else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft) {
      // 若小于则滚到上一个标签元素的前面位置
      $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft;
    }
  }
}

defineExpose({
  moveToTarget,
});
</script>

<template>
  <el-scrollbar
    ref="scrollContainer"
    class="scroll-container"
    :vertical="false"
    @wheel.prevent="handleScroll"
  >
    <slot />
  </el-scrollbar>
</template>

<style lang="scss" scoped>
.scroll-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;

  .el-scrollbar__bar {
    bottom: 0;
  }

  .el-scrollbar__wrap {
    height: 49px;
  }
}
</style>
