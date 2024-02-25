# IAM 服务

## 创建一个 IAM 用户

搜索 IAM 服务。

![image-20240225153427653](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202402251534705.png)

指定用户详细信息

![image-20240225141334807](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202402251413866.png)

设置权限先跳过~

设置一个标签

![image-20240225141649801](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202402251416845.png)

创建密码完成

![image-20240225141717603](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202402251417649.png)

先把**密码**和**登录 URL** 存入 1password，后面要给 IAM 用户使用。![image-20240225141932529](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202402251419576.png)

在登录新的 IAM 用户之前，需要给 IAM 额外设置一下 token 以调用 API

![image-20240225143018139](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202402251430209.png)

获取 API 密钥 并记入 1password。

![image-20240225143225561](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202402251432633.png)

密钥虽然已经有了，但用户目前拥有的权限却不够，比如希望该用户拥有操作 S3 的权限,就需要再给用户赋予 S3 的相关权限。

但是最好不要直接给用户设置权限，因为这样一旦 IAM 用户太多，权限管理起来过于困难。

我们可以先创建一个用户组，然后把该角色添加到组里，最后给该组附加权限。

这种对组的权限管理要比管理单个 IAM 用户的权限要简单得多。

![image-20240225151905704](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202402251519844.png)

根据上面的操作图，将 S3 的全部操作策略都赋予给了 admin_group 分组，然后在该分组下的 admin 用户就可以完全操作 S3 了。

还有很多比较细节的策略都由 AWS 设置好了，在策略一览下查看或者创建新的自定义策略都是支持的。

![image-20240225152356371](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202402251523417.png)

现在可以登录 IAM 用户了。

通过创建 IAM 时，AWS 提供的控制台 URL 登录。

![image-20240225152851773](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202402251528821.png)

登录后，进入 S3 ，可以测试一下对 S3 的权限是否已经生效。

![image-20240225153142012](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202402251531071.png)

## IAM 策略

AWS 的策略是用 JSON 来描述的，刚才我们使用了内置的 S3FullAccess 策略，它的 JSON 是这样的：

![image-20240225155436707](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202402251554798.png)

乍一看很难解读对不对，AWS 是这样规定它的字段的：

1. Effect：表示允许或者拒绝，允许为 Allow，拒绝为 Deny 。

2. Action：格式为`<服务名称>:<API>`，例如`s3:getobject`表示对 S3 的 getobject 的操作。

3. Resource：格式为`arn:aws | arn:aws-cn:服务名:region(cn-north-1):12位:资源名称`。

   由于 aws 中国和海外账户不同体系，所以区分了`arn:aws`和`arn:aws-cn`，后面就是跟的区域、资源名等。

4. Condition：字段是可选的，表示条件。

下面是一个比较标准的 AWS 策略：

![image-20240225161302692](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202402251613784.png)

其中 Condition 详细规定了时间，IP 等限制条件。

权限的 JSON 很难自己手写出来，一般都是通过 JSON 编辑器去配置的。

![image-20240225161517211](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202402251615288.png)

## 角色

在 AWS 中，角色是一种可以赋予特定权限的实体，但与用户不同，角色没有登录密码，不能直接进行操作。它主要用于给 AWS 服务或者在 AWS 环境中运行的应用程序赋予权限。

例如，你可以创建一个角色，并赋予它可以访问 S3 存储桶的权限，然后把这个角色附加到一个 EC2 实例上，那么运行在这个 EC2 实例上的应用程序就可以直接访问 S3 存储桶，而不需要明确的认证过程。

这样做的好处是，可以避免在代码中硬编码 AWS 的访问密钥，提高了应用程序的安全性。同时，角色的权限可以随时调整，不需要修改和重启正在运行的应用程序。

总的来说，AWS 中的角色主要用于：

1. 代表 AWS 服务执行操作：你可以创建一个角色，并赋予它在特定情况下代表你的 AWS 服务执行操作的权限。
2. 跨账户访问：你可以创建一个角色，并允许另一个 AWS 账户的用户在需要时切换到该角色。
3. 身份联邦：你可以创建一个角色，并允许用户使用任何已支持的身份提供商（包括 AWS Directory Service、OpenID Connect (OIDC) 或 SAML 2.0）的身份访问你的 AWS 资源。
4. EC2 实例配置：你可以创建一个角色，并将其附加到你的 EC2 实例以使应用程序访问 AWS 产品。

以跨账号访问为例，我先在个人 AWS 账户中创建一个角色：

![2024-02-25.175508](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202402251759191.png)

这里的角色主要用于给第三方 AWS 账户使用，所以选择的是 AWS 账户，并且把我另一个工作用的 AWS 账户的 ID 填写进来了。

再设置一个 S3 的只读策略：

![image-20240225180139435](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202402251801540.png)

创建成功后的面板详细中包含了 **roleName** 和 **account**，这两个都需要在后续切换角色时用到：

![image-20240225180944746](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202402251809818.png)

登录工作用的 AWS 账户后，就可以切换角色

![image-20240225180645739](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202402251806837.png)

输入账户和角色名：

![image-20240225180536401](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202402251805499.png)

我的工作账号已经访问我的个人账户的 S3 啦。

![image-20240225181108481](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202402251811582.png)

本账户下的角色权限也适用于同一种情况。

## 策略分配

从以上的实践得出，AWS 的策略可以分配给以下三种情况：

![image-20240225181805789](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202402251818901.png)

他们的区别如下：

| IAM 角色                                     | IAM 用户                 | IAM 分组                     |
| -------------------------------------------- | ------------------------ | ---------------------------- |
| 委派对 AWS 资源的访问权限                    | 使用户具有某些特定的权限 | 所有属于该组的用户将继承权限 |
| 提供临时访问                                 | 持续访问                 | 持续访问                     |
| 无需使用 AWS 凭证，更加安全                  | 需要使用凭证             | 该组的人需要凭证             |
| 权限策略附加到角色上                         | 权限策略附加到用户上     | 权限策略附加到分组           |
| 主体可以是**账户**或**AWS 服务(比如 EC2)**等 | 主体是用户               | 主体是分组用户               |
| 可以跨账户                                   | 不可以跨账户             | 不可以跨账户                 |

AWS 培训计划给了一张图，用来表示他们之间的关系以及各自可能适用的场景。

<img src="https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202402251844201.png" alt="image-20240225184453074" style="zoom:25%;" />

## 总结

IAM，全名是 Identity and Access Management，是 AWS 提供的一个服务，用于控制对 AWS 资源的访问。

IAM 服务的主要功能包括：

1. 用户和访问管理：您可以创建和管理 AWS 用户和组，并使用权限来允许或拒绝他们访问 AWS 资源。
2. 安全性：您可以实施安全控制，例如要求用户更改密码、启用多因素认证等。
3. 访问权限控制：您可以精细控制用户对 AWS 服务和资源的访问权限，例如仅允许某个用户能访问特定的 S3 存储桶。
4. 身份联合：如果您已经有了自己的用户目录，您可以使用 IAM 的身份联合功能，让您的用户使用自己的现有凭据访问 AWS 资源。
5. 临时安全凭证：IAM 还可以提供临时安全凭证，用于在需要时赋予用户或服务临时的 AWS 访问权限。
6. 审计：您可以使用 AWS CloudTrail 记录和获取您的 IAM 和 AWS STS 调用的详细信息，以进行安全分析、资源更改跟踪和合规性审计。

通过使用 IAM，您可以实现对 AWS 环境的安全管理和访问控制，提升企业运用云服务的安全性和便利性。
