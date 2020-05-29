
const proxyConfig = [

  // {
  //   context: '/api',
  //   // pathRewrite: {'^/api/iam': ''},
  //   target: 'http://127.0.0.1:4201',
  //   changeOrigin: true,
  //   secure: false
  // },

  // {
  //   context: 'https://bhisma.cloud/api/iam',
  //   pathRewrite: {'^/api/iam': ''},
  //   target: 'http://localhost:8000',
  //   changeOrigin: true,
  //   secure: false
  // },
  {
    context: '/api/catalog',
    pathRewrite: {'^/api/catalog': ''},
    target: 'http://127.0.0.1:8001',
    changeOrigin: true,
    secure: false
  },
  {
    context: '/api/iam',
    pathRewrite: {'^/api/iam': ''},
    target: 'http://127.0.0.1:8000',
    changeOrigin: true,
    secure: false
  }
]

module.exports = proxyConfig;

