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

## 识别三维世界的图形

鼠标移动到图形上高亮显示，响应点击事件。
