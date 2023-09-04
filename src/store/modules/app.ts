import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import defaultSettings from "@/settings";

// 导入 Element Plus 中英文语言包
import zhCn from "element-plus/es/locale/lang/zh-cn";
import en from "element-plus/es/locale/lang/en";

// setup
export const useAppStore = defineStore("app", () => {
  // state
  // const device = useStorage("device", "desktop");
  const elSize = useStorage<any>("elSize", defaultSettings.elSize);
  const language = useStorage("language", defaultSettings.language);

  const sidebarStatus = useStorage("sidebarStatus", "closed");
  const sidebar = reactive({
    opened: sidebarStatus.value !== "closed", // 由于sidebarStatus存储在localstore中，可能为undefined，所以需要这个方式判断
    withoutAnimation: false, // 侧边栏打开关闭是否有动画,false即开启动画
  });

  /**
   * 根据语言标识读取对应的语言包
   */
  const locale = computed(() => {
    if (language?.value == "en") {
      return en;
    } else {
      return zhCn;
    }
  });

  // actions
  function toggleSidebar(withoutAnimation: boolean) {
    console.log("toggleSidebar的sidebar.opened:", !sidebar.opened);
    sidebar.opened = !sidebar.opened;
    sidebar.withoutAnimation = withoutAnimation;
    if (sidebar.opened) {
      sidebarStatus.value = "opened";
    } else {
      sidebarStatus.value = "closed";
    }
  }

  function closeSideBar(withoutAnimation: boolean) {
    sidebar.opened = false;
    sidebar.withoutAnimation = withoutAnimation;
    sidebarStatus.value = "closed";
  }

  function openSideBar(withoutAnimation: boolean) {
    sidebar.opened = true;
    sidebar.withoutAnimation = withoutAnimation;
    sidebarStatus.value = "opened";
  }

  // function toggleDevice(val: string) {
  //   device.value = val;
  // }

  function changeSize(val: string) {
    elSize.value = val;
  }
  // /**
  //  * 切换语言
  //  *
  //  * @param val
  //  */
  function changeLanguage(val: string) {
    language.value = val;
  }

  return {
    // device,
    sidebar,
    language,
    locale,
    elSize,
    // toggleDevice,
    changeSize,
    changeLanguage,
    toggleSidebar,
    closeSideBar,
    openSideBar,
  };
});
