module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8732/api/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
