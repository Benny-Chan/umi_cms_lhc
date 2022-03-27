import { defineConfig } from 'umi';

export default defineConfig({
  title: '令狐充数据中台',
  nodeModulesTransform: {
    type: 'none',
  },
  antd: {
    dark: false,
    compact: false,
  },
  locale: {
    default: 'zh-CN'
  },
  dva: false,
  hash: true,
  // routes: [
  //   { path: '/', component: '@/pages/index' },
  // ],
  //* -- 远程开发
  proxy:{
    '/api/v1/*': {
      target: 'https://mc-uat.linghuchongtech.com/',
      changeOrigin: true,
    },
  },
  //*/

  /* --本地开发
  proxy:{
    '/api/v1/*': {
      target: 'http://localhost:8080/',
      changeOrigin: true,
      pathRewrite: { "^/api/v1" : "" },
    },
  },
  //*/
});