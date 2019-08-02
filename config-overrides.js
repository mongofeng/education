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

module.exports = override(
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
