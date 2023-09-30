<!-- 雷达图 -->
<template>
  <el-card>
    <template #header>订单状态雷达图</template>
    <div :id="id" :style="{ height, width }"></div>
  </el-card>
</template>

<script setup lang="ts">
import * as echarts from "echarts/core";
// 引入柱状图图表，图表后缀都为 Chart
import { RadarChart } from "echarts/charts";
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
} from "echarts/components";
// 标签自动布局、全局过渡动画等特性
import { LabelLayout, UniversalTransition } from "echarts/features";
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from "echarts/renderers";

// 注册必须的组件
echarts.use([
  RadarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
]);
const props = defineProps({
  id: {
    type: String,
    default: "radarChart",
  },
  width: {
    type: String,
    default: "200px",
    required: true,
  },
  height: {
    type: String,
    default: "200px",
    required: true,
  },
});

const options = {
  grid: {
    left: "2%",
    right: "2%",
    bottom: "10%",
    containLabel: true,
  },
  legend: {
    x: "center",
    y: "bottom",
    data: ["预定数量", "下单数量", "发货数量"],
    textStyle: {
      color: "#999",
    },
  },
  radar: {
    // shape: 'circle',
    // 图的大小
    radius: "60%",
    // 指示器
    indicator: [
      { name: "家用电器" },
      { name: "服装箱包" },
      { name: "运动户外" },
      { name: "手机数码" },
      { name: "汽车用品" },
      { name: "家具厨具" },
    ],
  },
  series: [
    {
      name: "Budget vs spending",
      type: "radar",
      itemStyle: {
        color: function (params: any) {
          //自定义颜色
          const colorList = ["#409EFF", "#67C23A", "#E6A23C"];
          return colorList[params.dataIndex];
        },
      },
      data: [
        {
          value: [400, 400, 400, 400, 400, 400],
          name: "预定数量",
        },
        {
          value: [300, 300, 300, 300, 300, 300],
          name: "下单数量",
        },
        {
          value: [200, 200, 200, 200, 200, 200],
          name: "发货数量",
        },
      ],
    },
  ],
};

onMounted(() => {
  const chart = echarts.init(
    document.getElementById(props.id) as HTMLDivElement
  );
  chart.setOption(options);

  window.addEventListener("resize", () => {
    chart.resize();
  });
});
</script>
