# 原生实现图片懒加载

## 什么是图片懒加载

图片懒加载是一直网页性能优化的方式，随着屏幕分辨率的飞速提升，人们对电脑上的视觉效果要求日益高涨。图片作为常见的网页内容，人们对它所呈现的效果需求自然水涨船高。越高分辨的图片意味着内存占用越大，一张图片以 M 为单位已经是屡见不鲜。

我们常用的淘宝首页，里面的商品图片不但内存占用大，而且数量非常多，如果一次性全部加载出来，对网速的要求高，而且对浏览器的性能开销非常巨大。如果这时候不做一些性能优化，那么浏览器很有可能因为加载图片而变得卡顿，非常影响用户体验。

常见的图片性能优化就是图片懒加载：根据用户的交互行为触发图片加载。

## 新时代图片懒加载方案

现在已经买入 2021 年了，这时候不提浏览器自动实现的懒加载方案无疑是落伍的。这种方式非常简单，只需要给 img 添加`loading`属性即可

```html
<img src="" loading="lazy" alt="" /> //告诉浏览器懒加载图片
<img src="" loading="auto" alt="" /> //告诉浏览器懒加载还是立即加载你自己选
<img src="" loading="eager" alt="" /> //告诉浏览器立即加载
```

这种方案最初是 chrome 实现的，为了方便开发者，提升浏览器的性能，谷歌公司在 chrome 浏览器内部实现根据图片尺寸、大小、用户交互行为等要素自动触发优化图片加载机制。目前很多浏览器已经采用这种方案，相信以后会成为流行。

**截止目前为止的兼容性报告**
![image](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202307111316423.png)

我们有必要了解一下浏览器使用 loading 属性实现懒加载的触发机制。

根据大神张鑫旭这篇博客[浏览器 IMG 图片原生懒加载 loading=”lazy”实践指南](https://www.zhangxinxu.com/wordpress/2019/09/native-img-loading-lazy/),有兴趣直接点进去看测试过程，这里只放测试结论：

> 最后，总结下，原生懒加载的 5 个行为特性：
>
> - Lazy loading 加载数量与屏幕高度有关，高度越小加载数量越少，但并不是线性关系。
> - Lazy loading 加载数量与网速有关，网速越慢，加载数量越多，但并不是线性关系。
> - Lazy loading 加载没有缓冲，滚动即会触发新的图片资源加载。
> - Lazy loading 加载在窗口 resize 尺寸变化时候也会触发，例如屏幕高度从小变大的时候。
> - Lazy loading 加载也有可能会先加载后面的图片资源，例如页面加载时滚动高度很高的时候。

## JavaScript 实现图片懒加载

跟原生浏览器支持，这里的图片懒加载是当页面的图片进入到用户的可视范围之内再加载图片，逻辑是开发者构思想到的。

构思过程如下：

1.img 标签不放 src 属性，而是放诸如`data-src`这样的自定义属性，把图片路径放在这个属性下。

2.当图片进入可视区域时，把 data-src 的图片路径拿出来放置到 src 属性上。

3.浏览器识别到 img 属性的 src 属性，触发重渲染,显示出图片。

**需要解决的问题**
我们如何知道图片进入可视区域了呢？一张图表示
![image](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202307111316974.png)

可视区域的高度 X：使用`window.innerHeight`属性获取

元素距离可视区域的 top 高度：使用`element.getBoundingClientRect()`方法返回元素的大小及其相对于视口的位置，所以可以直接取。

接下来放代码：

```html
<div>
  <img data-src="./http.png" />
</div>
<div>
  <img data-src="./http.png" />
</div>
<div>
  <img data-src="./http.png" />
</div>
<div>
  <img data-src="./http.png" />
</div>
<div>
  <img data-src="./http.png" />
</div>
<div>
  <img data-src="./http.png" />
</div>
<div>
  <img data-src="./http.png" />
</div>
<div>
  <img data-src="./http.png" />
</div>
<div>
  <img data-src="./http.png" />
</div>
```

```css
#app div {
  border: 1px solid red;
  min-height: 200px;
}
```

```JavaScript
let images = document.querySelectorAll("img");
let viewHeight = window.innerHeight; //可视区域高度
let n = 0; //记录已触发渲染图片的数量

function loadLazy() {
  for (let i = n; i < images.length; i++) {
    //判断图片的top属性是否小于可视区域高度，是就说明要设置 src
    if (images[i].getBoundingClientRect().top < viewHeight) {
      images[i].src = images[i].getAttribute("data-src");
      // 下次循环时，从最后设置 src的图片的下一张开始
      n = i + 1;
    } else {
      break;
    }
  }
}
//当浏览器滚动时，最好用防抖函数，以免太过频繁触发 scroll 事件
function debounce(handler, delay) {
  let timer = null;
  return function (...args) {
    let context = this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      handler.call(context, ...args);
      clearTimeout(timer);
    }, delay);
  };
}

window.addEventListener("scroll", debounce(loadLazy, 500));
```

效果

![lazyLoading](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202307111316712.gif)

结束~

enjoy！
