# Grid 实践学习

## Grid Container 属性

### 定义 grid

`Grid`是一种强大的二维布局工具，所谓二维布局，就是一开始就在父盒子上定义好行（row）和列（coulmn），然后让子盒子（items）填充到父盒子（Grid container）上的一种布局方式。

直接定义 `grid container`有两种方式：

```css
display: grid | inline-grid;
```

其中区别在于：

- `inline-grid`是将父盒子定义成内联形式的 grid 盒子，这样父盒子就能跟其他内联的盒子（例如 img）一起占据一行的宽度。

  ![image-20230622200824308](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202306222008323.png)

- `grid`则变成行级盒子，会占据一整行的宽度。

  ![image-20230622200943339](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202306222009376.png)

默认的 grid 盒子仅会创建一个只有一列的网格，子盒子会自上而下排布。

### grid-template-columns 和 grid-template-rows

接下来用`grid-template-rows`和`grid-template-columns`我们可以控制网格的行和列。

我们的父盒子内有 6 个 items。

```html
<div class="container">
  <div class="one">1</div>
  <div class="two">2</div>
  <div class="three">3</div>
  <div class="four">4</div>
  <div class="five">5</div>
  <div class="six">6</div>
</div>
```

`grid-template-columns`可以定义网格需要有多少列。

```css
grid-template-columns: 20px 50% 1fr;
```

上面的代码表示需要有 3 列，其中：

1. 第一列占据 20px 的**宽度**
2. 第二列占据 50%的**宽度**
3. 第三列使用的是 fr 单位，这个单位代表占据剩余空间的 x 份。

由于我们有 6 个盒子，但是只安排了 3 列。所以超出的盒子会被自动换行，我们得出了这样一个盒子：

![image-20230622202956908](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202306222029966.png)

接着我们用`grid-template-rows`来手动指定需要多少行以及每行需要多少高度。

```css
grid-template-columns: 20px 50% 1fr;
grid-template-rows: 1fr 2fr;
```

上面的 rows 属性表示需要 2 行，第一行占据总**高度**的 1 份，第二行占据总**高度**的 2 份。

![image-20230622204827124](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202306222048212.png)

`grid-template-*`属性下，我们可以使用各种长度单位来定义高度或者宽度，例如：rem、px、%、em、fr 、auto 等。

对于 rows 属性，长度单位会影响到高度。

对于 columns 属性，长度单位会影响到宽度。

### repeat 函数

当我们使用 grid-template 划分网格区域时，有时候会划分等分的网格，比如我需要基于`50`px 来创建网格，但是总长度为 `1000px`,这样就得写 20 次 `50px`，实在太繁琐。

使用 repeat 函数就可以简化为：

```css
grid-template-columns: repeat(20, 50px);
```

等同于：

```css
grid-template-columns: 50px /*... 此处省略18个*/ 50px;
```

### minmax

我们还能够使用 minmax 函数来指定行或列的最大以及最小的高度或宽度。

`minmax()`接受两个参数：第一个是最小值尺寸，第二个为最大值尺寸。

为了做到根据内容自动调整大小的效果，我们还可以使用 auto 值。

```css
grid-template-rows: minmax(100px, auto);
grid-template-columns: minmax(auto, 50%) 1fr 3em;
```

### grid-template-areas

`grid-template-areas`用来给网格划分区域，它的作用是描述网格区域的名称，然后子项可以通过这个名称来确定区域范围。

```css
grid-template-rows: 1fr 2fr;
grid-template-columns: 20px 50% 1fr;
grid-template-areas:
  'a a a'
  ' b c c';
```

上面的代码我们划分了两行三列的布局，并且给第一行整块命名为 a，第二行则是 b 和 c。

接着我们让子项决定占用哪块区域。

```css
.one {
  grid-area: a;
}
.two {
  grid-area: b;
}
.three {
  grid-area: c;
}
```

最终得到的效果如下：

![image-20230622220310897](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202306222203936.png)

整体的效果类似于确定农田的产权问题。

### gap

gap 属性用来定义网格中间间隙的尺寸。该属性是 [`row-gap`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/row-gap) 和 [`column-gap`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/column-gap) 的简写形式。

> 原来的 grid-gap 和 grid-column-gap 以及 grid-row-gap 都可以不使用了，并且 flex 盒子也统一使用 gap 属性。

在上面的例子中，其实一直使用的是 gap 属性，所以中间会出现 2 px 的间隙空白。

```css
gap: 2px;
```

当然也可以分开定义 row 和 column 的间隙

```css
gap: 2px 20px;
```

上面的属性定义了 row 为 2px 的间隙，column 为 20px 的间隙，效果如下：

![image-20230623222448927](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202306232224571.png)

### justify-items

justify-items 指定了网格元素的**水平**呈现方式，是水平拉伸显示，还是左中右对齐。

```css
justify-items: stretch | start | end | center;
```

