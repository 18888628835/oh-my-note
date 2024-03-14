# 如何对环境变量增加智能提示与校验

当我们开发或者部署时，往往需要将环境变量配置到 `.env` 文件当中。

如果你是多人协作项目，应该遇到过这种情况：

1. 你在开发某个功能，你将所需要的环境变量写入到`.env`中。
2. 然而`.env`文件很重要，你不能将其暴露给代码托管平台。
3. 你提交了代码，并且将私密的环境变量写入 Vercel 或者 K8S 等地方。
4. 线上代码运行良好，你很满意，并且在项目文档中加了一条：添加 XXX 变量。
5. 第二天，你的懒汉同事们发现本地代码(或功能)运行不起来。经过半个小时的功能测试，最后发现仅仅是环境变量没有配齐。

又或者遇到过这种情况：

你使用 Typescript，你很享受 Typescript 的类型提示带来的便利。

然而，当你输入 `process.env`时，并没有出现你想要的类型提示。

![image-20240314171352053](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202403141713752.png)

于是，身为懒汉的你只能从庞大的项目目录中再次翻找出 env 文件，打开-拷贝-粘贴...

为了解决上面两个懒汉问题，我们可以使用一个支持 Typescript 类型的验证库：

```bash
pnpm install zod
```

假设我们的.env 文件中有一个环境变量：

```js
EMAIL_FROM=xxx@gmail.com
```

新建一个 `env.ts `文件，写入：

```typescript
import { z } from 'zod'

const environmentSchema = z.object({
  EMAIL_FROM: z.string().email(),
})

try {
  environmentSchema.parse(process.env)
} catch (error) {
  console.log('孙子，你的环境变量出错啦')
  console.log(error)
}
```

现在你已经完成了环境变量的校验，请将 `env.ts` 文件引入到项目的启动文件，以让项目的编译工具打包而不是被 tree shaking 掉。

以 nextjs 为例，将其引入到`layout.tsx`文件中，这样 `env.ts`文件就会随着项目的启动而被编译。

```ts
// layout.tsx
import '../env'
```

现在如果你的环境变量不满足 email 的条件，那么你的控制台一定会报错：

![image-20240314172638154](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202403141726429.png)

现在你已经完成了对` process.env` 的验证。

等下次你的**懒汉同事**启动项目时，一定会发现他多了一个爷爷。

接着，是让同样为懒汉的你省去没有智能提示的烦恼。

我们利用 zod 提供的类型推导功能，将类型提取出来：

```typescript
type EnvVarSchemaType = z.infer<typeof environmentSchema>
```

最后，我们覆盖掉默认的 `process.env` 的类型

```typescript
declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvVarSchemaType {}
  }
}
```

测试一下看看：

![image-20240314174308314](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202403141743466.png)

本文的分享到此结束。
