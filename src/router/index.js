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
        // 点
        {
            path: '/demo-02',
            name: 'demo-02',
            component: () => import('@/pages/demo-02')
        },
        // 线
        {
            path: '/demo-03',
            name: 'demo-03',
            component: () => import('@/pages/demo-03')
        },
        // 平面
        {
            path: '/demo-04',
            name: 'demo-04',
            component: () => import('@/pages/demo-04')
        },
        // 体
        {
            path: '/demo-05',
            name: 'demo-05',
            component: () => import('@/pages/demo-05')
        },
        // 文字
        {
            path: '/demo-06',
            name: 'demo-06',
            component: () => import('@/pages/demo-06')
        },
        // 用户交互
        {
            path: '/demo-07',
            name: 'demo-07',
            component: () => import('@/pages/demo-07')
        },

        // --- 综合示例 --- //
        // 时间线
        {
            path: '/demo-10',
            name: 'demo-10',
            component: () => import('@/pages/demo-10')
        },
        // 纹理贴图
        {
            path: '/demo-11',
            name: 'demo-11',
            component: () => import('@/pages/demo-11')
        },
        // canvas 加载文字和图片
        {
            path: '/demo-12',
            name: 'demo-12',
            component: () => import('@/pages/demo-12')
        },
        // 贴图和文字性能优化
        {
            path: '/demo-13',
            name: 'demo-13',
            component: () => import('@/pages/demo-13')
        },
        // 全屏性能测试
        {
            path: '/demo-15',
            name: 'demo-15',
            component: () => import('@/pages/demo-15')
        }
    ]
});
