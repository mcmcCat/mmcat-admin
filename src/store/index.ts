import type { App } from 'vue';
import { createPinia } from 'pinia';

const store = createPinia();

// 用于在main.ts中全局注册 store
export function setupStore(app: App<Element>) {
  app.use(store);
}

/*
 通过导出 { store }，可以方便地在应用程序的其他模块中访问和操作全局的 store 实例，避免了重复创建和管理 store 实例的复杂性。
*/
export { store };
