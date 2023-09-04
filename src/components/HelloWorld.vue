<script setup lang="ts">
import variables from "@/styles/variables.module.scss";
import { useCounterStore } from "@/store/counter";
const counterStore = useCounterStore();

defineProps<{ msg: string }>();
</script>

<template>
  <h1>{{ msg }}</h1>
  <el-button type="success">
    <i-maki-animal-shelter />
    Success
  </el-button>
  <el-button type="info">
    <i-ep-InfoFilled />
    Info
  </el-button>
  <el-button type="warning">
    <i-ep-WarningFilled />
    Warning
  </el-button>
  <el-button type="danger">
    <i-ep-WarnTriangleFilled />
    Danger
  </el-button>
  <!-- SVG 本地图标 -->
  <el-button type="info">
    <svg-icon icon-name="pinia" />
    SVG 本地图标
  </el-button>
  <div class="scss-box">
    <div class="box"></div>
    <div
      style="width: 100px; height: 100px"
      :style="{ 'background-color': variables.bgColor }"
    ></div>
  </div>
  <hr />
  <el-card>
    <template #header>子组件 HelloWorld.vue</template>
    <el-form>
      <el-form-item label="数字：">{{ counterStore.count }}</el-form-item>
      <el-form-item label="加倍：">{{ counterStore.double }}</el-form-item>
    </el-form>
  </el-card>
</template>

<style lang="scss" scoped>
.scss-box div {
  width: 100px;
  height: 100px;
  margin: 5px;
  background-color: $bg-color;
  border: 2px solid #eee;
}
</style>
