
从官方文档中看到需要一个字体的 json 文件，官方示例中的字体 json 文件只支持英文，我们去找一个中文的。首先需要去下载一个 ttf 的字体文件，比如微软雅黑，微软雅黑不是免费字体，但是作为个人研究是没问题的，我们去站长下载它: [微软雅黑字体下载](http://font.chinaz.com/940144340.htm)。

然后到 http://gero3.github.io/facetype.js/ 这个网站，把刚才下载的文件传上去，就可以得到一个字体的 json 文件了，一共有 27.6 M，千万别因为好奇这个 json 是什么样的而用 IDE 打开，用 cat 简单看看就好了。将字体文件放入项目根目录 `/static/font` 下供下面加载调用。如果你只是想简单试试，那么你可以用本地的英文字体文件，比如 Mac 下用 /System/Library/Font/NewYork.ttf，大小只有 0.3M。

加载字体文件像下面这样，需要注意这里的加载走的是 http 请求，不是文件相对路径:

核心代码:

```js
const loader = new THREE.FontLoader();
loader.load('/static/NewYork.json', font => {
    const geometry = new THREE.TextGeometry('Hello three.js!', {
        font: font,
        size: 1,
        height: 0.1, // 文字厚度
        curveSegments: 12, // 弧线分段数，使得文字的曲线更加光滑
        bevelEnabled: true,
        bevelThickness: 0.1, // 倒角厚度
        bevelSize: 0.1, // 倒角宽度
        bevelSegments: 5 // 弧线分段数，使得文字的曲线更加光滑
    });
    geometry.computeBoundingBox();
    geometry.computeVertexNormals();

    const material = [
        // 内部字体
        new THREE.MeshStandardMaterial({
            color: 0x4169E1
        }),
        // 外部描边
        new THREE.MeshStandardMaterial({
            color: 0xffffff
        })
    ];

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
});
```

## 参考

加载中文字体: https://www.cnblogs.com/leisir/articles/5905700.html
