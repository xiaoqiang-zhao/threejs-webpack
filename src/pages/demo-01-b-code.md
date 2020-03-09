使用轨道控制器航拍，绕 y 轴进行拍摄，可以用鼠标滚轮调整焦距。

```js
import OrbitControls from 'three-orbit-controls';
const Controls = OrbitControls(THREE);
const controls = new Controls(camera, renderer.domElement);

// 自动围绕目标旋转
controls.autoRotate = true;

function animate() {

    requestAnimationFrame(animate);

    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();

    renderer.render(scene, camera);

}
animate();
```
