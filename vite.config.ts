import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { visualizer } from "rollup-plugin-visualizer";
import viteCompression from "vite-plugin-compression";

const pathSrc = path.resolve(__dirname, "src");

// https://vitejs.dev/config/
export default ({ mode }: any) => {
  const env = loadEnv(mode, process.cwd()); // 获取当前环境的环境变量，process.cwd()当前工作的绝对路径
  return defineConfig({
    build: {
      target: "es2020",
      minify: "terser", // Vite 2.6.x 以上需要配置 minify: "terser", terserOptions 才能生效
      terserOptions: {
        compress: {
          // 生产环境时移除console
          drop_console: true,
          drop_debugger: true,
        },
      },
      // rollup 配置
      rollupOptions: {
        output: {
          chunkFileNames: "js/[name]-[hash].js", // 产生的 chunk 自定义命名
          entryFileNames: "js/[name]-[hash].js", // 指定 chunks 的入口文件匹配模式
          assetFileNames: "[ext]/[name]-[hash].[ext]", // 自定义构建结果中的静态资源名称，资源文件像 字体，图片等
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return "vendor";
            }
          },
        },
        plugins: [
          viteCompression({
            algorithm: "gzip", // 压缩算法，默认为'gzip'
            ext: ".gz", // 压缩文件扩展名，默认为'.gz'
            threshold: 10240, // 文件大小超过threshold时才会进行压缩，默认为10KB (10240 bytes)
            deleteOriginFile: false, // 是否删除原始文件，默认为false
            verbose: true, // 是否在控制台显示压缩信息，默认为true
          }),
        ],
      },
    },
    // 配置路径别名
    resolve: {
      alias: [
        {
          find: "@",
          replacement: pathSrc,
        },
        // [Vue Warning] ：vue-i18n官方建议您在配置打包工具时，将特性标志全局变量明确地替换为布尔字面量，以便在最终的打包文件中获得正确的树摇（tree-shaking）效果。
        {
          find: "vue-i18n",
          replacement: "vue-i18n/dist/vue-i18n.cjs.js",
        },
      ],
    },
    css: {
      // CSS 预处理器
      preprocessorOptions: {
        //define global scss variable
        scss: {
          javascriptEnabled: true,
          additionalData: `@use "@/styles/variables.scss" as *;`, // @use 文件路径 as * 将该文件中的所有变量挂载到全局，所有的scss文件或者<style lang="scss">中都可以使用
        },
      },
    },
    server: {
      host: "0.0.0.0",
      port: Number(env.VITE_APP_PORT),
      open: true, // 运行自动打开浏览器
      // 反向代理解决跨域
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: "http://vapi.youlai.tech",
          changeOrigin: true,
          rewrite: (path) => {
            return path.replace(new RegExp("^" + env.VITE_APP_BASE_API), "");
          },
        },
      },
    },
    plugins: [
      vue(),
      visualizer(),
      AutoImport({
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        // 自动导入 VueUse 相关函数，如 useDark() ,useToggle()
        imports: ["vue", "@vueuse/core"],
        eslintrc: {
          enabled: false, // 是否自动生成 eslint 规则，建议生成之后设置 false
          filepath: "./.eslintrc-auto-import.json", // 指定自动导入函数 eslint 规则的文件
        },
        resolvers: [
          // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
          ElementPlusResolver(),
          // 自动导入图标组件
          IconsResolver({}),
        ],
        vueTemplate: true, // 是否在 vue 模板中自动导入
        dts: false, //自动导入完设置为false，不然每次启动项目都会导入一次
        // dts: path.resolve(pathSrc, "types", "auto-imports.d.ts"), // 指定自动导入函数TS类型声明文件路径
      }),
      Components({
        resolvers: [
          // 自动导入 Element Plus 组件
          ElementPlusResolver(),
          // 自动注册图标组件
          IconsResolver({
            enabledCollections: ["maki", "ep"], // @iconify-json/maki 和 @iconify-json/ep是 Element Plus 的图标库，其他图标库 https://icon-sets.iconify.design/
          }),
        ],
        dirs: ["src/**/components"], //表示匹配 src 目录下及其子目录下的所有 带有字符串"components" 的目录
        dts: false, //自动导入完设置为false，不然每次启动项目都会导入一次
        // dts: path.resolve(pathSrc, "types", "components.d.ts"), // 指定自动导入组件TS类型声明文件路径
      }),
      Icons({
        // 自动安装图标库,会自动安装指定的图标库ep
        autoInstall: true,
      }),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
        // 指定symbolId格式
        symbolId: "icon-[dir]-[name]",
      }),
    ],
    // 优化依赖项（即第三方库）的加载和打包,使它们在预构建阶段单独处理并缓存，从而加快 开发时的启动速度
    optimizeDeps: {
      // 用于指定需要优化的依赖包的名称或路径
      include: [
        "vue",
        "vue-router",
        "pinia",
        "axios",
        "element-plus/es/components/form/style/css",
        "element-plus/es/components/form-item/style/css",
        "element-plus/es/components/button/style/css",
        "element-plus/es/components/input/style/css",
        "element-plus/es/components/input-number/style/css",
        "element-plus/es/components/switch/style/css",
        "element-plus/es/components/upload/style/css",
        "element-plus/es/components/menu/style/css",
        "element-plus/es/components/col/style/css",
        "element-plus/es/components/icon/style/css",
        "element-plus/es/components/row/style/css",
        "element-plus/es/components/tag/style/css",
        "element-plus/es/components/dialog/style/css",
        "element-plus/es/components/loading/style/css",
        "element-plus/es/components/radio/style/css",
        "element-plus/es/components/radio-group/style/css",
        "element-plus/es/components/popover/style/css",
        "element-plus/es/components/scrollbar/style/css",
        "element-plus/es/components/tooltip/style/css",
        "element-plus/es/components/dropdown/style/css",
        "element-plus/es/components/dropdown-menu/style/css",
        "element-plus/es/components/dropdown-item/style/css",
        "element-plus/es/components/sub-menu/style/css",
        "element-plus/es/components/menu-item/style/css",
        "element-plus/es/components/divider/style/css",
        "element-plus/es/components/card/style/css",
        "element-plus/es/components/link/style/css",
        "element-plus/es/components/breadcrumb/style/css",
        "element-plus/es/components/breadcrumb-item/style/css",
        "element-plus/es/components/table/style/css",
        "element-plus/es/components/tree-select/style/css",
        "element-plus/es/components/table-column/style/css",
        "element-plus/es/components/select/style/css",
        "element-plus/es/components/option/style/css",
        "element-plus/es/components/pagination/style/css",
        "element-plus/es/components/tree/style/css",
        "element-plus/es/components/alert/style/css",
        "@vueuse/core",

        "path-to-regexp",
        "echarts",
        "@wangeditor/editor",
        "@wangeditor/editor-for-vue",
        "vue-i18n",
        "codemirror",
      ],
    },
  });
};
