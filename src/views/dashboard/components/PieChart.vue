<!-- 饼图 -->
<template>
  <el-card>
    <template #header>产品分类饼图</template>
    <div :id="id" :style="{ height, width }"></div>
  </el-card>
</template>

<script setup lang="ts">
import * as echarts from "echarts";

const props = defineProps({
  id: {
    type: String,
    default: "pieChart",
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
    textStyle: {
      color: "#999",
    },
  },
  series: [
    {
      name: "Nightingale Chart",
      type: "pie",
      radius: [30, 130], // 内半径 外半径
      center: ["50%", "50%"], // 中心点的位置
      roseType: "radius",
      itemStyle: {
        borderRadius: "0%", // 圆角
        color: (params: any) => {
          //自定义颜色
          const colorList = ["#409EFF", "#67C23A", "#E6A23C", "#F56C6C"];
          return colorList[params.dataIndex];
        },
      },
      data: [
        { value: 26, name: "家用电器" },
        { value: 27, name: "户外运动" },
        { value: 24, name: "汽车用品" },
        { value: 23, name: "手机数码" },
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
