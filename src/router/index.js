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
        // 航拍
        {
            path: '/demo-01',
            name: 'demo-01',
            component: () => import('@/pages/demo-01')
        },
        // 平面
        {
            path: '/demo-02',
            name: 'demo-02',
            component: () => import('@/pages/demo-02')
        }
    ]
});