当属性为`stretch`时，网格元素会水平拉伸显示。

比如下面有一个 300\*300 的 container 元素。

```html
<div class="container">
  <div class="one">1</div>
  <div class="two">2</div>
  <div class="three">3</div>
  <div class="four">4</div>
  <div class="five">5</div>
  <div class="six">6</div>
</div>
```

```css
.container {
  width: 300px;
  height: 300px;
  display: grid;
  grid-template-rows: 1fr 2fr;
  grid-template-columns: 100px 100px 100px;
}
```

当属性为`stretch`时，表现的结果是这样的

![image-20230623224346476](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202306232243548.png)

但是一旦设置成`center`、`end`、`start`其中之一，网格就会**收缩为内容大小**，并且按照属性显示成水平居中、靠右侧对齐、靠左侧对齐。

以下是`start`的效果：

![image-20230623224642261](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202306232246309.png)

对齐属性并不是最重要的，重要的点在于——**它按照内容收缩了**。

### align-items

跟 justify-items 对应，这个属性用来指定网格元素的**垂直**显示方式。

它也会有让网格元素收缩成内容大小的效果。

```css
.container {
  display: grid;
  grid-template-rows: 1fr 2fr;
  grid-template-columns: 100px 100px 100px;
  justify-items: start;
  align-items: center;
}
```

以下是 align-items 设置成 center 后的效果。

![image-20230623225209869](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202306232252937.png)

### justify-content

`justify-content`指定了网格元素的**水平分布**方式。此属性**仅在网格总宽度小于 grid 容器宽度时候有效果**。例如，我们网格设定的都是固定的宽度值，结果还有剩余空间。

```css
.container {
  width: 300px;
  height: 300px;
  display: grid;
  grid-template-rows: 1fr 2fr;
  grid-template-columns: 50px 50px 50px;
}
```

现在网格总宽度（依据 `grid-template-columns` 设定）才 150px，但是 container 总宽度为 300px，还有 150px 的剩余空间。

此时设置

```css
justify-content: space-between;
```

会占据剩余空间并根据`space-between`分配剩余空间。

![image-20230624124346311](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202306241243373.png)

`justify-content` 的属性有：

```css
justify-content: stretch | start | end | center | space-between | space-around | space-evenly;
```

通过代码沙盒亲自试一试：

```html-codeSandbox
<div class="grid-container">
  <style>
    .grid-container {
      border: 1px solid red;
      width: 300px;
      height: 300px;
      margin: 0 auto;
      text-align: center;
    }
    .grid-container {
      display: grid;
      grid-template-rows: 1fr 2fr;
      grid-template-columns: 50px 50px 50px;
      justify-content: stretch;
    }
    .grid-container > div {
      background: #e91e63;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
  </style>
  <div class="one">1</div>
  <div class="two">2</div>
  <div class="three">3</div>
  <div class="four">4</div>
  <div class="five">5</div>
  <div class="six">6</div>
</div>
```

### align-content

`align-content`可以看成和`justify-content`是相似且对立的属性，`justify-content`指明水平方向 grid 子项的分布方式，而`align-content`则是指明垂直方向每一行 grid 元素的分布方式。

如果所有 grid 子项只有一行，则`align-content`属性是没有任何效果的。

```css
align-content: stretch | start | end | center | space-between | space-around | space-evenly;
```

### grid-auto-columns 和 grid-auto-rows

我们规定了容器内的显示排列，但是依然有可能遇到两种情况：

1. 网格子项目多于指定的单元格
2. 网格子项目放置在显式网格之外

这时候 grid 会创建隐式表格。使用`grid-auto-columns`和`grid-auto-rows`可以指定隐式表格的尺寸。

以下面代码为例：

```html-preview
<div class="grid-container">
  <style>
    .grid-container {
      border: 1px solid red;
      margin: 0 auto;
      text-align: center;
    }
    .grid-container {
      display: grid;
      width: 150px;
      grid-template-columns: 60px 60px;
      grid-template-rows: 30px 90px;
      justify-content: stretch;
      grid-auto-columns: 60px;
      gap: 2px;
    }
    .one,
    .two {
      background-color: #e91e63;
    }
    .one {
      grid-column: 1/3;
      grid-row: 2/3;
    }
    .two {
      /*
      容器水平只有2个格子，但这里设定的是第3个，隐式网格创建
      */
      grid-column: 3/4;
      grid-row: 2/3;
    }
  </style>
  <div class="one">1</div>
  <div class="two">2</div>
</div>
```

由于第二个网格项目超出了原定的网格之外，这时候隐形网格创建了。

通过`grid-auto-columns: 60px;`来控制隐形网格，能够设定第二个超出格子的尺寸强制为 60px

### grid-auto-flow

`grid-auto-flow`属性控制没有明确指定位置的 grid 子项的放置方式。比方说定义了一个 5\*2 的 10 格子，共有 5 个元素，其中 2 个元素指定了放在哪个格子里，还有 3 个则自生自灭排列。此时，这 3 个元素如何排列就是由`grid-auto-flow`属性控制的。

