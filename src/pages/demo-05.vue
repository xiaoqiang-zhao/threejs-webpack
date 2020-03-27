<template>
    <div class="demo-04 markdown">
        <markdown-doc-content :mdContent="mdContent"/>
        <div id="demo-canvas-container"></div>
        <markdown-doc-content :mdContent="demoCodeMdContent"/>
        <div id="rotate-demo-canvas-container"></div>
    </div>
</template>

<script>
import * as THREE from 'three/build/three.module.js';
import OrbitControls from 'three-orbit-controls';

import markdownDocContent from '@/components/markdown-doc-content.vue';
import baseMdContent from './demo-05.md';
import demoCodeMdContent from './demo-05-code.md';

const loader = new THREE.FontLoader();

export default {
    components: {
        markdownDocContent
    },
    mounted() {
        this.runDemo();
        this.runRotateDemo();
    },
    data() {
        return {
            mdContent: baseMdContent,
            demoCodeMdContent
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
            
            camera.position.set(10, 10, 10);
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

            // 放一个球模拟平行光源
            var sphereMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff
            });
            const sphereGeometry = new THREE.SphereGeometry(0.1, 5, 5);
            var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.position.set(2, 5, 5);
            scene.add(sphere);

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
            // 自动围绕目标旋转
            controls.autoRotate = true;
            controls.keys = {
                LEFT: 37, //left arrow
                UP: 38, // up arrow
                RIGHT: 39, // right arrow
                BOTTOM: 40 // down arrow
            };

            controls.update();
            function animate() {

                requestAnimationFrame(animate);

                // required if controls.enableDamping or controls.autoRotate are set to true
                controls.update();
                // renderer.setClearAlpha(0.0);
                renderer.render(scene, camera);

            }
            animate();
        },

        /**
         * 运行 Demo: 手动设置航拍轨迹
         */
        runDemo() {
            const {scene, renderer, camera} = this.runBase('demo-canvas-container');
            this.addHelperLine(scene);

            // 添加圆锥体
            // 半径，高度，分段数
            const geometry = new THREE.ConeGeometry(1, 2, 100);
            const material = new THREE.MeshStandardMaterial({
                color: 0x4169E1
            });
            const arr = [
                [1, 0, 0],
                [0, 1, 0],
                [0, 0, 1],
                [-1, 0, 0],
                [0, -1, 0],
                [0, 0, -1]
            ];

            arr.forEach(item => {
                const mesh = new THREE.Mesh(geometry, material);
                let [x, y, z] = item;

                const space = 3;
                x *= space;
                y *= space;
                z *= space;
                mesh.position.set(x, y, z);
                // 光照阴影
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                scene.add(mesh);
            });

            this.render(scene, renderer, camera);
        },

        /**
         * 运行旋转 Demo
         */
        runRotateDemo() {
            const {scene, renderer, camera} = this.runBase('rotate-demo-canvas-container');
            this.addHelperLine(scene);

            // 添加圆锥体
            // 半径，高度，分段数
            const geometry = new THREE.ConeGeometry(1, 2, 100);
            const material = new THREE.MeshStandardMaterial({
                color: 0x4169E1
            });
            const arr = [
                // X 轴正方向上的圆锥体，绕 Z 轴方向旋转 -90度，也就是 -0.5 弧度
                [1, 0, 0, 'Z', -0.5],
                // Y 轴正方向上的圆锥体，不需要旋转
                [0, 1, 0, 'Y', 0],
                // Z 轴正方向上的圆锥体，绕 X 轴方向旋转 90度，也就是 0.5 弧度
                [0, 0, 1, 'X', 0.5],
                // X 轴负方向上的圆锥体，绕 Z 轴方向旋转 90度， 0.5 弧度
                [-1, 0, 0, 'Z', 0.5],
                // Y 轴负方向上的圆锥体，绕 X 轴方向旋转 180度，也就是 1 弧度
                [0, -1, 0, 'X', 1],
                // Z 轴负方向上的圆锥体，绕 X 轴方向旋转 -90度，也就是 -0.5 弧度
                [0, 0, -1, 'X', -0.5]
            ];
            arr.forEach(item => {
                const mesh = new THREE.Mesh(geometry, material);
                let [x, y, z, axis, roateValue] = item;
                const space = 3;
                x *= space;
                y *= space;
                z *= space;
                mesh.position.set(x, y, z);

                // 光照阴影
                mesh.castShadow = true;
                mesh.receiveShadow = true;

                // 旋转
                mesh[`rotate${axis}`](Math.PI * roateValue);

                scene.add(mesh);
            });

            this.render(scene, renderer, camera);
        }
    }
};
</script>
