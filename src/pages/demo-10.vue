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
import baseMdContent from './demo-10.md';
import demoCodeMdContent from './demo-10-code.md';

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
            directionalLight.position.set(10, 10, 2030);
            directionalLight.castShadow = true;
            scene.add(directionalLight);
            // 背面光
            var backDirectionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
            backDirectionalLight.position.set(0, 0, -50);
            // 光照开启阴影
            backDirectionalLight.castShadow = true;
            scene.add(backDirectionalLight);

            // 放一个球模拟平行光源
            // var sphereMaterial = new THREE.MeshStandardMaterial({
            //     color: 0xffffff
            // });
            // const sphereGeometry = new THREE.SphereGeometry(0.1, 5, 5);
            // var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            // sphere.position.set(2, 5, 5);
            // scene.add(sphere);
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
         * 添加从原点出发的线
         * 
         * @param {Array} from 第二坐标点(原点是第一坐标点)
         * @param {Array} to 第二坐标点(原点是第一坐标点)
         * @param {number} color 16进制颜色值
         */
        addLine(from, to, color) {
            // 添加线
            const linePoints = [];
			linePoints.push(new THREE.Vector3(...from));
			linePoints.push(new THREE.Vector3(...to));
			const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);

			const lineMaterial = new THREE.LineBasicMaterial({
				color
			});
			const line = new THREE.Line(lineGeometry, lineMaterial);
            this.scene.add(line);
        },

        /**
         * 添加箭头
         *
         * @param {Number} from
         * @param {Number} to
         * @param {Number} color
         */
        addGones(from, to, color) {
            // 添加箭头
            // from -= 50;
            while(to > from) {
                // 半径，高度，分段数
                const geometry = new THREE.ConeGeometry(0.1, 0.3, 10);
                const material = new THREE.MeshStandardMaterial({
                    color
                });
                const cone = new THREE.Mesh(geometry, material);
                cone.castShadow = true;
                cone.receiveShadow = true;
                cone.position.set(0, 0, from);
                cone.rotateX(Math.PI / 2);
                this.scene.add(cone);
                from += this.space;

                console.log(from);
            }
        },

        /**
         * 添加时间点
         */
        addTimeSton(scene, from, to) {

            loader.load('/static/font/NewYork.json', font => {
                const material = [
                    // 内部字体
                    new THREE.MeshStandardMaterial({
                        color: 0x4169E1
                    }),
                    // 外部描边
                    new THREE.MeshStandardMaterial({
                        color: 0xffffff
                    })
                ];

                while(to >= from) {
                    const geometry = new THREE.TextGeometry((from + 2000) + '', {
                        font: font,
                        size: 1,
                        height: 0.01, // 文字厚度
                        curveSegments: 12, // 弧线分段数，使得文字的曲线更加光滑
                        bevelEnabled: true,
                        bevelThickness: 0.08, // 倒角厚度
                        bevelSize: 0.08, // 倒角宽度
                        bevelSegments: 1 // 弧线分段数，使得文字的曲线更加光滑
                    });
                    geometry.computeBoundingBox();
                    geometry.computeVertexNormals();
                    
                    const mesh = new THREE.Mesh(geometry, material);
                    mesh.position.set(-1.5, -0.7, from);
                    scene.add(mesh);

                    from += this.space;
                }

                this.renderer.render(this.scene, this.camera);
            });
        },

        /**
         * 渲染
         */
        render(scene, renderer, camera) {
            // 控制器
            const Controls = OrbitControls(THREE);
            const controls = new Controls(this.camera, this.renderer.domElement);

            this.renderer.render(this.scene, this.camera);
            controls.addEventListener('change', (eve) => {
                this.renderer.render(scene, camera);
            });
        },

        /**
         * 运行 Demo: 手动设置航拍轨迹
         */
        runDemo() {
            
            const {scene, renderer, camera} = this.runBase('demo-canvas-container');
            const from = -40;
            const to = 20;

            this.addLine([0, 0, from], [0, 0, to], 0x0000ff);
            this.addGones(from, to, 0x0000FF);
            this.addTimeSton(scene, from, to);

            this.render(scene, renderer, camera);
        }
    }
};
</script>
