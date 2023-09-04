<template>
  <div class="login-container">
    <el-form
      ref="loginFormRef"
      :model="loginData"
      :rules="loginRules"
      class="login-form"
    >
      <div class="loginHead">
        <span class="loginText">{{ $t("login.title") }}</span>
        <lang-select style="color: white !important; cursor: pointer" />
      </div>

      <el-form-item prop="username">
        <div style="padding: 0.5rem; color: white">
          <svg-icon icon-name="user" />
        </div>
        <el-input
          ref="username"
          v-model="loginData.username"
          style="flex: 1"
          size="large"
          :placeholder="$t('login.username')"
          name="username"
        />
      </el-form-item>

      <el-tooltip
        :disabled="isCapslock === false"
        content="Caps lock is On"
        placement="right"
      >
        <el-form-item prop="password">
          <span style="padding: 0.5rem; color: white">
            <svg-icon icon-name="password" />
          </span>
          <el-input
            v-model="loginData.password"
            style="flex: 1"
            placeholder="密码"
            :type="passwordVisible === false ? 'password' : 'input'"
            size="large"
            name="password"
            @keyup="checkCapslock"
            @keyup.enter="handleLogin"
          />
          <span
            style="margin-right: 0.5rem"
            @click="passwordVisible = !passwordVisible"
          >
            <svg-icon
              :icon-name="passwordVisible === false ? 'eye' : 'eye-open'"
              style="color: white !important; cursor: pointer"
            />
          </span>
        </el-form-item>
      </el-tooltip>

      <!-- 验证码 -->
      <el-form-item prop="verifyCode">
        <span style="padding: 0.5rem; color: white">
          <svg-icon icon-name="verify_code" />
        </span>
        <!-- autocomplete禁用浏览器的自动填充功能。 -->
        <!-- verifyCode验证码 -->
        <el-input
          v-model="loginData.verifyCode"
          autocomplete="off"
          :placeholder="$t('login.verifyCode')"
          style="width: 60%"
          @keyup.enter="handleLogin"
        />

        <div class="captcha">
          <img :src="captchaBase64" @click="getCaptcha" />
        </div>
      </el-form-item>

      <el-button
        size="default"
        :loading="loading"
        type="primary"
        style="width: 100%"
        @click.prevent="handleLogin"
      >
        {{ $t("login.login") }}
      </el-button>

      <!-- 账号密码提示 -->
      <div style="margin-top: 1rem; font-size: 0.875rem; color: white">
        <span>{{ $t("login.username") }}: admin</span>
        <span style="margin-left: 1rem">
          {{ $t("login.password") }}: 123456
        </span>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import router from "@/router";
import LangSelect from "@/components/LangSelect/index.vue";
import SvgIcon from "@/components/SvgIcon/index.vue";

// 状态管理依赖
import { useUserStore } from "@/store/modules/user";

// API依赖
import { LocationQuery, LocationQueryValue, useRoute } from "vue-router";
import { getCaptchaApi } from "@/api/auth";
import { LoginData } from "@/api/auth/types";

const userStore = useUserStore();
const route = useRoute();

/**
 * 按钮loading
 */
const loading = ref(false);
/**
 * 是否大写锁定
 */
const isCapslock = ref(false);
/**
 * 密码是否可见
 */
const passwordVisible = ref(false);
/**
 * 验证码图片Base64字符串
 */
const captchaBase64 = ref();

/**
 * 登录表单引用
 */
const loginFormRef = ref(ElForm);

const loginData = ref<LoginData>({
  username: "admin",
  password: "123456",
});

const loginRules = {
  username: [{ required: true, trigger: "blur" }],
  password: [{ required: true, trigger: "blur", validator: passwordValidator }],
  verifyCode: [{ required: true, trigger: "blur" }],
};

/**
 * 密码校验器
 */
function passwordValidator(rule: any, value: any, callback: any) {
  if (value.length < 6) {
    callback(new Error("The password can not be less than 6 digits"));
  } else {
    callback();
  }
}

/**
 * 检查输入大小写状态
 */
function checkCapslock(e: any) {
  const { key } = e;
  isCapslock.value = key && key.length === 1 && key >= "A" && key <= "Z";
}

/**
 * 获取验证码
 */
function getCaptcha() {
  getCaptchaApi().then(({ data }) => {
    // verifyCodeKey 验证码缓存key
    const { verifyCodeBase64, verifyCodeKey } = data;
    loginData.value.verifyCodeKey = verifyCodeKey;
    captchaBase64.value = verifyCodeBase64;
  });
}

/**
 * 登录
 */
function handleLogin() {
  loginFormRef.value.validate((valid: boolean) => {
    if (valid) {
      loading.value = true;
      userStore
        .login(loginData.value)
        .then(() => {
          /* 
            处理登录路由有传参的情况（一般是从一个页面注销后跳转到登录页面时）
            即 /login?redirect=/dashboard 的情况，对参数进行处理，并且在登录后跳转到参数给的路由地址 
          */
          const query: LocationQuery = route.query;
          console.log(query); // {redirect: '/dashboard'}

          const redirect = (query.redirect as LocationQueryValue) ?? "/";

          const otherQueryParams = Object.keys(query).reduce(
            // ["redirect"].reduce()
            (acc: any, cur: string) => {
              if (cur !== "redirect") {
                acc[cur] = query[cur];
              }

              return acc; // 键值对
            },
            {} //return acc 即往这个空对象累加键值对
          );
          console.log(otherQueryParams);
          // 登录后跳转到参数给的路由地址
          router.push({ path: redirect, query: otherQueryParams });
        })
        .catch(() => {
          // 验证失败，重新生成验证码
          getCaptcha();
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
}

onMounted(() => {
  getCaptcha();
});
</script>

<style lang="scss" scoped>
.login-container {
  width: 100%;
  min-height: 100%;
  overflow: hidden;
  background-color: #2d3a4b;

  .login-form {
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;

    .loginHead {
      display: flex;
      align-items: center;
      padding-top: 1rem;
      padding-bottom: 1rem;
      color: white;

      .loginText {
        flex: 1;
        font-size: 2rem;
        text-align: center;
      }
    }

    .captcha {
      position: absolute;
      top: 0;
      right: 0;

      img {
        width: 120px;
        height: 48px;
        cursor: pointer;
      }
    }
  }
}

.el-form-item {
  background: rgb(0 0 0 / 10%);
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: 5px;
}

.el-input {
  background: transparent;

  // 子组件 scoped 无效，使用 :deep
  :deep(.el-input__wrapper) {
    padding: 0;
    background: transparent;
    box-shadow: none;

    .el-input__inner {
      color: #fff;
      caret-color: #fff;
      background: transparent;
      border: 0;
      border-radius: 0;

      &:-webkit-autofill {
        box-shadow: 0 0 0 1000px transparent inset !important;
        -webkit-text-fill-color: #fff !important;
      }

      // 设置输入框自动填充的延迟属性
      &:-webkit-autofill,
      &:-webkit-autofill:hover,
      &:-webkit-autofill:focus,
      &:-webkit-autofill:active {
        transition:
          color 99999s ease-out,
          background-color 99999s ease-out;
        transition-delay: 99999s;
      }
    }
  }
}
</style>
