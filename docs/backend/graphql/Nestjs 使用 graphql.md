# Nestjs 使用 graphql

## 基本使用

**安装依赖**

```bash
pnpm i @nestjs/graphql @nestjs/apollo @apollo/server graphql
```

**在 AppModule 中引入**

```typescript
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver } from '@nestjs/apollo'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      typePaths: ['./**/*.graphql'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

- driver：使用 ApolloDriver 作为驱动程序
- playground：是否使用 Graphql-playground，这里禁用掉，因为 Apollo-sandbox 更好用
- plugins：插件，使用 `ApolloServerPluginLandingPageLocalDefault` 开启 Apollo-sandbox
- typePaths ：编写的 GraphQL Schema 文件的路径

**创建 Resource**

```bash
nest g resource --no-spec
? What name would you like to use for this resource (plural, e.g.,
"users")? users
? What transport layer do you use? GraphQL (schema first)
? Would you like to generate CRUD entry points? Yes
```

> resource 能够生成一个比较完整的 CRUD 示例，包含 graphql schema、CRUD resolver 等等。

生成后会创建这些文件。

```bash
CREATE src/users/users.graphql (397 bytes)
CREATE src/users/users.module.ts (225 bytes)
CREATE src/users/users.resolver.ts (959 bytes)
CREATE src/users/users.service.ts (625 bytes)
CREATE src/users/dto/create-user.input.ts (32 bytes)
CREATE src/users/dto/update-user.input.ts (192 bytes)
CREATE src/users/entities/user.entity.ts (21 bytes)
```

更新 `app.module.ts`把 UsersModule 引入进来。

```diff
imports: [
    GraphQLModule.forRoot(...),
+    UserModule,
  ],
```

**自动生成 type 的脚本**

安装 ts-morph

```bash
pnpm install ts-morph
```

在根目录创建`gen-typings.ts`文件并写入：

```typescript
import { GraphQLDefinitionsFactory } from '@nestjs/graphql'
import { join } from 'path'

const definitionsFactory = new GraphQLDefinitionsFactory()
definitionsFactory.generate({
  typePaths: ['./src/**/*.graphql'],
  path: join(process.cwd(), 'src/graphql.ts'),
})
```

在 package.json 中的 scripts 加上：

```json
"gen-typings": "ts-node gen-typings.ts"
```

执行 `pnpm run gen-typings`将生成类型文件。

![image-20240504011734027](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202405040117711.png)

进入`http://localhost:3000/graphql`用 Apollo-sandbox 查询：

![image-20240504012050534](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202405040120586.png)

## 传递额外的 context

每个 resolver 都会收到的 context 是 req ，如果想要额外添加则可以在`GraphQLModule.forRoot`中传递：

```typescript
    GraphQLModule.forRoot({
    ...
      context: () => ({ data: '123' }),
    }),
```

在 Query 中通过 `@Context`装饰器拿到它并打印出来：

```typescript
  @Query('users')
  findAll(@Context() ctx: any) {
    console.log('——————🚀🚀🚀🚀🚀 —— findAll —— ctx.data:', ctx.data);

    return this.usersService.findAll();
  }
```

## directive

定义指令标识符

```scheme
// directive.graphql
directive @upper on FIELD_DEFINITION
directive @auth on FIELD_DEFINITION
```

定义指令 transformer：

示例 1：将 string 结果大写

```typescript
// upper.transformer.ts
import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils'
import { defaultFieldResolver, GraphQLSchema } from 'graphql'

export function upperDirectiveTransformer(schema: GraphQLSchema, directiveName: string) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const upperDirective = getDirective(schema, fieldConfig, directiveName)?.[0]

      if (upperDirective) {
        const { resolve = defaultFieldResolver } = fieldConfig

        fieldConfig.resolve = async function (source, args, context, info) {
          const result = await resolve(source, args, context, info)
          if (typeof result === 'string') {
            return result.toUpperCase()
          }
          return result
        }
        return fieldConfig
      }
    },
  })
}
```

示例 2：传递 auth 给 context

```typescript
import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils'
import { defaultFieldResolver, GraphQLSchema } from 'graphql'

export function authDirectiveTransformer(schema: GraphQLSchema, directiveName: string) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const authDirective = getDirective(schema, fieldConfig, directiveName)?.[0]

      if (authDirective) {
        const { resolve = defaultFieldResolver } = fieldConfig

        fieldConfig.resolve = async function (source, args, context, info) {
          const result = await resolve(source, args, { ...context, auth: 'auth' }, info)

          return result
        }
        return fieldConfig
      }
    },
  })
}
```

`GraphQLModule.forRoot`中装载：

```typescript
    GraphQLModule.forRoot({
      ...
      context: () => ({ data: '123' }),
      transformSchema: (originalSchema) => {
        let schema = originalSchema;

        schema = upperDirectiveTransformer(schema, 'upper');
        schema = authDirectiveTransformer(schema, 'auth');

        return schema;
      },
    }),
```

新建一个 Query 查询：

```typescript
type Query {
  userName: String! @upper @auth
}
```

在 resolver 中写处理方法：

```typescript
  @Query('userName')
  async userName(@Context() ctx: any): Promise<string> {
    console.log('——————🚀🚀🚀🚀🚀 —— getUserName —— Context:', ctx);
    return ctx.auth;
  }
```

用 Apollo-sandbox 查询一下：

![image-20240506224653247](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202405062246530.png)

指令成功运行，拿到 context 并且将结果大写了。
