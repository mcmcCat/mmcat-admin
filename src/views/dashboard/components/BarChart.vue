<!--  线 + 柱混合图 -->
<template>
  <el-card>
    <template #header>
      <div class="title">
        业绩柱状图
        <el-tooltip effect="dark" content="点击试试下载" placement="bottom">
          <i-ep-download class="download" @click="downloadEchart" />
        </el-tooltip>
      </div>
    </template>

    <div :id="id" :style="{ height, width }"></div>
  </el-card>
</template>

<script setup lang="ts">
import * as echarts from "echarts";

const props = defineProps({
  id: {
    type: String,
    default: "barChart",
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
  /* 直角坐标系内绘图网格 */
  grid: {
    left: "2%", // grid 组件离容器左侧的距离。
    right: "2%",
    bottom: "10%",
    containLabel: true, // 是否包含坐标轴刻度标签 axisLabel
  },
  /* 提示框组件 */
  tooltip: {
    // 触发类型
    trigger: "axis", // 坐标轴触发
    // 坐标轴指示器配置项
    axisPointer: {
      type: "cross", // 坐标系会自动选择显示哪个轴的坐标指示器 axisPointer
      // 坐标轴指示器的样式
      crossStyle: {
        color: "#999",
      },
    },
  },
  /* 图例组件 */
  legend: {
    x: "center",
    y: "bottom",
    // 图例的数据数组
    data: ["收入", "毛利润", "收入增长率", "利润增长率"], // 每一项与一个 series 的 name 保持一致
    textStyle: {
      color: "#999",
    },
  },
  /* 直角坐标系 grid 中的 x 轴 */
  xAxis: [
    {
      // 坐标轴类型
      type: "category",
      data: ["浙江", "北京", "上海", "广东", "深圳"],
      // 坐标轴指示器配置项
      axisPointer: {
        // 坐标轴指示器类型
        type: "shadow",
      },
    },
  ],
  yAxis: [
    {
      type: "value",
      min: 0,
      max: 10000,
      interval: 2000, // 坐标轴基于max-min的值来用interval分割间隔
      // 坐标轴刻度标签的相关设置
      axisLabel: {
        formatter: "{value} ",
      },
    },
    {
      type: "value",
      min: 0,
      max: 100,
      interval: 20,
      axisLabel: {
        formatter: "{value}%",
      },
    },
  ],
  series: [
    {
      name: "收入",
      type: "bar",
      data: [7000, 7100, 7200, 7300, 7400],
      barWidth: 20, //柱形固定宽度
      itemStyle: {
        //柱形样式
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "#83bff6" },
          { offset: 0.5, color: "#188df0" },
          { offset: 1, color: "#188df0" },
        ]),
      },
    },
    {
      name: "毛利润",
      type: "bar",
      data: [8000, 8200, 8400, 8600, 8800],
      barWidth: 20,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "#25d73c" },
          { offset: 0.5, color: "#1bc23d" },
          { offset: 1, color: "#179e61" },
        ]),
      },
    },
    {
      name: "收入增长率",
      type: "line",
      yAxisIndex: 1, // 与第二个yAxis相关联
      data: [60, 65, 70, 75, 80],
      itemStyle: {
        color: "#67C23A",
      },
    },
    {
      name: "利润增长率",
      type: "line",
      yAxisIndex: 1, // 与第二个yAxis相关联
      data: [70, 75, 80, 85, 90],
      itemStyle: {
        color: "#409EFF",
      },
    },
  ],
};
const chart = ref<any>("");

onMounted(() => {
  // 图表初始化
  /* 这样处理的好处是，通过使用 ref 创建的响应式变量，我们可以保证在图表实例发生变化时，组件能够正确地进行重新渲染。同时，通过使用 markRaw 标记图表实例为“原生”，可以避免出现额外的响应式代理造成的性能开销。 */
  chart.value = markRaw(
    echarts.init(document.getElementById(props.id) as HTMLDivElement)
  );
  chart.value.setOption(options);

  // 大小自适应
  window.addEventListener("resize", () => {
    chart.value.resize();
  });
});

const downloadEchart = () => {
  // 获取画布图表地址信息
  const img = new Image();
  img.src = chart.value.getDataURL({
    // 导出的格式，可选 png, jpg, svg
    type: "png", // 注意：png, jpg 只有在 canvas 渲染器的时候可使用，svg 只有在使用 svg 渲染器的时候可用
    // 导出的图片分辨率比例，默认为 1。
    pixelRatio: 1,
    // 导出的图片背景色，默认使用 option 里的 backgroundColor
    backgroundColor: "#fff",
  });

  // 当图片加载完成后，生成 URL 并下载
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(img, 0, 0, img.width, img.height);
      const link = document.createElement("a");
      link.download = `业绩柱状图.png`;
      link.href = canvas.toDataURL("image/png", 0.9); //得到的与img.src一致的url,0.9表示90%的图片质量
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };
};
</script>
<style lang="scss" scoped>
.title {
  display: flex;
  justify-content: space-between;

  .download {
    cursor: pointer;

    &:hover {
      color: #409eff;
    }
  }
}
</style>
