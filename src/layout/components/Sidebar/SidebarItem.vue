<script setup lang="ts">
import path from "path-browserify";
import { isExternal } from "@/utils/index";
import AppLink from "./Link.vue";

// TODO: 路由的国际化
import { translateRouteTitleI18n } from '@/utils/i18n';

const props = defineProps({
  /**
   * 路由信息(eg:multi-level3-1的路由信息)
   */
  item: {
    type: Object,
    required: true,
  },

  /**
   * 父层级的路由路径(eg:/multi-level/multi-level1/multi-level2)
   */
  basePath: {
    type: String,
    required: true,
  },
});

const onlyOneChild = ref(); // 临时变量，唯一子路由

/**
 * 判断当前路由是否只有一个子路由
 *
 * 1：如果只有一个子路由： 返回 true
 * 2：如果无子路由 ：返回 true
 *
 * @param children 子路由数组
 * @param parent 当前路由
 */
function hasOneShowingChild(children = [], parent: any) {
  // 需要显示的子路由数组
  const showingChildren = children.filter((item: any) => {
    if (item.meta?.hidden) {
      return false; // 过滤不显示的子路由
    } else {
      onlyOneChild.value = item; // 唯一子路由赋值（多个子路由情况 onlyOneChild 变量是用不上的，因为return false 打断了与运算）

      return true;
    }
  });
  console.log(showingChildren);
  
  // 1：如果只有一个子路由, 返回 true
  if (showingChildren.length === 1) {
    return true;
  }

  // 2：如果无子路由, 复制当前路由信息作为其子路由，满足只拥有一个子路由的条件，所以返回 true
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: "", noShowingChildren: true };
    return true;
  }
  return false;
}

/**
 * 解析路径
 *
 * @param routePath 路由路径
 */
function resolvePath(routePath: string) {
  if (isExternal(routePath)) {
    return routePath;
  }
  if (isExternal(props.basePath)) {
    return props.basePath;
  }
  // 完整路径 = 父级路径(/level/level_3) + 路由路径
  const fullPath = path.resolve(props.basePath, routePath); // 相对路径 → 绝对路径

  return fullPath;
}
</script>
<template>
  <!-- item是传过来的路由信息对象 -->
  <div v-if="!item.meta || !item.meta.hidden">
    <!-- 1. 只包含一个子路由节点的路由或者无子路由，显示其【唯一子路由】 -->
    <!-- 
      (!onlyOneChild.children || onlyOneChild.noShowingChildren) 只是使代码的语义完整（并无什么实质性作用），一个子路由或者无子路由则或运算返回true
      其中，!onlyOneChild.children表示只有onlyOneChild这个子路由，它的children属性为undefined
      实际上只分为 hasOneShowingChild()返回true 就是一个子路由、无子路由情况，
                  hasOneShowingChild()返回false 就是多个子路由情况
    -->
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren)
      "
    >
      <!-- 这里加v-if可能是预防后台给的路由接口没有定义好路由信息字段，比如说关键的meta字段，预防崩溃 -->
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)">
          <svg-icon
            v-if="onlyOneChild.meta && onlyOneChild.meta.icon"
            :icon-name="onlyOneChild.meta.icon"
          />
          <template #title>
            {{ translateRouteTitleI18n(onlyOneChild.meta.title) }}
          </template>
        </el-menu-item>
      </app-link>
    </template>

    <!-- 2. 包含多个子路由  -->
    <el-sub-menu v-else :index="resolvePath(item.path)" teleported>
      <template #title>
        <svg-icon
          v-if="item.meta && item.meta.icon"
          :icon-name="item.meta.icon"
        />
        <span v-if="item.meta && item.meta.title">
          {{ translateRouteTitleI18n(item.meta.title) }}
        </span>
      </template>

      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :base-path="resolvePath(child.path)"
      />
    </el-sub-menu>
  </div>
</template>
