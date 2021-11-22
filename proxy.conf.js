
const proxyConfig = [

  {
    context: '/api',
    // pathRewrite: {'^/api/iam': ''},
    target: 'https://dev-ecm-mt.bhisma.cloud/api',
    changeOrigin: true,
    secure: false
  },

  // {
  //   context: 'https://bhisma.cloud/api/iam',
  //   pathRewrite: {'^/api/iam': ''},
  //   target: 'http://localhost:8000',
  //   changeOrigin: true,
  //   secure: false
  // },
  // {
  //   context: '/api/catalog',
  //   pathRewrite: {'^/api/catalog': ''},
  //   target: 'https://dev-ecm.bhisma.cloud/api/catalog',
  //   changeOrigin: true,
  //   secure: false
  // },
  // {
  //   context: '/api/order',
  //   pathRewrite: {'^/api/order': ''},
  //   target: 'https://dev-ecm.bhisma.cloud/api/order',
  //   changeOrigin: true,
  //   secure: false
  // },
  // {
  //   context: '/api/fulfillment',
  //   pathRewrite: {'^/api/fulfillment': ''},
  //   target: 'https://dev-ecm.bhisma.cloud/api/fulfillment',
  //   changeOrigin: true,
  //   secure: false
  // },
  // {
  //   context: '/api/cms',
  //   pathRewrite: {'^/api/cms': ''},
  //   target: 'https://dev-ecm.bhisma.cloud/api/cms',
  //   changeOrigin: true,
  //   secure: false
  // },
  // {
  //   context: '/api/iam',
  //   pathRewrite: {'^/api/iam': ''},
  //   target: 'https://dev-ecm.bhisma.cloud/api/iam',
  //   changeOrigin: true,
  //   secure: false
  // },
  // {
  //   context: '/api/client',
  //   pathRewrite: {'^/api/client': ''},
  //   target: 'https://dev-ecm.bhisma.cloud/api/client',
  //   changeOrigin: true,
  //   secure: false
  // },
]

module.exports = proxyConfig;

