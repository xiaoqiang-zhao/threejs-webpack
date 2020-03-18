核心代码:

```js
var planeGeometry = new THREE.PlaneGeometry(2.5, 1.5, 50);
var planeMaterial = new THREE.MeshStandardMaterial({
    color: 0x4169E1,
    // 无厚度平面默认是单向的，背面不可见，双向可见需要配置开启
    side: THREE.DoubleSide,
    // 透明度设置
    transparent: true,
    opacity: 0.8
});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.set(1.25, 0, 0);
plane.castShadow = true;

plane.lookAt(0, 0, 0);
scene.add(plane);
```

注意设置双面可见平面。还可以设置平面的半透明度。

有一个问题没有解决，在设置完平面的半透明度后，投影没有变淡，和完全不透明的投影相同。
