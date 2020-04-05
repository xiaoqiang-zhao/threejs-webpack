<template>
    <div class="demo-15 markdown" id="demo-canvas-container">
        <div class="img-text-container" id="img-text-container">
            <img src="/static/img/Maria-Montessori.jpg" alt="图片"/>
            <div>玛利亚-蒙台梭利</div>
        </div>
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
            group: null,
            selectedObject: null,
            scene: null,
            renderer: null,
            camera: null
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
            const width = window.innerWidth - 30;
            const height = window.innerHeight - 30;
            var camera = new THREE.PerspectiveCamera(75, width/height, 1, 50);
            
            camera.position.set(0, 0, 40);
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
            renderer.setSize(width, height);
            // 添加渲染器生成的 canvas 到页面的 body 中
            const canvasContainer = document.getElementById(containerId);
            canvasContainer.appendChild(renderer.domElement);

            // 光 - 环境光使物体整体可见
            var light = new THREE.AmbientLight(0xffffff, 0.8); // soft white light
            scene.add(light);
            // 光 - 平行光展示阴影
            var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.set(0, 0, 20);
            directionalLight.castShadow = true;
            scene.add(directionalLight);
            // 添加灯光辅助线
            const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
            scene.add(directionalLightHelper);
            // const lightHelper = new THREE.SpotLightHelper(directionalLight);
            // scene.add(lightHelper);

            // 背面光
            var backDirectionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
            backDirectionalLight.position.set(0, 0, -50);
            // 光照开启阴影
            backDirectionalLight.castShadow = true;
            scene.add(backDirectionalLight);

            this.group = new THREE.Group();
			scene.add(this.group);

            canvasContainer.addEventListener('mousemove', this.onDocumentMouseMove, false);

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

            this.renderer.render(scene, camera);
            controls.addEventListener('change', (eve) => {
                this.renderer.render(scene, camera);
            });
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
         * 运行 Demo: 手动设置航拍轨迹
         */
        runDemo() {
            const me = this;
            const {scene, renderer, camera} = this.runBase('demo-canvas-container');
            // this.addHelperLine(scene);
            const geometry = new THREE.CubeGeometry(1, 1.4, 0.02);

            //添加贴图
            const imgTextContainerDom = document.getElementById('img-text-container');
            
            imgTextContainerDom.firstElementChild.onload = function() {
                // 放入 dom
                html2canvas(imgTextContainerDom).then(canvas => {
                    // document.getElementById('temp-canvas-container').appendChild(canvas);

                    const img = canvas.toDataURL("image/png");
                    // const imgContainer = document.getElementById('img-container');
                    // const imgDom = document.createElement('img');
                    // imgDom.src = img;
                    // imgContainer.appendChild(imgDom);

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
                    // const box = new THREE.Mesh(geometry, materials);
                    // scene.add(box);
                    me.addManyBox(geometry, materials);
                });
            };

            // 添加坐标辅助线
            const axisHelper = new THREE.AxesHelper(50);
            this.scene.add(axisHelper);

            this.render(scene, renderer, camera);
        },

        /**
         * 批量添加图形
         */
        addManyBox(geometry, materials) {
            // 10 * 10 * 20 = 2000
            // for (let x = -10; x < 10; x += 2) {
            //     for (let y = -10; y < 10; y += 2) {
            //         for (let z = 0; z < 20; z++) {
            //             const box = new THREE.Mesh(geometry, materials);
            //             box.position.set(x, y, z);
            //             this.scene.add(box);
            //         }
            //     }
            // }
            // 50 * 10 * 20 = 10000
            for (let x = -50; x < 50; x += 2) {
                for (let y = -10; y < 10; y += 2) {
                    for (let z = 0; z < 20; z++) {
                        const box = new THREE.Mesh(geometry, materials);
                        box.position.set(x, y, z);
                        this.group.add(box)
                    }
                }
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
            this.renderer.render(this.scene, this.camera);
        },

        getIntersects(x, y, camera) {
			x = (x / this.width) * 2 - 1;
            y = -(y / this.height) * 2 + 1;

            const raycaster = new THREE.Raycaster();
            const mouseVector = new THREE.Vector3();
			mouseVector.set(x, y, 0.5);
			raycaster.setFromCamera(mouseVector, this.camera);

			return raycaster.intersectObject(this.group, true);
		}
    }
};
</script>
<style lang="less">
.demo-15 {
    position: relative;
    margin: 15px;
    > canvas {
        display: block;
    }
}
.img-text-container {
    position: absolute;
    // top: -500px;
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
