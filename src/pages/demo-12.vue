<template>
    <div class="demo-04 markdown">
        <markdown-doc-content :mdContent="mdContent"/>
        <canvas id="demo-canvas-container" width="1232" height="450"></canvas>
        <p>用 dom 和 css 写一个。</p>
        <div class="img-text-container" id="img-text-container">
            <img src="/static/img/Maria-Montessori.jpg" alt="图片"/>
            <div>玛利亚-蒙台梭利</div>
        </div>
        <p>把 dom 内容和样式渲染进 canvas</p>
        <div id="demo2-canvas-container"></div>
        <p>最后将 canvas 最为图片输出</p>
        <div class="img-text-container" id="demo2-img-container"></div>
        <markdown-doc-content :mdContent="demoCodeMdContent"/>
    </div>
</template>

<script>
import html2canvas from 'html2canvas';

import baseMdContent from './demo-12.md';
import demoCodeMdContent from './demo-12-code.md';
import markdownDocContent from '@/components/markdown-doc-content.vue';

export default {
    components: {
        markdownDocContent
    },
    mounted() {
        this.runDemo();
        this.runDemo2();
    },
    data() {
        return {
            mdContent: baseMdContent,
            demoCodeMdContent
        };
    },
    methods: {

        /**
         * 运行 Demo
         */
        runDemo() {
            const canvasDom = document.getElementById('demo-canvas-container');
            const canvasContext = canvasDom.getContext('2d');

            // 填充背景颜色
            canvasContext.fillStyle = '#99f';
            canvasContext.fillRect(0, 0, 1000,1000);

            // 添加图片
            const img = new Image;
            img.src = '/static/img/Maria-Montessori.jpg';

            img.onload = function () {
                // 图片渲染进画布
                canvasContext.drawImage(img, 70, 70);
                // 文字渲染进画布
                canvasContext.fillStyle = '#fff';   // 文字填充颜色
                canvasContext.font = '14px Adobe Ming Std';
                canvasContext.fillText('玛利亚-蒙台梭利', 120, 340);
            }

            canvasContext.stroke();
        },

        /**
         * 把 dom 内容和样式渲染进 canvas
         */
        runDemo2() {
            const imgTextContainerDom = document.getElementById('img-text-container');
            
            imgTextContainerDom.firstElementChild.onload = function() {
                // 放入 dom
                html2canvas(imgTextContainerDom).then(canvas => {
                    document.getElementById('demo2-canvas-container').appendChild(canvas);

                    const img = canvas.toDataURL("image/png");
                    const demo2ImgContainer = document.getElementById('demo2-img-container');
                    const imgDom = document.createElement('img');
                    imgDom.src = img;
                    demo2ImgContainer.appendChild(imgDom);
                });
            }
        }
    }
};
</script>
<style lang="less" scoped>
.img-text-container {
    position: relative;
    display: inline-block;
    > img {
        display: block;
    }
    > div {
        width: 100%;
        text-align: center;
        position: absolute;
        bottom: 0;
        color: white;
        font-size: 14px;
        line-height: 2em;
    }
}
</style>