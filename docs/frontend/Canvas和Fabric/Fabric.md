# Fabric

## Hello Fabric

安装

```bash
pnpm install fabric
```

或者通过 cdn 引入

```html
<script src="https://cdn.jsdelivr.net/npm/fabric"></script>
```

创建 canvas 元素。

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Parcel Sandbox</title>
    <meta charset="UTF-8" />
    <style>
      #c {
        border: 1px solid black;
      }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/fabric"></script>
  </head>

  <body>
    <div id="app">
      <canvas id="c" width="300" height="300"></canvas>
    </div>
  </body>
</html>
```

## 画矩形

```js
// 这里捕获 canvas 元素，注意直接写 id 而不是#id
const canvas = new fabric.Canvas('c')
// 定义矩形的初始坐标、颜色和初始大小
const rect = new fabric.Rect({
  left: 100,
  top: 100,
  fill: 'red',
  width: 50,
  height: 50,
})
//添加到画板上
canvas.add(rect)
```

## 画圆形

```js
// 画圆
const circle = new fabric.Circle({
  radius: 25,
  left: 0,
  top: 0,
  fill: 'blue',
})
canvas.add(circle)
```

跟矩形类似，圆形需要定义 radius（半径）。

## 画三角形

```js
//画三角形
const triangle = new fabric.Triangle({
  width: 80,
  height: 80,
  fill: 'grren',
  left: 0,
  top: 150,
})

canvas.add(triangle)
```

## 小结

从上面的案例可以看出来，画 canvas 的图形需要几个基本要素：

- 画板元素`<canvas>`
- 坐标 coordinate
- 颜色
- 矩形的大小元素（例如 width、height、radius）
- 添加到 canvas 中

利用这些元素，极大地简化了 canvas 的操作，并且所有元素默认都是可拖拽、移动、伸缩的。

## 插入图片

fabric 提供 `Image.fromURL`方法，可以动态加载图片，并且塞到 canvas 元素中。

```js
// 插入图片
fabric.Image.fromURL('https://cdn.wallpapersafari.com/62/31/NA3nl0.jpg', function (oImage) {
  oImage.scale(0.2)
  canvas.add(oImage)
})
```

其中，第二个参数是 handler 函数，我们在该函数中对加载过来的图片进行一些操作，操作方式很多，例子中是将其缩小到原来的 1/5 大小。

`canvas.add` 也是在 handler 中处理的。

## 不规则图形

不规则图形本质上是通过点或者线等基本的绘制元素，将坐标按照绘制元素给串联起来组合而成的。

比如，我们手动绘制不规则图形时，就是将画笔在画布上所走过的路径（path）给描出来。

![Aug-08-2023 16-06-55](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202308081607679.gif)

现在我们就是用代码的方式，将生成不规则图形的过程给写出来。

下面我们利用`fabric.Path`方法来生成不规则图形，所有不规则图形都有事先的坐标，这些坐标则作为该方法的参数，然后通过线、点等串联起来即可。

```js
const path = new fabric.Path('M 0 0 L 200 200 L 160 200 z')
path.set({
  left: 200,
  top: 200,
  fill: 'black',
})
canvas.add(path)
```

Path 方法的入参，这里重点解释一下：

- `M 0 0 `表示开始移动，最开始的坐标为 `0 0`
- `L 200 200`表示用`Line`画一条到 （200,200）的线
- `L 160 200`从上次所在的坐标点（200,200），画一条到（160,200）的线
- `z` 表示不规则图形闭合（即从`160,200`回归到原点）

整个过程用画笔画下来类似这样的效果：

![Aug-08-2023 16-20-15](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202308081621191.gif)

接着就是对该路径的设置：

```js
path.set({
  left: 200,
  top: 200,
  fill: 'black',
})
```

这个路径我们将其放置在画布的 200 200 位置，最后将其填充为黑色。

由于这种路径方式可阅读性不高，并且坐标的参数容易出错，所以当遇到比较难的图形时，一般我们会用 svg 替代它。
