# 如何实现 JWT？

HTTP 是一种无状态的通信协议，所谓无状态，就是服务器不能通过它判断两次发请求过来的是不是同一个用户。好在它可以扩展，通过扩展，可以分辨出是同一个用户在访问网站。

比如：

用户需要登录后才能在淘宝上购买商品，这样服务器才能知道购买商品的人是谁，地址是哪里。

当用户将某商品加入购物车时，也会将请求发送给服务器，而服务器则需要通过上次用户登录的记忆知道发请求的人是谁，这样才能将信息推到对应人的购物车上。

那么，这里的记忆在以前是指 cookie。

它的流程是这样的：

- 用户向服务器发送账号和密码。
- 服务器验证通过后，在当前对话(session)里面保存相关的数据，比如用户角色，登录时间等。
- 服务器向用户返回一个 session_id，写入用户的 Cookie。
- 用户随后的每一次请求，都会通过 Cookie，将 session_id 传回服务器。
- 服务器收到 session_id，得知用户的身份，就可以知道这是同一个用户。

这种模式的缺点在于扩展性不足。比如当用户登录同一家公司的不同网站都需要用户信息时，session 数据 就需要共享，让每台服务器都能读取 session。

共享的方法是让 session 数据持久化，写入数据库或者别的持久层。虽然这种方法架构清晰，但也工程量巨大，而且持久层的稳定性要求高。

由于上面的方法缺点明显，所以就需要另一种方法：

直接放弃 session 这种方式，而是利用新的方案替代原来的登录体系，JWT 就是流行的方案。

## JWT 方案

JWT 全称 `JSON Web Token`，翻译过来就是 JSON 格式的 网络令牌。它会直接将用户的信息生成一个 `JSON`对象，发还给用户。

比如当用户登录 后，服务器经过认证，发现他的信息是这样的

```json
{
  "username": "qiuyanxi",
  "role": "admin",
  "time": "2021-07-06"
}
```

服务器会把这条数据返回给用户，当用户每次请求时，都会带上这条数据，服务器就可以通过这条数据上的内容判定用户身份。

这样的话服务器跟客户端的通信又会变成无状态的了。

不过由于直接这样传会不安全，所以 JWT 会将整个信息经过加密处理，转化成字符串的形式。

### JWT 长什么样

整个 JWT 大概是这样的

