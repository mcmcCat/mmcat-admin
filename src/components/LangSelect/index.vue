<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useAppStore } from "@/store/modules/app";

const appStore = useAppStore();
const { locale } = useI18n(); // 这个是能够让你使用之前createI18n()创建出来的I18n实例的API

function handleLanguageChange(lang: string) {
  locale.value = lang; // 虽然创建时用的是 locale: appStore.language,但是其只会在创建时赋值并不会再动态赋值，所以这里我们需要手动的赋值
  appStore.changeLanguage(lang);
  if (lang == "en") {
    ElMessage.success("Switch Language Successful!");
  } else {
    ElMessage.success("切换语言成功！");
  }
}
</script>

<template>
  <el-dropdown trigger="click" @command="handleLanguageChange">
    <div>
      <svg-icon icon-name="language" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          :disabled="appStore.language === 'zh-cn'"
          command="zh-cn"
        >
          中文
        </el-dropdown-item>
        <el-dropdown-item :disabled="appStore.language === 'en'" command="en">
          English
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
