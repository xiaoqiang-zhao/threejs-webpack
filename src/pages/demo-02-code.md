点没有固定的几何体，直接用 `THREE.Geometry` 做容器，然后放入坐标值，点的基础材质是 `THREE.PointsMaterial`，生成点的代码如下:

核心代码:

```js
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
```

## 参考

3D粒子波浪动画: https://www.jianshu.com/p/d2af195ba4db
