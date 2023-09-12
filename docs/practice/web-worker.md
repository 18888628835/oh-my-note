# 如何在 React 中使用 web-worker

## 什么是 web-worker

Web Worker 为 Web 内容在后台线程中运行脚本提供了一种简单的方法。线程可以执行任务而不干扰用户界面。

**在 web-worker 中可以使用什么**？

- XMLHttpRequest
- fetch
- localStorage
- indexDB
- 执行其他 JavaScript 代码 ...

**不能使用什么**？

- 不能操作 DOM（主线程才可以操作）

- 不能使用 window 全局对象

  > worker 运行在另一个全局上下文中，不同于当前的[`window`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window)。因此，在 worker 中不能使用 window 对象。

一个 worker 可以将消息发送到创建它的 JavaScript 代码，通过将消息发布到该代码指定的事件处理器（反之亦然）。

workers 和主线程间的数据传递通过这样的消息机制进行——双方都使用 `postMessage()` 方法发送各自的消息，使用 `onmessage` 事件处理函数来响应消息（消息被包含在 [`message`](https://developer.mozilla.org/zh-CN/docs/Web/API/BroadcastChannel/message_event) 事件的 data 属性中）。**这个过程中数据并不是被共享而是被复制**。

## 在 React 中使用 web-worker

原生的 web-worker 虽然好用，但是如果想要在项目中使用，可能会存在以下问题：

- 需要手动修改 webpack 配置
- 需要对消息的发送、处理等大量封装，容易产生非常多的非业务性代码
- 增加同事 Review 代码的难度（是的，你很强，但你也很费队友）

有现成的 React-hooks 库已经帮助我们处理好开发中能遇到的大多数问题，这里推荐使用[useWorker](https://github.com/alewin/useWorker)。

但在使用之前，先说一下使用它的限制（同时也是 web-worker 的限制）：

1. 不要在里面访问 dom

   ```js
   document.querySelectoAll('#demoId') // not allowed!!
   window.navigator // not allowed!!
   ```

2. 当工作线程运行时，你要等它完成才能继续调用，或者先 kill 它。

3. web worker 无法返回函数,因为返回内容被 messageEvent 传递时序列化成字符串了。

4. web worker 接受到 handler 必须是纯函数而不能有任何副作用（比如在里面 setState 是不行的）。

**以下为用法：**

安装

```bash
npm install --save @koale/useworker
```

下面是针对 5000000 个数字进行排序的 webworker 使用方法，使用这个方法并不会阻塞 UI。

```tsx
import React from 'react'
import { useWorker } from '@koale/useworker'

const numbers = [...Array(5000000)].map((e) => ~~(Math.random() * 1000000))
const sortNumbers = (nums) => nums.sort()

const Example = () => {
  const [sortWorker] = useWorker(sortNumbers)

  const runSort = async () => {
    const result = await sortWorker(numbers) // non-blocking UI
    console.log('End.')
  }

  return (
    <button type="button" onClick={runSort}>
      Run Sort
    </button>
  )
}
```

## useWorker 入参和出参

以下是 useWorker 的 TS 定义：

```ts
const useWorker: <T extends (...fnArgs: any[]) => any>(
  fn: T,
  options?: Options,
) => [(...fnArgs: Parameters<T>) => Promise<ReturnType<T>>, WorkerController]
```

我们分析一下：

- 它接受一个函数，这里使用的是泛型，并且限制该泛型为函数，该函数的参数和返回值都为 any

- 它接受一个可选的 options，options 为：

  ```typescript
  type Options = {
    timeout?: number | undefined // kill worker 前的延迟
    remoteDependencies?: string[] | undefined // 一个数组，包含运行工作程序所需的远程依赖项
    autoTerminate?: boolean | undefined // 在worker 完成后自动终止
    transferable?: TRANSFERABLE_TYPE | undefined // 启用可传输对象，若要禁用，请设置可传输：“none”
  }
  ```

  其中比较有疑问的是`remoteDependencies`,当传入的 handler 中有一个方法来自于 cdn（或者其他远程链接）时，需要在这里写依赖的远程地址：

  ```jsx
  import { useWorker } from "@koale/useworker";

  const fn = dates => dates.sort(dateFns.compareAsc)

  const [workerFn, {status: workerStatus, kill: workerTerminate }] = useWorker(fn, {
    timeout: 50000 // 5 seconds
    remoteDependencies: [
      "https://cdnjs.cloudflare.com/ajax/libs/date-fns/1.30.1/date_fns.js" // dateFns
    ],
  });
  ```

- 它返回的第一个出参是 handler 的返回值（`ReturnType<T>`）,前面之所以用泛型，是因为这里需要用到返回类型。

- 它返回的第二个出参是 WorkerController，例子中没有，这里介绍一下它有哪些东西：

  1. status，表示处理的状态，一共有五个：

     `PENDING`：web 工作程序已初始化，但尚未执行

     `SUCCESS`：成功

     `RUNNING`：运行中

     `ERROR`：出错啦

     `TIMEOUT_EXPIRED`：因超时而挂掉了

  2. kill，用来停止 web-worker 的方法。

## 使用场景

使用场景其实很宽泛，在 React 中只要能使用纯函数，并且做一些操作很重的任务，但是不希望影响 UI，就可以使用这种方式来优化，比较常见的有：

1. CSV 解析和下载（纯前端实现时）

2. 某些用来解析的脚本，不希望它们占用主线程运行时。

   举个[transform：css-to-js](https://transform.tools/css-to-js)的例子，打开它的[源码 1](https://github.com/ritz078/transform/blob/master/pages/css-to-js.tsx)、[源码 2](https://github.com/ritz078/transform/blob/master/workers/postcss.worker.ts)，你会发现它在解析 css 时，用到的是 worker 内调用 postcss 来将字符串转化为 JS 对象。
