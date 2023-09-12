# 原生实现上传文件预览

## 获取上传文件信息

原生的 HTML5 通过`<input type="file" >`属性来上传文件，我们可以采用浏览器提供的 File API 对所选择的文件进行操控。

如果我们希望访问选择的文件，分为两步

- 获取 DOM 元素

```html
<input type="file" id="input" />
```

```JavaScript
const selectFile = document.getElementById('input')
```

- 监控 change 事件

```JavaScript
const selectFile = document.getElementById('input')
selectFile.addEventListener('change',()=>{
  console.log(selectFile.files)
})
```

通过 DOM 的 files 属性，我们可以得知上传文件的相关信息，比如图中的文件名（name）和大小（size）
![image](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202307111318828.png)
浏览器直接将上传文件存到 fileList 这个数据结构中，这个数据结构可以存很多个文件，如果想要存多个，那么就需要添加 html 属性`multiple`

```html
<input type="file" multiple id="input" />
```

## 难看的上传文件控件

上传文件的控件实在很丑，我们有很多种方法改变它，这里就介绍最常用也是最简单的方式。

第一步，隐藏 input 控件

```css
#input {
  display: none;
}
```

第二步，创建好看的点击区域，这里就用 button 控件吧

```html
<button>上传</button>
```

```JavaScript
const selectFile = document.getElementById('input')
const button=document.querySelector('button') /

selectFile.addEventListener('change',()=>{
  console.log(selectFile.files)
})

button.onclick=function (){
  selectFile.click() // 调用 click函数点击
}
```

现在只需要对 button 组件进行样式调整就行啦。

## 使用 FileReader 对象预览上传的图片

下面，我们需要做一个预览图片的小功能，还是使用上面的代码，不过这里添加一个新的预览区.

我们考虑使用`FileReader`对象让浏览器异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容。

```html
<div>
  <input type="file" multiple id="input" />
</div>
<button>上传</button>
<img class="preview" />
```

```css
#input {
  display: none;
}
.preview {
  width: 100px;
  height: 100px;
}
```

```JavaScript
const selectFile = document.getElementById('input')
const button = document.querySelector('button')
const preview = document.querySelector('.preview')

selectFile.addEventListener('change', () => {
  //循环读取 fileList 的file
  for (let file of selectFile.files) {
    const imageReg = /image\//g //正则表达式
   // 检测 file 的 type 属性能否匹配到"image/"
    if (!imageReg.test(file.type)) {
      break
    }
    // 这里用到 FileReader API创建一个 Reader 读取器
    let reader = new FileReader()
    //当 reader 对某文件读取成功后的回调
    reader.onload = function (e){
      preview.src=e.target.result
    }
    //读取 DataURL后触发onload 回调
    reader.readAsDataURL(file);
  }
})

button.onclick = function() {
  selectFile.click()
}
```

上面代码中`readAsDataURL` 方法会读取指定的 `Blob` 或 `File` 对象。

读取操作完成的时候，`readyState`会变成已完成 DONE，并触发 loadend (en-US) 事件，同时 result 属性将包含一个 data:URL 格式的字符串（base64 编码）以表示所读取文件的内容。

我们把这个 base64 编码放到创建好的 img 标签的 src 属性上，就可以完成图片的预览。

## 使用 createObjectURL 预览上传的图片

这个 API 跟`readAsDataURL`的效果差不多，不过它返回的不是 base64 编码，而是`DOMString`,我们可以理解为本地内存容器的 URL 地址。

只需要稍微修改一下代码就可以了

```JavaScript
const selectFile = document.getElementById('input')
const button = document.querySelector('button')
const preview = document.querySelector('.preview')

selectFile.addEventListener('change', () => {
  //循环读取 fileList 的file
  for (let file of selectFile.files) {
    const imageReg = /image\//g //正则表达式
      // 检测 file 的 type 属性能否匹配到"image/"
    if (!imageReg.test(file.type)) {
      break
    }
    // 这里用到 createObjectURL API生成本地内存 url
    preview.src = window.URL.createObjectURL(file)
    preview.onload = function() {
      //由于每次使用createObjectURL都会产生一个URL 对象。
      //当你结束使用某个 URL 对象之后，应该通过调用这个方法来让浏览器知道不用在内存中继续保留对这个文件的引用了。
      window.URL.revokeObjectURL(this.src)
    }
  }
})

button.onclick = function() {
  selectFile.click()
}
```

### 预览 PDF

createObjectURL 还可以用来生成 PDF 预览，我们可以采用 iframe 标签，让 pdf 展示在 iframe 上

```html
<iframe id="viewer"></iframe>
```

```css
#viewer {
  width: 600px;
  height: 600px;
  border: 1px solid red;
}
```

```JavaScript
selectFile.addEventListener('change', () => {
  //循环读取 fileList 的file
  for (let file of selectFile.files) {
    const obj_url=window.URL.createObjectURL(file)
    // 这里用到 createObjectURL API生成本地内存 url
    iframe.setAttribute('src', obj_url);
    window.URL.revokeObjectURL(obj_url);
  }
})
```

先介绍这三种比较广泛的预览形式，后续如有需要，我再补充~

enjoy！
