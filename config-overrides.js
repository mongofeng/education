// https://github.com/arackaf/customize-cra
// 启用GZip压缩
const CompressionPlugin = require('compression-webpack-plugin');
const {
  override,
  fixBabelImports,
  addLessLoader,
  addWebpackAlias,
  addWebpackPlugin
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
  addWebpackPlugin(
    new CompressionPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
      threshold: 10240,
      minRatio: 0.8,
      cache: true
    }),
  ),

  addLessLoader({
    javascriptEnabled: true,
    // modifyVars: { "@primary-color": "red" }
  }),
  addWebpackAlias({
    "@": resolve("src"),
    "src": resolve("src")
  })
);
