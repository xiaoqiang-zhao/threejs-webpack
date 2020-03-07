## 航拍

### 手动设置航拍轨迹

在 x 轴上创建两个几何体，在 z 轴高度为 3 半径也为 3 的轨迹上进行航拍。

```js
// 角度
let angle = 0;
// 半径
const radius = 3;
var render = function () {
    requestAnimationFrame(render);

    angle += 0.01;
    let x = radius * Math.cos(angle);
    let y = radius * Math.sin(angle);

    camera.position.set(x, y, 3);
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
};
```

如果人没有受到离心力和加速度的感觉，直接进入航拍视角感觉整个世界都在旋转，这个人类本能无法克服。如果想逼真模拟，需要像“头号玩家”那样的在一个万向跑步机上进行，或者像迪士尼“飞跃地平线”项目那种 4D 座椅的辅助。
