<template>
    <div class="demo-03 markdown">
        <markdown-doc-content :mdContent="mdContent"/>
        <div id="demo-canvas-container"></div>
        <markdown-doc-content :mdContent="demoCodeMdContent"/>
    </div>
</template>

<script>
import * as THREE from 'three/build/three.module.js';
import OrbitControls from 'three-orbit-controls';

import markdownDocContent from '@/components/markdown-doc-content.vue';
import baseMdContent from './demo-03.md';
import demoCodeMdContent from './demo-03-code.md';

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
            
            camera.position.set(0, 5, 10);
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

            return {
                scene,
                renderer,
                camera
            };
        },

        /**
         * 添加坐标辅助线
         * 
         * @param {Object} scene 场景对象
         */
        addHelperLine(scene) {
            // --- 辅助轴
			// x 轴
			var pointsX = [];
			pointsX.push( new THREE.Vector3(0, 0, 0));
			pointsX.push( new THREE.Vector3(100, 0, 0));
			var geometryX = new THREE.BufferGeometry().setFromPoints(pointsX);

			var materialX = new THREE.LineBasicMaterial({
                // 红色
				color: 0xFF0000
			});
			var lineX = new THREE.Line(geometryX, materialX);
			scene.add(lineX);

			// y 轴
			var pointsY = [];
			pointsY.push( new THREE.Vector3(0, 0, 0));
			pointsY.push( new THREE.Vector3(0, 100, 0));
			var geometryY = new THREE.BufferGeometry().setFromPoints(pointsY);

			var materialY = new THREE.LineBasicMaterial({
                // 绿色
				color: 0x00FF00
			});
			var lineY = new THREE.Line(geometryY, materialY);
			scene.add(lineY);

			// z 轴
			var pointsZ = [];
			pointsZ.push( new THREE.Vector3(0, 0, 0));
			pointsZ.push( new THREE.Vector3(0, 0, 100));
			var geometryZ = new THREE.BufferGeometry().setFromPoints(pointsZ);

			var materialZ = new THREE.LineBasicMaterial({
                // 蓝色
				color: 0x0000FF
			});
			var lineZ = new THREE.Line(geometryZ, materialZ);
			scene.add(lineZ);
			// ---
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

            const points = [
                new THREE.Vector3(1, 2, 1),
                new THREE.Vector3(1, 0, 1),
                new THREE.Vector3(2, 0, 1),
                new THREE.Vector3(1, 2, 1)
            ];
            const geometry = new THREE.Geometry().setFromPoints(points);

            const material = new THREE.LineBasicMaterial({
                // 白色
                color: 0xfffffff
            });
            const line = new THREE.Line(geometry, material);
            scene.add(line);

            this.render(scene, renderer, camera);
        }
    }
};
</script>
