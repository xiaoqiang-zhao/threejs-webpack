<template>
    <div class="standard-base markdown">
        <markdown-doc-content :mdContent="mdContent"/>
        <div class="color-item bacground">
            <span></span> 背景色，色值: #f3f3f3，引用变量: @color-page-background，用途: 页面背景色
        </div>
        <div class="color-item default">
            <span></span> 默认色，色值: #000，引用变量: @color-default，用途: 文字默认色，正文色
        </div>
        <div class="color-item grey">
            <span></span> 灰色，色值: #323232，引用变量: @color-grey，用途: 不重要文字装饰色
        </div>
        <div class="color-item grey-low">
            <span></span> 浅灰色，色值: #908F94，引用变量: @color-grey-low，用途: 不可点击文字颜色
        </div>
        <!-- <div class="color-item default">
            <span></span> 深灰色，色值: #000，引用变量: @color-default，用途: 文字默认色，正文色
        </div> -->
        <div class="color-item active">
            <span></span> 文字高亮色，色值: #908F94，引用变量: @color-grey-low，用途: 文字高亮
        </div>
        <h3>快捷样式规范</h3>
        .content-section, 内容区圆角和阴影
        <div class="component-container">
            <div class="content-section">展示文字内容</div>
        </div>
    </div>
</template>

<script>
import markdownDocContent from '@/components/markdown-doc-content.vue';
import baseMdContent from './standard-base.md';

export default {
    components: {
        markdownDocContent
    },
    data() {
        return {
            mdContent: baseMdContent
        };
    }
};
</script>

<style lang="less" scope>
@import '../assets/base.less';
.standard-base {
    .color-item {
        padding-left: 18px;
        span {
            display: inline-block;
            width: 14px;
            height: 14px;
            vertical-align: -2px;
        }
        &.bacground {
            span {
                background: @color-page-background;
            }
        }
        &.default {
            span {
                background: @color-default;
            }
        }

        &.grey {
            color: @color-grey;
            span {
                background: @color-grey;
            }
        }

        &.grey-low {
            color: @color-grey-low;
            span {
                background: @color-grey-low;
            }
        }

        &.active {
            color: @color-active;
            span {
                background: @color-active;
            }
        }
    }
}
</style>
