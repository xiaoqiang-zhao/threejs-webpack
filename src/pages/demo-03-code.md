核心代码:

```js
const points = [
    new THREE.Vector3(1, 2, 1),
    new THREE.Vector3(1, 0, 1),
    new THREE.Vector3(2, 0, 1),
    new THREE.Vector3(1, 2, 1)
];
const geometry = new THREE.Geometry().setFromPoints(points);

const material = new THREE.LineBasicMaterial({
    // 白色
    color: 0xfffffff
});
const line = new THREE.Line(geometry, material);
scene.add(line);
```
