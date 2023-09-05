<template>
  <div class="dashboard-container">
    <!-- github角标 -->
    <github-corner class="github-corner" />

    <!-- 用户信息 -->
    <el-row style="margin-bottom: 2rem">
      <el-card style="width: 100%">
        <div class="flx-between flx-wrap">
          <div class="flx-align-center">
            <!-- 确保使用的图片服务支持 imageView2 这个图片处理参数，比如七牛云、腾讯云等。如果您使用的图片服务不支持这个参数，那么添加 ?imageView2/1/w/80/h/80 部分是没有效果的。 -->
            <!-- 在腾讯云的图片处理服务中，imageView2 是图片处理的固定前缀，1 是指定的图片处理指令，具体指令可以有多个选择 -->
            <!-- /w/80/h/80 用来设置图片宽80高80 -->
            <img
              class="user-avatar"
              :src="userStore.avatar + '?imageView2/1/w/80/h/80'"
            />
            <span style="margin-left: 10px; font-size: 16px">
              {{ userStore.nickname }}
            </span>
          </div>

          <div style="line-height: 40px">
            {{ greetings }}
          </div>

          <div class="user-link flx-end">
            <el-link
              disabled
              target="_blank"
              type="danger"
              href="https://blog.csdn.net/u013737132/article/details/130191394"
            >
              💥从零到一文档
            </el-link>
            <el-divider direction="vertical" />
            <el-link
              target="_blank"
              type="primary"
              href="https://github.com/mcmcCat/mmcat-admin"
            >
              GitHub
            </el-link>
          </div>
        </div>
      </el-card>
    </el-row>

    <!-- 数据卡片 -->
    <el-row :gutter="40" style="margin-bottom: 1rem">
      <el-col :xs="24" :sm="12" :lg="6" style="margin-bottom: 1rem">
        <div class="data-box">
          <!-- icon-box的样式 -->
          <div class="icon-box uv">
            <svg-icon icon-name="uv" size="3em" />
          </div>
          <div class="flx-col" style="margin-top: 0.75rem">
            <div style="color: #a3a6ad">访问数</div>
            <div style="font-size: 1.125rem; line-height: 1.75rem">
              {{ Math.round(visitCountOutput) }}
            </div>
          </div>
        </div>
      </el-col>

      <!--消息数-->
      <el-col :xs="24" :sm="12" :lg="6" style="margin-bottom: 4px">
        <div class="data-box">
          <div class="icon-box message">
            <svg-icon icon-name="message" size="3em" />
          </div>
          <div class="flx-col" style="margin-top: 0.75rem">
            <div style="color: #a3a6ad">消息数</div>
            <div style="font-size: 1.125rem; line-height: 1.75rem">
              {{ Math.round(messageCountOutput) }}
            </div>
          </div>
        </div>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6" style="margin-bottom: 4px">
        <div class="data-box">
          <div class="icon-box money">
            <svg-icon icon-name="money" size="3em" />
          </div>
          <div class="flx-col" style="margin-top: 0.75rem">
            <div style="color: #a3a6ad">收入金额</div>
            <div style="font-size: 1.125rem; line-height: 1.75rem">
              {{ Math.round(amountOutput) }}
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6" style="margin-bottom: 4px">
        <div class="data-box">
          <div class="icon-box shopping">
            <svg-icon icon-name="shopping" size="3em" />
          </div>
          <div class="flx-col" style="margin-top: 0.75rem">
            <div style="color: #a3a6ad">订单数</div>
            <div style="font-size: 1.125rem; line-height: 1.75rem">
              {{ Math.round(orderCountOutput) }}
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- Echarts 图表 -->
    <el-row :gutter="40">
      <el-col :sm="24" :lg="8" style="margin-bottom: 1rem">
        <BarChart id="barChart" height="400px" width="100%" />
      </el-col>

      <el-col :xs="24" :sm="12" :lg="8" style="margin-bottom: 1rem">
        <PieChart id="pieChart" height="400px" width="100%" />
      </el-col>

      <el-col :xs="24" :sm="12" :lg="8" style="margin-bottom: 1rem">
        <RadarChart id="radarChart" height="400px" width="100%" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/modules/user";
import { useTransition, TransitionPresets } from "@vueuse/core";

const userStore = useUserStore();

const date: Date = new Date();

/* useTransition是VueUse的一个工具函数，他会在值改变时给其添加上过渡效果 */
const duration = 5000;

// 收入金额
const amount = ref(0);
const amountOutput = useTransition(amount, {
  duration: duration,
  transition: TransitionPresets.easeOutExpo,
});
amount.value = 2000;

// 访问数
const visitCount = ref(0);
const visitCountOutput = useTransition(visitCount, {
  duration: duration,
  transition: TransitionPresets.easeOutExpo,
});
visitCount.value = 2000;

//消息数
const messageCount = ref(0);
const messageCountOutput = useTransition(messageCount, {
  duration: duration,
  transition: TransitionPresets.easeOutExpo,
});
messageCount.value = 2000;

// 订单数
const orderCount = ref(0);
const orderCountOutput = useTransition(orderCount, {
  duration: duration,
  transition: TransitionPresets.easeOutExpo,
});
orderCount.value = 2000;

const greetings = computed(() => {
  if (date.getHours() >= 6 && date.getHours() < 8) {
    return "晨起披衣出草堂，轩窗已自喜微凉🌅！";
  } else if (date.getHours() >= 8 && date.getHours() < 12) {
    return "上午好🌞！";
  } else if (date.getHours() >= 12 && date.getHours() < 18) {
    return "下午好☕！";
  } else if (date.getHours() >= 18 && date.getHours() < 24) {
    return "晚上好🌃！";
  } else if (date.getHours() >= 0 && date.getHours() < 6) {
    return "偷偷向银河要了一把碎星，只等你闭上眼睛撒入你的梦中，晚安🌛！";
  }
});
</script>

<style lang="scss" scoped>
.dashboard-container {
  position: relative;
  padding: 24px;

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .user-link {
    margin-right: 0.5rem;
    margin-left: 0.5rem;
  }

  .github-corner {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 99;
    border: 0;
  }

  .data-box {
    display: flex;
    justify-content: space-between;
    padding: 20px;
    font-weight: bold;
    color: var(--el-text-color-regular);
    background: var(--el-bg-color-overlay);
    border-color: var(--el-border-color);
    box-shadow: var(--el-box-shadow-dark);

    .icon-box {
      padding: 0.75rem;
      border-radius: 0.25rem;

      &.uv {
        color: #40c9c6; // 继承给子元素 .svg-icon的currentColor
        &:hover {
          color: #fff;
          background-color: #40c9c6;
        }

        .svg-icon {
          fill: currentcolor !important;
        }
      }

      &.message {
        color: #36a3f7; // 继承给子元素 .svg-icon的currentColor
        &:hover {
          color: #fff;
          background-color: #36a3f7;
        }

        .svg-icon {
          fill: currentcolor !important;
        }
      }

      &.money {
        color: #f4516c; // 继承给子元素 .svg-icon的currentColor
        &:hover {
          color: #fff;
          background-color: #f4516c;
        }

        .svg-icon {
          fill: currentcolor !important;
        }
      }

      &.shopping {
        color: #34bfa3; // 继承给子元素 .svg-icon的currentColor
        &:hover {
          color: #fff;
          background-color: #34bfa3;
        }

        .svg-icon {
          fill: currentcolor !important;
        }
      }
    }
  }
}
// .el-card {
//   --el-card-bg-color: var(--el-bg-color-overlay);
// }
</style>
