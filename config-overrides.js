// https://github.com/arackaf/customize-cra
// 启用GZip压缩
const CompressionPlugin = require('compression-webpack-plugin');
const {
  override,
  fixBabelImports,
  addLessLoader,
  addWebpackAlias,
  overrideDevServer,
  addWebpackPlugin
} = require("customize-cra");
const path = require("path");
function resolve(dir) {
  return path.join(__dirname, ".", dir);
}


const { name } = require('./package');


const adjustOutput = () => config => {
  config.output.library = `${name}-[name]`;
  config.output.libraryTarget = 'umd';
  config.output.jsonpFunction = `webpackJsonp_${name}`;
  config.output.globalObject = 'window';

  console.log(config)

  return config;
};


const adjustDevServer = () => config => {
  // config.disableHostCheck = true
  // config.headers = config.headers || {}
  // config.headers['Access-Control-Allow-Origin'] = '*'
  // return config
  config.headers = {
    'Access-Control-Allow-Origin': '*',
  };
  config.hot = false;
  config.watchContentBase = false;
  // config.liveReload = false;
  return config;
}




module.exports = {
  webpack: override(
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
    }),
    adjustOutput()
  ),
  devServer: overrideDevServer(
    // dev server plugin
    adjustDevServer()
  )
};


