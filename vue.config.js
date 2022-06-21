module.exports = {

  // 配置代码被编译时，静态资源的访问路径
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',

  // 开发环境，配置代理服务器
  devServer: {
    proxy: 'http://localhost:9001'
  }
}
