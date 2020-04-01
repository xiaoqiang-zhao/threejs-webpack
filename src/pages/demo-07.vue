<template>
    <div class="demo-04 markdown">
        <markdown-doc-content :mdContent="mdContent"/>
        <div id="demo-a-canvas-container"></div>
        <markdown-doc-content :mdContent="demoCodeMdContent"/>
        <div id="demo-b-canvas-container"></div>
        <markdown-doc-content :mdContent="demoCodeBMdContent"/>
    </div>
</template>

<script>
import * as THREE from 'three/build/three.module.js';
import OrbitControls from 'three-orbit-controls';

import markdownDocContent from '@/components/markdown-doc-content.vue';
import baseMdContent from './demo-07.md';
import demoCodeMdContent from './demo-07-code.md';
import demoCodeBMdContent from './demo-07-code-b.md';

const loader = new THREE.FontLoader();

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
            demoCodeMdContent,
            demoCodeBMdContent,
            width: 1232,
            height: 900,
            demoAscene: null,
            demoAcamera: null,
            demoArenderer: null,
            demoBscene: null,
            demoBcamera: null,
            demoBrenderer: null,
            group: null,
            selectedObject: null
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
            var camera = new THREE.PerspectiveCamera(75, this.width/this.height, 0.1, 1000);
            
            camera.position.set(5, 0, 21);
            camera.lookAt(0, 0, 0);

            // 渲染器
            var renderer = new THREE.WebGLRenderer({
                // 抗锯齿
                antialias: true,
                // 背景透明，可以看到 canvas 下的东西
                // alpha: true
            });
            // 开启阴影计算
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.shadowMapSoft = true;

            // 设置大小
            renderer.setSize(this.width, this.height);
            // 添加渲染器生成的 canvas 到页面的 body 中
            const canvasContainer = document.getElementById(containerId);
            canvasContainer.appendChild(renderer.domElement);

            // 光 - 环境光使物体整体可见
            const light = new THREE.AmbientLight(0xffffff, 0.8); // soft white light
            scene.add(light);
            // 光 - 平行光展示阴影
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
            directionalLight.position.set(2, 5, 5);
            // 指定此光源会产生投影
            directionalLight.castShadow = true;
            scene.add(directionalLight);
            // 背面光
            var backDirectionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
            backDirectionalLight.position.set(0, 0, -50);
            // 光照开启阴影
            backDirectionalLight.castShadow = true;
            scene.add(backDirectionalLight);

            return {
                scene,
                renderer,
                camera
            };
        },

        /**
         * 添加从原点出发的线
         * 
         * @param {Array} vector 第二坐标点(原点是第一坐标点)
         * @param {number} color 16进制颜色值
         * @param {Object} scene 场景对象
         */
        addLine(vector, color, scene, camera, renderer) {
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
                renderer.render(scene, camera);
            });
        },

        /**
         * 添加坐标辅助线
         * 
         * @param {Object} scene 场景对象
         */
        addHelperLine(scene, camera, renderer) {
            // x 轴 红色
            this.addLine([10, 0, 0], 0xFF0000, scene, camera, renderer);

            // y 轴  绿色
            this.addLine([0, 10, 0], 0x00FF00, scene, camera, renderer);
			
            // z 轴 蓝色
            this.addLine([0, 0, 10], 0x0000FF, scene, camera, renderer);

            const geometry = new THREE.ConeGeometry(1, 2, 10);
            const material = new THREE.MeshBasicMaterial({
                color: 0x00FF00
            });
        },

        /**
         * 渲染
         */
        render(scene, camera, renderer) {
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
         * 运行 DemoA: 添加可拖动变换的三维坐标
         */
        runDemoA() {
            const {scene, renderer, camera} = this.runBase('demo-a-canvas-container');
            this.demoAscene = scene;
            this.demoArenderer = renderer;
            this.demoAcamera = camera;

            this.addHelperLine(scene, camera, renderer);

            this.render(scene, camera, renderer);
        },

        /**
         * 运行 DemoB: 添加可选中的圆锥体群
         */
        runDemoB() {
            const {scene, renderer, camera} = this.runBase('demo-b-canvas-container');
            this.demoBscene = scene;
            this.demoBrenderer = renderer;
            this.demoBcamera = camera;

            this.addHelperLine(scene, camera, renderer);

            this.group = new THREE.Group();
			scene.add(this.group);

            // 添加圆锥体
            // 半径，高度，分段数
            const geometry = new THREE.ConeGeometry(1, 2, 100);
            
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
                const material = new THREE.MeshStandardMaterial({
                    color: 0x4169E1
                });
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
                mesh.name = item.toString();

                this.group.add(mesh);
            });

            const dom = document.getElementById('demo-b-canvas-container');
            dom.addEventListener('mousemove', this.onDocumentMouseMove, false);
            dom.addEventListener('click', this.onClick);

            this.render(scene, camera, renderer);
        },

        onClick() {
            if (this.selectedObject) {
                alert('点击事件监听，selectedObject.name: ' + this.selectedObject.name);
            }
        },

        onDocumentMouseMove(event) {
            event.preventDefault();
            // 重置为未选中
			if (this.selectedObject) {
				this.selectedObject.material.color.set('#69f');
				this.selectedObject = null;
            }
            
            // 计算当前鼠标点是否落在某个几何体上
            var intersects = this.getIntersects(event.layerX, event.layerY);
			if (intersects.length > 0) {
				var res = intersects.filter(res => {
					return res && res.object;
                })[0];

                // 设置选中的几何体
				if (res && res.object) {
					this.selectedObject = res.object;
                    this.selectedObject.material.color.set(0x00FF00);
				}
			}
            this.demoBrenderer.render(this.demoBscene, this.demoBcamera);
        },

        getIntersects(x, y, camera) {
			x = (x / this.width) * 2 - 1;
            y = -(y / this.height) * 2 + 1;

            const raycaster = new THREE.Raycaster();
            const mouseVector = new THREE.Vector3();
			mouseVector.set(x, y, 0.5);
			raycaster.setFromCamera(mouseVector, this.demoBcamera);

			return raycaster.intersectObject(this.group, true);
		}
    }
};
</script>
