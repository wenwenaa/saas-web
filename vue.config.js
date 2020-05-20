const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  publicPath: '',
  outputDir: process.env.outputDir,
  assetsDir: 'static',
  lintOnSave: true,
  productionSourceMap: false,
  devServer: {
    open: true,
    hot: true,
    hotOnly: true,
    proxy: {
      '/platform/': {
        target: 'http://192.168.1.16/cloud-gateway',
        changeOrigin: true,
        pathRewrite: {
          '^/cloud-gateway/platform': ''
        }
      },
      // '/platform/': {
      //   target: 'http://192.168.3.23:9101',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/platform': ''
      //   }
      // },
      '/saas-mes/': {
        target: 'http://192.168.3.23:9102',
        changeOrigin: true,
        pathRewrite: {
          '^/saas-mes': ''
        }
      }
    }
  },
  configureWebpack: { // webpack 配置
    output: { // 输出重构  打包编译后的 文件名称  【模块名称.版本号.js】
      filename: `static/js/[hash].js`
    },
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias.set('@', resolve('src'))
  }
}

