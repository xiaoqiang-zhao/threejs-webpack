<template>
    <div class="xiaoqiangzhao-app">
        <section>
            <nav>
                <router-link
                    v-for="item in nav"
                    :key="item.name"
                    :to="'/' + item.name"
                    :class="{
                        'level-1': item.level === 1,
                        'level-2': item.level === 2,
                        'active': $route.name === item.name || item.aliasName === $route.name
                    }">
                    {{item.text}}
                </router-link>
            </nav>
            <router-view class="content content-section"/>
        </section>
    </div>
</template>

<script>
// 常用组件的样式
import 'element-ui/lib/theme-chalk/breadcrumb.css';
import 'element-ui/lib/theme-chalk/button.css';
import 'element-ui/lib/theme-chalk/date-picker.css';
import 'element-ui/lib/theme-chalk/dialog.css';
// import 'element-ui/lib/theme-chalk/main.css';
import 'element-ui/lib/theme-chalk/icon.css';
import 'element-ui/lib/theme-chalk/input.css';
import 'element-ui/lib/theme-chalk/pagination.css';
import 'element-ui/lib/theme-chalk/popover.css';
import 'element-ui/lib/theme-chalk/table.css';

export default {
    name: 'App',
    data() {
        return {
            nav: [
                {
                    name: 'summary',
                    aliasName: 'default',
                    text: 'ThreeJs Demo 集合',
                    level: 1
                },
                {
                    name: 'demo-01',
                    text: 'Camera 航拍',
                    level: 2
                },
                {
                    name: 'demo-02',
                    text: '点(Point)',
                    level: 2
                },
                {
                    name: 'demo-03',
                    text: '线(Line)',
                    level: 2
                },
                {
                    name: 'demo-04',
                    text: '面(Plane)',
                    level: 2
                },
                {
                    name: 'demo-05',
                    text: '体(ConeGeometry)',
                    level: 2
                },
                {
                    name: 'demo-06',
                    text: '文字(Text)',
                    level: 2
                },
                {
                    name: 'demo-07',
                    text: '交互(Interaction)',
                    level: 2
                },
                {
                    name: 'demo-10',
                    text: '时间线(TimeLine)',
                    level: 2
                },
                {
                    name: 'demo-11',
                    text: '纹理贴图(Texture)',
                    level: 2
                }
            ]
        };
    }
};
</script>

<style lang="less" scope>
@import './assets/base.less';
.xiaoqiangzhao-app {
    > header {
        border-bottom: @border;
        line-height: 79px;
        font-size: 18px;
        img {
            display: inline-block;
            vertical-align: middle;
            height: 38px;
        }
        span {
            padding-left: 8px;
            border-left: @border;
            vertical-align: -4px;
            line-height: 18px;
        }
    }
    > section {
        display: flex;
        > nav {
            flex: 0 0 160px;
            padding-top: 15px;
            a {
                display: block;
            }
            .level-1 {
                height: 40px;
                font-size: 16px;
                color: @color-default;
                line-height: 40px;
                font-weight: 700;
            }
            .level-2 {
                color: @color-grey;
                margin: 3px 0;
            }
            .active {
                color: @color-active;
            }
        }
        .content {
            flex: 1;
            padding: 14px;
        }
    }
}
</style>
// 基准样式和定制样式
<style lang="less">
@import './assets/common.less';
// @import '../packages/style/customization-style.less';
</style>
