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
import baseMdContent from './demo-02.md';
import demoCodeMdContent from './demo-02-code.md';

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

            // 光 - 环境光使物体整体可见
            var light = new THREE.AmbientLight(0xffffff, 0.8); // soft white light
            scene.add(light);
            // 光 - 平行光展示阴影
            var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
            directionalLight.position.set(2, 5, 5);
            directionalLight.castShadow = true;
            scene.add(directionalLight);

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

            // -- 第一个默认粒子 -- //
            // 点的几何体
            const pointGeometry = new THREE.Geometry();
            // 点的位置
            const position = new THREE.Vector3(1, 1, 1);
            const position2 = new THREE.Vector3(-1, -1, -1);
            pointGeometry.vertices.push(position, position2);
            // 点的材质
            const pointMaterial = new THREE.PointsMaterial({
                color: 0x888888,
                size: 0.1
            });
            const point = new THREE.Points(pointGeometry, pointMaterial);
            scene.add(point);

            // // 几何结构和材质
            // const geom = new THREE.Geometry();
            // const material = new THREE.ParticleBasicMaterial({ 
            //     color: 0x00FFFF, 
            //     size: 0.1
            // });

            // // 颜色和坐标
            // const color = new THREE.Color(0x0000ff);
            // const position = new THREE.Vector3(1, 1, 1);

            // // 为几何结构指定坐标和颜色
            // geom.vertices.push(position);
            // geom.colors.push(color);

            // // 创建粒子系统 
            // var system =  new THREE.ParticleSystem(geom, material);
            // // 将粒子系统加入场景 
            // scene.add(system);

            // 第二个圆形粒子
            // const craGeom = new THREE.Geometry();
            // const craPosition = new THREE.Vector3(-1, -1, -1);
            // craGeom.vertices.push(craPosition);
            // const craMaterial = new THREE.SpriteMaterial({
            //     color: 0xffffff,    //粒子的颜色
            //     program(context) { //用于绘制粒子的方法
            //         context.beginPath();
            //         context.arc(0, 0, 0.5, 0, PI2, true ); //画一个圆形。此处可修改大小。
            //         context.fill();
            //     }
            // });
            // var sprite = new THREE.Sprite(craMaterial);
            // sprite.scale.set(200, 200, 1);
            // scene.add(sprite);
            // var craSystem =  new THREE.ParticleSystem(craGeom, craMaterial);
            // scene.add(craSystem);

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
