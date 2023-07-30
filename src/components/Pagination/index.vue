<template>
  <div :class="'pagination ' + { hidden: hidden }">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :background="background"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from "vue";
// import { scrollTo } from "@/utils/scroll-to";

const props = defineProps({
  total: {
    required: true,
    type: Number as PropType<number>,
    default: 0,
  },
  page: {
    type: Number,
    default: 1,
  },
  limit: {
    type: Number,
    default: 20,
  },
  pageSizes: {
    type: Array as PropType<number[]>,
    default() {
      return [10, 20, 30, 50];
    },
  },
  layout: {
    type: String,
    default: "total, sizes, prev, pager, next, jumper",
  },
  background: {
    type: Boolean,
    default: true,
  },
  autoScroll: {
    type: Boolean,
    default: true,
  },
  hidden: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["pagination", "update:page", "update:limit"]);

// @vueuse/core的函数useVModel() 配合 props、v-model 和 emit的update:xxx 来使用
// 实际上干的事情就是 currentPage.value === props.page ，即返回的是一个Ref对象currentPage
// 另外currentPage、pageSize 的value改变会分别触发emit自定义事件update:page、update:limit（通常来说两个都同时用得到，直接将它们糅合成一个pagination事件）
const currentPage = useVModel(props, "page", emit);

const pageSize = useVModel(props, "limit", emit);

function handleSizeChange(val: number) {
  // 每页的条数大小改变则重新获取用户列表数据
  emit("pagination", { page: currentPage, limit: val });
  if (props.autoScroll) {
    // scrollTo(0, 800);
  }
}

function handleCurrentChange(val: number) {
  currentPage.value = val;
  // 当前页数改变则重新获取用户列表数据
  emit("pagination", { page: val, limit: props.limit });
  if (props.autoScroll) {
    // scrollTo(0, 800);
  }
}
</script>

<style lang="scss" scoped>
.pagination {
  padding: 12px;

  &.hidden {
    display: none;
  }
}
</style>
