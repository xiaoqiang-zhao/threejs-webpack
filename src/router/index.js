import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: '/pages/',
    routes: [
        // 默认页面，概述
        {
            path: '/',
            name: 'default',
            component: () => import('@/pages/summary')
        },
        // 概述
        {
            path: '/summary',
            name: 'summary',
            component: () => import('@/pages/summary')
        },
        // 规范基础
        {
            path: '/standard-base',
            name: 'standard-base',
            component: () => import('@/pages/standard-base')
        }
    ]
});
