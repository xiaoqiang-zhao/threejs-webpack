
核心代码:

```js
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
    scene.add(mesh);
});
```
