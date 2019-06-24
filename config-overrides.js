// https://github.com/arackaf/customize-cra
const {
  override,
  fixBabelImports,
  addLessLoader,
  addWebpackAlias
} = require("customize-cra");
const path = require("path");
function resolve(dir) {
  return path.join(__dirname, ".", dir);
}
const rewiredMap = () => config => {
  config.devtool = config.mode === 'development' ? 'cheap-module-source-map' : false;
  return config;
};
module.exports = override(
  // 关闭mapSource
  rewiredMap(),
  fixBabelImports("antd", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: true
  }),
  // fixBabelImports("ant-design-pro", {
  //   libraryName: "ant-design-pro",
  //   libraryDirectory: "lib",
  //   style: true,
  // }),
  addLessLoader({
    javascriptEnabled: true,
    // modifyVars: { "@primary-color": "red" }
  }),
  addWebpackAlias({
    "@": resolve("src"),
    "src": resolve("src")
  })
);
