<template>
    <div class="standard-base markdown">
        <markdown-doc-content :mdContent="mdContent"/>
        <div id="canvas-container"></div>
    </div>
</template>

<script>
import * as THREE from 'three/build/three.module.js';
import markdownDocContent from '@/components/markdown-doc-content.vue';
import baseMdContent from './demo-01.md';

export default {
    components: {
        markdownDocContent
    },
    mounted() {
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
        const canvasContainer = document.getElementById('canvas-container');
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

        let angle = 0;
        var render = function () {
            requestAnimationFrame(render);

            angle += 0.01;
            let x = 5 * Math.cos(angle);
            let y = 5 * Math.sin(angle);

            camera.position.set(x, y, 5);
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
        };

        render();

        // renderer.render(scene, camera);
    },
    data() {
        return {
            mdContent: baseMdContent
        };
    }
};
</script>

<style lang="less" scope>
@import '../assets/base.less';
.demo-01 {
    
}
</style>
