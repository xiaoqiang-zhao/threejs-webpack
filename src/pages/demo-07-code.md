

核心代码:

```js
const Controls = OrbitControls(THREE);
const controls = new Controls(camera, renderer.domElement);

controls.update();
renderer.render(scene, camera);

controls.addEventListener('change', (eve) => {
    renderer.render(scene, camera);
});
```

## 参考

[IBM 用户交互: https://www.ibm.com/developerworks/cn/web/wa-webgl3/index.html](https://www.ibm.com/developerworks/cn/web/wa-webgl3/index.html)
