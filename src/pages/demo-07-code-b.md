核心代码:

```js
this.group = new THREE.Group();
scene.add(this.group);

// mesh 为参与识别的网格实体
this.group.add(mesh);

window.addEventListener('mousemove', this.onDocumentMouseMove, false);
onDocumentMouseMove(event) {
    event.preventDefault();
    // 重置为未选中
    if (this.selectedObject) {
        this.selectedObject.material.color.set('#69f');
        this.selectedObject = null;
    }
    
    // 计算当前鼠标点是否落在某个几何体上
    var intersects = this.getIntersects(event.layerX, event.layerY);
    if (intersects.length > 0) {
        var res = intersects.filter(res => {
            return res && res.object;
        })[0];

        // 设置选中的几何体
        if (res && res.object) {
            this.selectedObject = res.object;
            this.selectedObject.material.color.set(0x00FF00);
        }
    }
    this.demoBrenderer.render(this.demoBscene, this.demoBcamera);
},

getIntersects(x, y, camera) {
    x = (x / this.width) * 2 - 1;
    y = -(y / this.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector3();
    mouseVector.set(x, y, 0.5);
    raycaster.setFromCamera(mouseVector, this.demoBcamera);

    return raycaster.intersectObject(this.group, true);
}
```

## 参考

[IBM 用户交互: https://www.ibm.com/developerworks/cn/web/wa-webgl3/index.html](https://www.ibm.com/developerworks/cn/web/wa-webgl3/index.html)
