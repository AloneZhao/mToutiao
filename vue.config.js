const path = require("path");
module.exports = {
  lintOnSave: false,
  configureWebpack: config => {
    config.resolve = {
      // 配置解析别名
      extensions: [".js", ".json", ".vue"], // 自动添加文件名后缀
      alias: {
        vue: "vue/dist/vue.js",
        "@": path.resolve(__dirname, "./src"),
        "@styles": path.resolve(__dirname, "./src/styles")
      }
    }
  }
}
