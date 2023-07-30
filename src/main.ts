import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:svg-icons-register'; //  处理注册第三方图标库
import router from "@/router";
import { setupStore } from '@/store';
import { setupDirective } from '@/directive'; // 注册自定义指令

import '@/permission';

// 国际化
import i18n from '@/lang/index';

// 样式
import 'element-plus/theme-chalk/dark/css-vars.css';
import '@/styles/index.scss';


const app = createApp(App)
// 全局注册 自定义指令(directive)
setupDirective(app);

// 全局注册 状态管理(store)
setupStore(app);

app.use(router).use(i18n).mount('#app');
