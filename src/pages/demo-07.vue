<template>
    <div class="demo-04 markdown">
        <markdown-doc-content :mdContent="mdContent"/>
        <div id="demo-canvas-container"></div>
        <markdown-doc-content :mdContent="demoCodeMdContent"/>
    </div>
</template>

<script>
import * as THREE from 'three/build/three.module.js';
import OrbitControls from 'three-orbit-controls';

import markdownDocContent from '@/components/markdown-doc-content.vue';
import baseMdContent from './demo-07.md';
import demoCodeMdContent from './demo-07-code.md';

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
            camera: null,
            renderer: null
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
            var camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);
            
            camera.position.set(5, 0, 21);
            camera.lookAt(0, 0, 0);

            // 渲染器
            var renderer = new THREE.WebGLRenderer({
                // 抗锯齿
                antialias: true,
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
            directionalLight.position.set(2, 5, 5);
            directionalLight.castShadow = true;
            scene.add(directionalLight);
            // 背面光
            var backDirectionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
            backDirectionalLight.position.set(0, 0, -50);
            // 光照开启阴影
            backDirectionalLight.castShadow = true;
            scene.add(backDirectionalLight);

            this.camera = camera;
            this.renderer = renderer;
            return {
                scene,
                renderer,
                camera
            };
        },

        /**
         * 添加从原点出发的线
         * 
         * @param {Object} scene 场景对象
         * @param {Array} vector 第二坐标点(原点是第一坐标点)
         * @param {number} color 16进制颜色值
         */
        addLine(scene, vector, color) {
            // 添加线
            const linePoints = [];
			linePoints.push(new THREE.Vector3(0, 0, 0));
			linePoints.push(new THREE.Vector3(...vector));
			const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);

			const lineMaterial = new THREE.LineBasicMaterial({
				color
			});
			const line = new THREE.Line(lineGeometry, lineMaterial);
            scene.add(line);
            
            // 添加箭头
            // 半径，高度，分段数
            const geometry = new THREE.ConeGeometry(0.1, 0.2, 10);
            const material = new THREE.MeshStandardMaterial({
                color
            });
            const cone = new THREE.Mesh(geometry, material);
            cone.position.set(...vector);
            let [x, y, z] = vector;
            let text = 'y';
            if (x !== 0) {
                cone.rotateZ(-Math.PI / 2);
                text = 'x'
            }
            if (z !== 0) {
                cone.rotateX(Math.PI / 2);
                text = 'z';
            }
            scene.add(cone);

            // 添加文字
            loader.load('/static/font/NewYork.json', font => {
                const geometry = new THREE.TextGeometry(text, {
                    font: font,
                    size: 0.3,
                    height: 0.01, // 文字厚度
                    curveSegments: 12, // 弧线分段数，使得文字的曲线更加光滑
                    bevelEnabled: true,
                    bevelThickness: 0.01, // 倒角厚度
                    bevelSize: 0.01, // 倒角宽度
                    bevelSegments: 5 // 弧线分段数，使得文字的曲线更加光滑
                });
                geometry.computeBoundingBox();
                geometry.computeVertexNormals();

                const material = [new THREE.MeshPhongMaterial({
                    color
                })];

                const mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(x, y + 0.3, z);
                scene.add(mesh);
                this.renderer.render(scene, this.camera);
            });
        },

        /**
         * 添加坐标辅助线
         * 
         * @param {Object} scene 场景对象
         */
        addHelperLine(scene) {
            // x 轴 红色
            this.addLine(scene, [10, 0, 0], 0xFF0000);

            // y 轴  绿色
            this.addLine(scene, [0, 10, 0], 0x00FF00);
			
            // z 轴 蓝色
            this.addLine(scene, [0, 0, 10], 0x0000FF);

            const geometry = new THREE.ConeGeometry(1, 2, 10);
            const material = new THREE.MeshBasicMaterial({
                color: 0x00FF00
            });
        },

        /**
         * 渲染
         */
        render(scene, renderer, camera) {
            // 控制器
            const Controls = OrbitControls(THREE);
            const controls = new Controls(camera, renderer.domElement);

            controls.update();
            renderer.render(scene, camera);

            controls.addEventListener('change', (eve) => {
                renderer.render(scene, camera);
            });
        },

        /**
         * 运行 Demo: 手动设置航拍轨迹
         */
        runDemo() {
            
            const {scene, renderer, camera} = this.runBase('demo-canvas-container');
            this.addHelperLine(scene);

            this.render(scene, renderer, camera);
        }
    }
};
</script>
