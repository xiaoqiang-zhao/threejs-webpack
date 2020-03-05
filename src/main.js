import Vue from 'vue';
import axios from 'axios';
import elementUI from 'element-ui';
import App from './App';
import router from './router';

Vue.prototype.$http = axios;
Vue.use(elementUI);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: '#xiaoqiangzhao-app',
    router,
    render: h => h(App)
});

// 发起请求的全局配置
axios.interceptors.request.use(function (config) {
    config.baseURL = '/api/';
    // 为 md 文件的加载做特殊处理
    const staticDocPath = '/static/doc/';
    if (config.url.indexOf(staticDocPath) === 0) {
        config.baseURL = '/';
    }
    return config;
});
