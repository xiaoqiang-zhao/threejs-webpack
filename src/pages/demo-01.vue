<template>
    <div class="standard-base markdown">
        <markdown-doc-content :mdContent="mdContent"/>
        <!-- <p>
            <el-button type="primary" @click="runDemoA">运行 Demo</el-button>
        </p> -->
        <div id="demo-a-canvas-container"></div>
        <markdown-doc-content :mdContent="demoAMdContent"/>
        <markdown-doc-content :mdContent="demoBDescriptionMdContent"/>
        <!-- <p>
            <el-button type="primary" @click="runDemoB">运行 Demo</el-button>
        </p> -->
        <div id="demo-b-canvas-container"></div>
        <markdown-doc-content :mdContent="demoBCodeMdContent"/>
    </div>
</template>

<script>
import * as THREE from 'three/build/three.module.js';
import OrbitControls from 'three-orbit-controls';

import markdownDocContent from '@/components/markdown-doc-content.vue';
import baseMdContent from './demo-01.md';
import demoAMdContent from './demo-01-a.md';
import demoBDescriptionMdContent from './demo-01-b-des.md';
import demoBCodeMdContent from './demo-01-b-code.md';

export default {
    components: {
        markdownDocContent
    },
    mounted() {
        this.runDemoA();
        this.runDemoB();
    },
    data() {
        return {
            mdContent: baseMdContent,
            demoAMdContent,
            demoBDescriptionMdContent,
            demoBCodeMdContent
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
            var scene = new THREE.Scene();

            // 摄像机
            const space = 208;
            const width = window.innerWidth - space;
            const height = window.innerHeight - space;
            var camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);
            camera.position.set(5, 0, 3);
            camera.lookAt(0, 0, 0);

            // 渲染器
            var renderer = new THREE.WebGLRenderer({
                // 抗锯齿
                antialias: true
            });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
                
            // 设置大小
            renderer.setSize(width, height);
            // 添加渲染器生成的 canvas 到页面的 body 中
            const canvasContainer = document.getElementById(containerId);
            canvasContainer.appendChild(renderer.domElement);

            // 材质
            var material = new THREE.MeshStandardMaterial({
                color: 0x4169E1
            });

            // 几何图形 - 立方体
            var box = new THREE.BoxGeometry(1, 1, 1, 10);
            var cube = new THREE.Mesh(box, material);
            cube.position.set(-2, 0, 0);
            cube.castShadow = true;
            cube.receiveShadow = false;
            scene.add(cube);
            
            // 几何图形 - 圆柱
            var cylinderGeometry = new THREE.CylinderGeometry(0.3, 0.3, 3, 100);
            var cylinder = new THREE.Mesh(cylinderGeometry, material);
            cylinder.position.set(2, 0, 0);
            cylinder.castShadow = true;
            cylinder.receiveShadow = false;
            scene.add(cylinder);


            // 创建平面接受阴影投射
            var planeGeometry = new THREE.PlaneGeometry(20, 10);
            var planeMaterial = new THREE.MeshStandardMaterial({
                color: 0xc4c4c4
            });
            var plane = new THREE.Mesh(planeGeometry, planeMaterial);
            plane.position.set(0 , 0, -5);
            plane.receiveShadow = true;
            scene.add(plane);

            // 光 - 环境光使物体整体可见
            var light = new THREE.AmbientLight(0x404040); // soft white light
            scene.add(light);
            // 光 - 平行光展示阴影
            var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
            directionalLight.position.set(0, 0, 5);
            directionalLight.castShadow = true;
            directionalLight.shadow.bias = 0.1;
            directionalLight.shadow.mapSize.width = 512;  // default
            directionalLight.shadow.mapSize.height = 512; // default
            directionalLight.shadow.camera.near = 0.5;    // default
            directionalLight.shadow.camera.far = 500;     // default
            scene.add(directionalLight);
            var backDirectionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
            backDirectionalLight.position.set(0, 0, -5);
            scene.add(backDirectionalLight);

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
         * 运行 Demo A: 手动设置航拍轨迹
         */
        runDemoA() {
            
            const {scene, renderer, camera} = this.runBase('demo-a-canvas-container');

            // 角度
            let angle = 0;
            // 半径
            const radius = 3;
            var render = function () {
                requestAnimationFrame(render);

                angle += 0.01;
                let x = radius * Math.cos(angle);
                let y = radius * Math.sin(angle);

                camera.position.set(x, y, 3);
                camera.lookAt(0, 0, 0);

                renderer.render(scene, camera);
            };

            render();
        },

        /**
         * 运行 Demo A: 使用轨道控制器航拍
         */
        runDemoB() {
            const {scene, renderer, camera} = this.runBase('demo-b-canvas-container');
            this.addHelperLine(scene);

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
            // controls.addEventListener('change', function(){
            //     console.log("水平旋转 azimuthalAngle: ", controls.getAzimuthalAngle ());
            //     console.log("垂直旋转 polarAngle: ", controls.getPolarAngle());
            // });

            controls.update();
            function animate() {

                requestAnimationFrame(animate);

                // required if controls.enableDamping or controls.autoRotate are set to true
                controls.update();

                renderer.render(scene, camera);

            }
            animate();
        }
    }
};
</script>

<style lang="less" scope>
@import '../assets/base.less';
.demo-01 {
    
}
</style>