```css
.container {
  grid-auto-flow: row | column | row dense | column dense;
}
```

试一试

```html-codesandbox
<div class="grid-container">
  <style>
    .grid-container {
      border: 1px solid red;
      margin: 0 auto;
      text-align: center;
    }
    .grid-container {
      display: grid;
      width: 150px;
      grid-template: 1fr 1fr 1fr/1fr 2fr 2fr 1fr 2fr;
      justify-content: stretch;
      gap: 2px;
      grid-auto-columns: 60px;
      grid-auto-flow: row;
    }
    .grid-container div {
      background-color: #e91e63;
    }
    .one {
      grid-column: 1;
      grid-row: 2 / 4;
    }
    .two {
      grid-row: 1 / 3;
    }
  </style>
  <div class="one">1</div>
  <div class="two">2</div>
  <div class="three">3</div>
  <div class="four">4</div>
  <div class="five">5</div>
</div>
```

## Grid Items 属性

### grid-column-start, grid-column-end, grid-row-start 和 grid-row-end

这几个属性用来表示 grid 子项占据区域的起始位置和结束位置。

`grid-column-start`和`grid-column-end`用来占据水平位置。

`grid-row-start`和`grid-row-end`用来占据垂直位置。

语法如下：

```css
.item {
    grid-column-start: <number> | <name> | span <number> | span <name> | auto
    grid-column-end: <number> | <name> | span <number> | span <name> | auto
    grid-row-start: <number> | <name> | span <number> | span <name> | auto
    grid-row-end: <number> | <name> | span <number> | span <name> | auto
}
```

虽然看起来很多，但是只需要使用`<number>`和`span <number>`两种就行（覆盖绝大部分情况）

以代码为例：

```html-preview
<div class="grid-container">
  <style>
    .grid-container {
      border: 1px solid red;
      margin: 0 auto;
      text-align: center;
    }
    .grid-container {
      display: grid;
      width: 300px;
      grid-template-columns: 100px 100px 100px;
      grid-template-rows: 100px 100px 100px;
      justify-content: stretch;
      gap: 2px;
    }
    .one,
    .two {
      background-color: #e91e63;
    }
    .one {
      grid-column-start: 1;
      grid-column-end: span 3;
      grid-row-start: span 2;
    }
    .two {
      grid-column-start: 2;
      grid-column-end: 3;
      grid-row-start: 3;
      grid-row-end: 4;
    }
  </style>
  <div class="one">1</div>
  <div class="two">2</div>
</div>
```

上面的例子中，横竖都有三个网格（一共有四条网格线）。

第一个子项横向开始于第`1`个网格线，结束于`span 3`。纵向为`span 2`。

意思是横向从第`1`个网格线开始占据 3 个网格，纵向从第`1`个网格线开始占据 2 个网格。

第二个子项横向开始于第`2`个网格线，结束于第`3`个网格线。纵向开始于第 3 个网格线，结束于第 4 个网格线。

意思是横向和纵向都占据 1 个网格。

下图可以帮助理解网格线。序号位置标注了`3 * 2`个网格的 grid 容器的网格线位置。

![Diagram showing numbered grid lines.](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202306261642992.png)

如果 grid 的容器网格线非常多，则推荐使用`span`指定占据多少个格子。

### grid-area

`grid-area`其实是`grid-row-start`, `grid-column-start`, `grid-row-end` 以及 `grid-column-end`属性的缩写，以及额外支持`grid-template-areas`设置的网格名称。

在[grid-template-areas](#grid-template-areas)一节已经介绍过了。

### justify-self

`justify-self`表示单个网格元素的水平对齐方式。默认值是 auto。语法如下：

```css
.item {
  justify-self: stretch | start | end | center;
}
```

**stretch**

拉伸。表现为水平填充。

**start**

表现为网格水平尺寸收缩为**内容大小**，同时沿着网格线左侧对齐显示。

**end**

表现为网格水平尺寸收缩为**内容大小**，同时沿着网格线右侧对齐显示。

**center**

表现为网格水平尺寸收缩为**内容大小**，同时在当前网格区域内部水平居中对齐显示。

### align-self

`align-self`指定了网格元素的垂直呈现方式，是垂直拉伸显示，还是上中下对齐，语法如下：

```css
.container {
  align-self: stretch | start | end | center;
}
```

跟 justify-self 效果是一样的。

## 其他

- 一旦设置了`grid`布局，那么子项中`float`，`display:inline-block`，`display:table-cell`，`vertical-align`以及`column-*`这些属性和声明则不起作用。
- Grid 布局则适用于更大规模的布局（二维布局），而 Flexbox 布局最适合应用程序的组件和小规模布局（一维布局）
- 这里有个游戏能快速了解 grid 布局https://cssgridgarden.com/
