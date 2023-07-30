module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:vue/vue3-essential",
        "./.eslintrc-auto-import.json"
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "parser": "@typescript-eslint/parser",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint",
        "vue"
    ],
    "rules": {
        "vue/multi-word-component-names": "off", // 关闭组件名必须多字： https://eslint.vuejs.org/rules/multi-word-component-names.html
        "@typescript-eslint/no-empty-function": "off", // 关闭空方法检查
        "@typescript-eslint/no-explicit-any": "off", // 关闭any类型的警告
        "vue/no-v-model-argument": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "no-unused-vars": "off",//未读取值的变量报错
        "@typescript-eslint/no-unused-vars": "off",//未读取值的变量报错
        "no-undef": "off",//未声明变量报错（主要解决自动导入的element组件直接使用时的报错）
    }
}
