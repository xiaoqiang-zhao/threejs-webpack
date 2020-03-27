
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

上面所有圆锥体都是尖向上的，也就是和 Y 轴正方向同向，下面我们把他们旋转一下，让他们全部底面相对。旋转需要用到 Mesh 实体的 rotateX、rotateY、rotateZ 方法，他们的含义是绕对应的轴方向顺时针旋转，旋转角度采用的是弧度值，`360°角=2π弧度`，比如我们想让 X 轴上的圆锥底面正对坐标原点，就需要在 Z 轴方向上旋转 -90 度，对应 -0.5π 弧度，调用方法是这样 `mesh.rotateZ(Math.PI)`。我们向上面的 arr 二维数组中添加旋转信息:

```js
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
```