![image-20210708200705549](https://camo.githubusercontent.com/42d50566c3d21928055c23b266cdc10d9fb43339bd4175b9bdf3af6d7ca0766a/68747470733a2f2f747661312e73696e61696d672e636e2f6c617267652f3030386933736b4e6c793167733973726861396d786a333139363062383439672e6a7067)

它是一串很长的字符串，中间用`.`分割成三个部分:

- Header(头部)
- Payload（负载）
- Signature（签名）

![image-20210708200906158](https://camo.githubusercontent.com/7416507651f74716ef28dcf3563c6f13d50b6ce5af9ece5cfc8892af70abbb94/68747470733a2f2f747661312e73696e61696d672e636e2f6c617267652f3030386933736b4e6c7931677339737467306575386a333161633064713433712e6a7067)

### Header

Header 部分是 JSON 对象，描述 JWT 的元数据，通常长这样

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

alg 属性表示签名的算法，typ 属性表示令牌的类型。

上面的 JSON 对象会通过 Base64URL 算法转化成字符串。

### Payload

Payload 部分也是 JSON 对象，用来存放实际需要传递的数据，JWT 预设了以下官方字段：

- iss (issuer)：签发人
- exp (expiration time)：过期时间
- sub (subject)：主题
- aud (audience)：受众
- nbf (Not Before)：生效时间
- iat (Issued At)：签发时间
- jti (JWT ID)：编号

除此之外，还可以定义私有字段，比如这样

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true
}
```

注意，JWT 默认是不加密的，任何人都可以读到，所以不要把秘密信息放在这个部分。

这个 JSON 对象也要使用 Base64URL 算法转成字符串。

### Signature

Signature 部分是对前两部分的签名，防止数据篡改。

首先，需要指定一个密钥，这个密钥只有服务器知道。然后通过 Header 里面的签名算法（默认是 HMAC SHA256），按照下面的公式产生签名。

```javascript
HMACSHA256(base64UrlEncode(header) + '.' + base64UrlEncode(payload), secret)
```

计算出签名后，将 Header、Payload、Signature 三个部分拼接成字符串，每个部分用`.`隔开，返回给用户。

### Base64URL

Header 和 Payload 串型化的算法是 Base64URL。这个算法跟 Base64 算法基本类似，但有一些小的不同。

JWT 作为一个令牌（token），有些场合可能会放到 URL（比如 api.example.com/?token=xxx）。Base64 有三个字符`+`、`/`和`=`，在 URL 里面有特殊含义，所以要被替换掉：`=`被省略、`+`替换成`-`，`/`替换成`_` 。这就是 Base64URL 算法。

## 从 Nodejs 来看 JWT 整个过程

下面我们使用 koa 实现 JWT，理解整个过程。首先我会在登录界面发送请求，并附上账号密码：

![image-20210708204203395](https://camo.githubusercontent.com/20c261aab1acbc29320aed5926ca47f2c1bddb1b8ac46baae0e22cc46f0b3129/68747470733a2f2f747661312e73696e61696d672e636e2f6c617267652f3030386933736b4e6c7931677339747271356d72716a333079613037713430312e6a7067)

然后使用 koa 实现一个简易的 web 服务端，来接收这个请求，并返回 JWT。

```javascript
//server.js
import Koa from 'koa'
const Router = require('koa-router')
let bodyparser = require('koa-bodyparser')
const jwt = require('jsonwebtoken') //通过这个库来生成 jwt
const app = new Koa()
const router = new Router()
app.use(bodyparser())

//登录验证
router.post('/login', async (ctx, next) => {
  const { username, password } = ctx.request.body
  if (username === 'admin' && password === 'admin') {
    //生成 jwt签名，ssh 是密钥
    const token = jwt.sign({ username, exp: Math.floor(Date.now() / 1000) + 60 * 60 }, 'ssh')
    ctx.body = {
      code: 200,
      success: true,
      data: true,
      username,
      token,
    }
  } else {
    ctx.body = { code: 403 }
  }
})
// 验证是否有权限
router.get('/validate', async (ctx) => {
  let Authorization = ctx.get('authorization')
  let [, token] = Authorization.split(' ')
  if (token) {
    try {
      let r = jwt.verify(token, 'ssh') //核实 token
      console.log(r)
      ctx.body = {
        code: 200,
        username: r.username,
        token,
      }
    } catch (e) {
      ctx.status = 401
      ctx.body = {
        code: 401,
        data: '没有登陆',
      }
    }
  } else {
    ctx.status = 403
    ctx.body = { message: '你无此权限' }
  }
})

app.use(router.routes()).use(router.allowedMethods())
app.listen(3000) //监听3000端口
```

上面的代码中使用了 [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)来实现令牌的生成

```javascript
const token = jwt.sign({ username, exp: Math.floor(Date.now() / 1000) + 60 * 60 }, 'ssh')
```

生成后返回给客户端的数据是这样子的

```JavaScript
code: 200
data: true
success: true
token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNjI1NzUzODEzLCJpYXQiOjE2MjU3NTAyMTN9.RCCTU-KwuhmW7exexsx9WXtp2i0ec-ARSBCGIOdn_r0"
username: "admin"
```

当用户登录时，还会进行一层权限校验，这时候客户端需要发送给服务器获取到的 token，一般来说，token 会存到 `localstorage`中，由前端将其加入到请求头的`Authorization`中

```typescript
/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<API.CurrentUser>('/api/validate', {
    method: 'GET',
    headers: {
      Authorization: `Bear ${localStorage.getItem('access-token')}`,
    },
    ...(options || {}),
  })
}
```

当服务器收到后，会经过密钥解码，取出其中的数据

```JavaScript
      let r = jwt.verify(token, "ssh"); //核实 token
      console.log(r);//{ username: 'admin', exp: 1625753813, iat: 1625750213 }
```

exp 是过期时间，而 iat 是签发时间，username 是在生成令牌时传入的用户信息。

整个过程大致就是如此。

## 总结

- JWT 方案可以让服务器重新回到无状态的情况
- JWT 本身包含了认证信息，一旦泄露，任何人都可以获得该令牌的所有权限。为了减少盗用，JWT 的有效期应该设置得比较短。对于一些比较重要的权限，使用时应该再次对用户进行认证。
- 最好不要将非常重要的信息写入 token 中

## 参考连接

- [Learn how to use JSON Web Tokens](https://github.com/dwyl/learn-json-web-tokens/blob/master/README.md), by dwyl
- [JSON Web Token 入门教程- 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html)

enjoy！！
