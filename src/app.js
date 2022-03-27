import { Provider } from 'mobx-react';
import {loadingStore} from 'mobx-loading';
import {IntlProvider,history} from 'umi';
import session from '@/stores/session';

// 运行时修改路由
export function patchRoutes(routes) {
  // Modify routes as you wish
}

// 自定义 render，比如在 render 前做权限校验
export async function render(oldRender) {
  if(!session.user){
    await session.fetchCurrentUser();
  }
  if(!session.user) {
    history.push('/login');
  }
  oldRender();
}

// 自定义 rootContainer，解决之前使用数据流库（比如 unstated、redux）麻烦的问题
export function rootContainer(container) {
  const React = require('react');
  if (process.env.NODE_ENV !== 'production') {
    const w1 = React.createElement(IntlProvider, {onError: (s)=>{}}, container);
    return React.createElement(Provider, {loading: loadingStore}, w1);
  }else{
    const w1 = React.createElement(Provider, {loading: loadingStore}, container);
    return w1
  }
}

