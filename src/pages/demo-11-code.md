核心代码:

```js
const geometry = new THREE.CubeGeometry(10, 14, 1);
//添加贴图
const img = new THREE.TextureLoader().load('/static/img/Maria-Montessori.jpg');
const phongMaterial = new THREE.MeshPhongMaterial({
    color: 0x4169E1,
    map: img
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
const box = new THREE.Mesh(geometry, materials);
scene.add(box);
```
