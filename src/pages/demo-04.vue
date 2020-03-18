<template>
    <div class="demo-02 markdown">
        <markdown-doc-content :mdContent="mdContent"/>
        <div id="demo-canvas-container"></div>
        <markdown-doc-content :mdContent="demoCodeMdContent"/>
    </div>
</template>

<script>
import * as THREE from 'three/build/three.module.js';
import OrbitControls from 'three-orbit-controls';

import markdownDocContent from '@/components/markdown-doc-content.vue';
import baseMdContent from './demo-04.md';
import demoCodeMdContent from './demo-04-code.md';

export default {
    components: {
        markdownDocContent
    },
    mounted() {
        this.runDemoA();
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

            // 光 - 环境光使物体整体可见
            var light = new THREE.AmbientLight(0xffffff, 0.8); // soft white light
            scene.add(light);
            // 光 - 平行光展示阴影
            var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
            directionalLight.position.set(2, 5, 5);
            directionalLight.castShadow = true;
            directionalLight.shadowDarkness = 0.3;
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
         * 运行 Demo A: 手动设置航拍轨迹
         */
        runDemoA() {
            
            const {scene, renderer, camera} = this.runBase('demo-canvas-container');
            this.addHelperLine(scene);

            // 平面一
            var planeGeometry = new THREE.PlaneGeometry(5, 3, 50);
            var planeMaterial = new THREE.MeshStandardMaterial({
                color: 0xc4c4c4,
                side: THREE.DoubleSide
            });
            var plane = new THREE.Mesh(planeGeometry, planeMaterial);
            plane.position.set(0, 0, 0);
            plane.receiveShadow = true;
            
            scene.add(plane);

            // 平面二
            var planeGeometry2 = new THREE.PlaneGeometry(2.5, 1.5, 50);
            var planeMaterial2 = new THREE.MeshStandardMaterial({
                color: 0x4169E1,
                opacity: 0.4
            });
            var plane2 = new THREE.Mesh(planeGeometry2, planeMaterial2);
            plane2.position.set(0, 0, 0);
            plane2.castShadow = true;
            plane2.receiveShadow = true;
            // 无厚度平面默认是单向的，背面不可见，双向可见需要配置开启
            plane2.material.side = THREE.DoubleSide;
            plane2.lookAt(0, 1, 0);
            scene.add(plane2);

            // 平面三
            var planeGeometry3 = new THREE.PlaneGeometry(2.5, 1.5, 50);
            var planeMaterial3 = new THREE.MeshStandardMaterial({
                color: 0x4169E1,
                side: THREE.DoubleSide,
                // 透明度设置
                transparent: true,
                opacity: 0.8
            });
            var plane3 = new THREE.Mesh(planeGeometry3, planeMaterial3);
            plane3.position.set(1.25, 0, 0);
            plane3.castShadow = true;
            // 无厚度平面默认是单向的，背面不可见，双向可见需要配置开启
            plane3.material.side = THREE.DoubleSide;
            plane3.lookAt(0, 0, 0);
            scene.add(plane3);

            // 平面四
            var plane4 = new THREE.Mesh(planeGeometry3, planeMaterial3);
            plane4.position.set(-1.25, 0, 0);
            plane4.castShadow = true;
            plane4.receiveShadow = true;
            plane4.lookAt(0, 0, 0);
            scene.add(plane4);


            this.render(scene, renderer, camera);
        }
    }
};
</script>

<style lang="less" scope>
@import '../assets/base.less';
.demo-02 {
    
}
</style>
