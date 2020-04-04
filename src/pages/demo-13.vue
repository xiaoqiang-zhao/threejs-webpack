<template>
    <div class="demo-13 markdown">
        <markdown-doc-content :mdContent="mdContent"/>
        <div class="img-text-container" id="img-text-container">
            <img src="/static/img/Maria-Montessori.jpg" alt="图片"/>
            <div>玛利亚-蒙台梭利</div>
        </div>
        <div id="demo2-canvas-container"></div>
        <div class="img-text-container" id="demo2-img-container"></div>
        <div id="demo-canvas-container"></div>
        <markdown-doc-content :mdContent="demoCodeMdContent"/>
    </div>
</template>

<script>
import html2canvas from 'html2canvas';
import * as THREE from 'three/build/three.module.js';
import OrbitControls from 'three-orbit-controls';

import markdownDocContent from '@/components/markdown-doc-content.vue';
import baseMdContent from './demo-13.md';
import demoCodeMdContent from './demo-13-code.md';

const loader = new THREE.FontLoader();

export default {
    components: {
        markdownDocContent
    },
    mounted() {
        this.runDemo();
    },
    data() {
        return {
            mdContent: baseMdContent,
            demoCodeMdContent,
            scene: null,
            renderer: null,
            camera: null,
            space: 10
        };
    },
    methods: {

        /**
         * 运行基础环境
         * 
         * @params {string} containerId canvas 容器id
         */
        runBase(containerId) {
            // 场景
            var scene = new THREE.Scene({
                background: 0x000000
            });

            // 摄像机
            const space = 208;
            const width = 1232;
            const height = 900;
            var camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 300);
            
            camera.position.set(10, 10, 25);
            camera.lookAt(0, 0, 0);

            // 渲染器
            var renderer = new THREE.WebGLRenderer({
                // 抗锯齿
                // antialias: true,
                // 背景透明，可以看到 canvas 下的东西
                // alpha: true
            });
            renderer.setSize(window.innerWidth, window.innerHeight);
            // 开启阴影计算
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.shadowMapSoft = true;

            // 设置大小
            renderer.setSize(width, height);
            // 添加渲染器生成的 canvas 到页面的 body 中
            const canvasContainer = document.getElementById(containerId);
            canvasContainer.appendChild(renderer.domElement);

            // 光 - 环境光使物体整体可见
            var light = new THREE.AmbientLight(0xffffff, 0.8); // soft white light
            scene.add(light);
            // 光 - 平行光展示阴影
            var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
            directionalLight.position.set(10, 10, 20);
            directionalLight.castShadow = true;
            scene.add(directionalLight);
            // 背面光
            var backDirectionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
            backDirectionalLight.position.set(0, 0, -50);
            // 光照开启阴影
            backDirectionalLight.castShadow = true;
            scene.add(backDirectionalLight);

            // 放一个球模拟平行光源
            var sphereMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff
            });
            const sphereGeometry = new THREE.SphereGeometry(0.1, 5, 5);
            var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.position.set(10, 10, 20);
            scene.add(sphere);
            this.scene = scene;
            this.renderer = renderer;
            this.camera = camera;
            return {
                scene,
                renderer,
                camera
            };
        },

        /**
         * 渲染
         */
        render(scene, renderer, camera) {
            // 控制器
            const Controls = OrbitControls(THREE);
            const controls = new Controls(camera, renderer.domElement);
            // 自动围绕目标旋转
            controls.autoRotate = true;

            this.renderer.render(scene, camera);
            // controls.addEventListener('change', (eve) => {
            //     this.renderer.render(scene, camera);
            // });
            function animate() {
                requestAnimationFrame(animate);
                controls.update();
                renderer.render(scene, camera);
            }
            animate();
        },

        /**
         * 运行 Demo: 手动设置航拍轨迹
         */
        runDemo() {
            
            const {scene, renderer, camera} = this.runBase('demo-canvas-container');
            const geometry = new THREE.CubeGeometry(10, 14, 1);

            //添加贴图
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

                    const TextureImg = new THREE.TextureLoader().load(img);
                    const phongMaterial = new THREE.MeshPhongMaterial({
                        color: 0x4169E1,
                        map: TextureImg
                    });
                    const materials = [];
                    const material = new THREE.MeshStandardMaterial({
                        color: 0x4169E1
                    });

                    for (var i = 1; i < 7; ++i) {
                        materials.push(material);
                    }
                    // 朝向光源的一面设置照片
                    materials[4] = phongMaterial;
                    const box = new THREE.Mesh(geometry, materials);
                    scene.add(box);
                });
            }
            this.render(scene, renderer, camera);
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