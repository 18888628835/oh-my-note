# Docker 进阶

## Docker network

### 网络简介

Docker 会创建三个网络：

- bridge 桥接网络

  如果不指定，新创建的容器默认将链接到 bridge 网络。

  默认情况下，使用 bridge 网络，宿主机可以 ping 通容器 ip，容器中也能 ping 通宿主机。

  容器之间只能通过 ip 地址互相访问，由于容器的 ip 会随着启动顺序发生变化，因此不推荐使用 ip 访问。

- host 与宿主机共享网络

  容器与宿主机共享网络，不需要映射端口即可通过宿主机 ip 访问。（-p 选项会被忽略）

  主机模式网络可用于优化性能，在容器需要处理大量端口的情况下，它不需要网络地址转化（NAT），并且不会为每个端口创建“用户空间代理”。

- none 禁用容器中所用网络，在启动容器中使用

### 创建自定义网络

桥接网络下，不推荐使用 ip 访问，那么能通过什么访问呢？可以使用用户自定义网络。

在用户自定义网络下，用户可以通过容器的名称来做到互相访问。

- 容器之间可以使用容器名互相访问
- 使用 Docker 的嵌入式 DNS 服务器将容器名解析成 IP

创建网络

```bash
docker network create <NetWork Name>
```

容器连接到自定义网络

```bash
docker network connect <NetWork Name> <Container Name>
```

以之前创建的 local-mysql 为例，将该容器连接到自定义网络

```bash
docker network connect my-net local-mysql
```

现在可以创建新的 mysql 客户端，通过自定义网络而不是 ip 访问 local-mysql 容器

```bash
-- 通过 ip 访问
docker run -it --rm mysql:5.7.28 mysql -h172.17.0.2 -uroot -p
-- 通过 network 访问
docker run -it --rm --network my-net mysql:5.7.28 mysql -hlocal-mysql  -uroot -p
```

创建容器时可以通过`--network`用来指定新容器加入到已有网络中。

> 当在创建容器时使用了自定义网络，那么该容器将不再连接默认的 bridge 网络。

### 管理网络

通过`docker inspect <container>`查看容器有关网络的信息，

以之前创建的 local-mysql 为例，将该容器连接到自定义网络

```bash
docker network connect my-net local-mysql
```

此时用 `docker inspect`可以看到容器有两个网络了

```json
"Networks": {
                "bridge": {
                ...
                },
                "my-net": {
                ...
                }
            }
```

上面是连接了自定义网络的容器的 inspect 信息，可以看到有两个网络，一个是默认的桥接网络，另一个是由我们创建的自定义网络。

### 容器间互联

Docker 提倡轻量级容器的理念，所以容器中通常只包含一种应用程序。

但拿最简单的 Web 应用为例，至少我们需要业务应用、数据库应用、缓存应用等组成一个完整的系统。

这些应用的通讯方式以网络为主，所以打通容器间的网络，才能让它们互相通信。

要让一个容器连接到另外一个容器，我们可以在容器`create`或者`run`创建时通过`--link`选项进行配置。

例如，下面创建一个 MySQL 容器，将运行我们 Web 应用的容器连接到这个 MySQL 容器上，打通两个容器间的网络，实现他们之间的网络互通。

```bash
docker run -d --name mysql -e MYSQL_RANDOM_ROOT_PASSWORD=yes mysql
docker run -d --name webapp --link mysql webapp:latest
```

现在名为`webapp`的容器已经和名为`mysql`的容器互相连接成功。

然后我们在`webapp`中可以通过 `mysql`这个容器名来访问 `mysql` 数据库啦。

`host configure`就可以设置为:`mysql`。

同时还可以指定一个别名来替代容器名，语法是`--link <container name>:<alias>`

```bash
docker run -d --name webapp --link mysql:database webapp:latest
```

`host configure`就可以设置为：`database`

不管是自定义网络还是`--link`方式实现容器间的互联，都只需要配置被连接容器的别名，Docker 就能够帮助我们自动映射 IP，我们不需要知道容器的 IP 地址就能进行连接。

### 暴露端口

Docker 为容器网络增加了一套安全机制，只有容器自身允许的端口，才能被其他容器所访问。

这个容器自我标记端口可被访问的过程，我们称之为暴露端口。

端口的暴露可以通过 Dockerfile 定义，也可以在容器创建时定义。

在容器创建时定义时借助`--expose`这个选项

```bash
docker run -d --name mysql -e MYSQL_RANDOM_ROOT_PASSWORD=yes --expose 13306 --expose 23306 mysql:latest
```

上面的命令在创建 mysql 容器时，暴露了 13306 和 23306 的端口。

通过 `docker ps`可以看到两个端口已经成功的打开。

![image-20221212221118536](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202307110003980.png)

mysql 默认打开端口是 3306 和 33060，我们又额外暴露出 13306 和 23306 两个端口。

暴露了端口只是类似于打开了容器的防火墙，具体能不能通过这个端口访问容器中的服务，还需要容器中的应用监听并处理来自这个端口的请求。

### 端口映射

Docker 的端口映射提供了一种从容器外访问容器内应用的功能。

![img](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202307110003261.awebp)

通过 Docker 端口映射，我们可以把容器的端口映射到宿主机操作系统的端口上，当我们从外部访问宿主机的端口时，数据请求会自动发送到与之关联的容器端口上。

要映射端口，我们可以使用`-p`选项。

```bash
docker run -d --name nginx -p 80:80 -p 443:443 nginx:1.12
```

映射端口的格式是`-p <host-port>:<container-port>`。

## Docker 数据存储

将数据存储在容器中，一旦容器被删除，数据也会被删除。同时也会使容器变得越来越大，不方便恢复和迁移。

将数据存储在容器之外，这样删除容器也不会丢失数据。一旦容器故障，我们还可以重新创建一个容器，将数据挂载到容器中，就可以快速恢复数据。

Docker 的数据存储提供了三种应对不同场景的文件系统挂载方式：

1. **bind mount 绑定挂载**

   **bind mount** 能够直接将宿主操作系统中的目录和文件挂载到容器内的文件系统中，通过**指定容器外的路径和容器内的路径**，就可以形成挂载映射关系，在容器内外对文件的读写，都是相互可见的。

2. **volumn 卷**

   **Volume** 也是从宿主操作系统中挂载目录到容器内，只不过这个挂载的目录由 Docker 管理，并且与主机的核心功能隔离。非 Docker 进程不能修改文件系统的这一部分。我们只需要**指定容器内的目录**，不需要关心具体挂载到宿主机的哪个位置。

3. **tmpfs 临时挂载**

   **tmpfs** 支持挂载系统内存中的一部分到容器的文件系统里，不过由于内存和容器的特征，它的存储并不是持久的，其中的内容会随着容器的停止而消失。

### bind mount 绑定挂载

绑定挂载适用以下场景：

- 将配置文件从主机共享到容器
- 在 Docker 主机上的开发环境和容器之间共享源代码或者编译目录

要将宿主机中的目录挂载到容器的某个目录中，我们可以在容器创建时通过传递`-v`选项来指定内外挂载的对应目录或文件。

主要形式是：

```bash
-v <host-path>:<container-path>
```

这里的 path 只能使用绝对路径，不能使用相对路径。

同时，Docker 还支持以只读的方式挂载，通过只读方式挂载的目录或者文件，只能被容器中的程序读取，但不接受容器中程序修改它们的请求。在挂载选项`-v`后接上`:ro`就可以只读挂载了。

以 mysql 为例，参考 https://hub.docker.com/_/mysql 提供的命令示例。

下面是使用在容器中使用一个新的 `mysql configuration file`

```bash
docker run --name some-mysql -v ~/desktop/mysql-config/mysql-config.cnf:/etc/mysql/conf.d/mysql.cnf:ro \
-v ~/desktop/mysql/data:/var/lib/mysql \
-e MYSQL_ROOT_PASSWORD=123456 -d mysql:5.7.28
```

- `-v` —— 绑定挂载使用`-v`参数将主机上的目录或者文件装载到容器中。绑定挂载会覆盖容器中的目录和文件。
- `~/desktop/mysql-config/mysql-config.cnf:/etc/mysql/conf.d/mysql.cnf:ro` 将冒号前面的主机的配置文件的路径映射到冒号后面容器中的 mysql.cnf 的路径，以此来修改 docker-mysql 的配置文件。加入`:ro`后表示只读，容器内程序不能修改，但宿主机还是可以改的。
- `~/desktop/mysql/data:/var/lib/mysql` 把冒号后面 mysql 容器存储数据的地方映射到冒号前面宿主机的存储文件中。如果宿主机的目录是不存在的，那么 docker 会自动创建这个目录。但是 docker 只自动创建文件夹，不会创建文件。

> 以上有关容器的路径地址均来自 https://hub.docker.com/_/mysql 官方文档

上面的命令敲完就能在主机上看到 mysql 容器的数据存储到主机上了。

![image-20221127230744896](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202307110003093.png)

通过交互方式看一下容器中的配置文件是否已经放进去了

```bash
 docker exec -it 0727fc097470 /bin/bash
 cat /etc/mysql/conf.d/mysql.cnf
```

**这时候在主机上修改内容，然后去容器里面看，配置文件会同步变更。**

以下是我在宿主机上修改后，到容器内敲命令查询出来的修改后的文件的内容。

```bash
$ root@0727fc097470:/# cat /etc/mysql/conf.d/mysql.cnf
# this is mysql configuration file
## I have write something in this file
```

通过`docker inspect`查询一下挂载的信息：

```bash
    "Mounts": [
        {
            "Type": "bind",
            "Source": "/Users/qiuyanxi/desktop/mysql-config/mysql-config.cnf",
            "Destination": "/etc/mysql/conf.d/mysql.cnf",
            "Mode": "ro",
            "RW": false,
            "Propagation": "rprivate"
        }
        ...
    ],
```

`Type` 为 `bind`，说明我们用的是`bind mount`。

`RW`为`false`，说明挂载的文件是只读的。

### volume

卷是 docker 容器存储数据的最好的方式，卷有以下优势：

- 可以在多个运行的容器之间互相共享数据。仅当显式删除卷时，才会删除卷
- 当想要将容器数据存储在外部网络存储上或者云提供商上，而不是本地时。
- 卷更容易备份或者迁移，当需要备份、还原数据或者将数据从一个 docker 主机迁移到另一个主机时，卷是更好的选择

**创建卷：**

```bash
docker volume create <VOLUME NAME>
```

**使用卷：**

还是以 mysql 数据为例，只需要把挂载的路径换成 volume 的名字即可

```bash
docker run --name some-mysql -v ~/desktop/mysql-config/mysql-config.cnf:/etc/mysql/conf.d/mysql.cnf \
-v <VOLUME NAME>:/var/lib/mysql \
-e MYSQL_ROOT_PASSWORD=123456 -d mysql:5.7.28
```

`-v`选项既可以定义 `Bind Mount`，又参与定义了 `Volume`。

为了避免与数据卷挂载中的命名产生冲突，使用`-v`定义`bind mount`时必须使用绝对路径。

> 使用`-v`选项挂载数据卷时，如果数据卷不存在，Docker 会自动创建并分配宿主机的内存目录，如果已经存在，则会直接引用。

**查看卷的信息：**

```bash
docker inspect <VOLUME NAME>
```

```bash
[
    {
        "CreatedAt": "2022-12-13T13:47:35Z",
        "Driver": "local",
        "Labels": null,
        "Mountpoint": "/var/lib/docker/volumes/19dac8cbff2da5d135463e636bc75dda1f0a221216182880d6382540056c535f/_data",
        "Name": "19dac8cbff2da5d135463e636bc75dda1f0a221216182880d6382540056c535f",
        "Options": null,
        "Scope": "local"
    }
]
```

或者通过`docker inspect <Container ID>`也能够查看到 `volume` 挂载的信息

```bash
       "Mounts": [
            {
                "Type": "volume",
                "Name": "92efce8c9f9b74eda3c855e098e7fd0f8f769fbb891697530d0a022064a58821",
                "Source": "/var/lib/docker/volumes/92efce8c9f9b74eda3c855e098e7fd0f8f769fbb891697530d0a022064a58821/_data",
                "Destination": "/var/lib/mysql",
                "Driver": "local",
                "Mode": "",
                "RW": true,
                "Propagation": ""
            }
        ],
```

`Source` 字段表示 Docker 为我们分配的用于挂载的宿主机的目录。

### tempfs 临时挂载

Tmpfs Mount 是一种特殊的挂载方式，它主要利用内存来存储数据。由于内存不是持久性的存储设备，所以 Tempfs Mount 的特点就是临时性挂载。

挂载临时目录用到`--tmpfs`这个选项。由于内存的具体位置不需要我们指定，所以这个选项里我们只需要挂载到容器内的目录即可。

```bash
docker run -d --name webapp --tmpfs <container-path> webapp:latest
```

## Build an Application

### docker build

官方网站给了一个示例，容器化了一个 Web 项目。

原地址是这个：

[Containerize an application](https://docs.docker.com/get-started/02_our_app/)

步骤：

1. clone repository

   ```bash
   git clone https://github.com/docker/getting-started.git
   ```

2. 在 app 目录创建 Dockerfile

   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY . .
   RUN yarn install --production
   CMD ["node", "src/index.js"]
   EXPOSE 3000
   ```

3. 在 app 目录下执行 `docker build`

   ```bash
   docker build -t getting-started .
   ```

`docker build`命令会用 Dockerfile 生成一个新的 image。

`-t`指令用来 tag 镜像的名字，这里就是给新生成的 image 取名。

`.`是用来告诉 Docker 它应该从当前的文件目录去寻找 Dockerfile。

Dockerfile 内的内容解释：

1. `FROM node:18-alpine` 基于`node:18-alpine`镜像，如果没有的话，会自动去下载
2. `WORKDIR` 告诉 Docker 去哪个目录，相当于 `cd dir`
3. `COPY`拷贝 WORKDIR 里的内容
4. `RUN`执行一个脚本命令，这里是的脚本命令是安装依赖
5. `CMD`指令用来指定命令。当从此生成的 image 生成并启动一个 container 时，会执行该命令
6. `EXPOSE`暴露一个端口

当 build image 成功后，就可以用它来生成新的 container

```bash
docker run -dp 3000:3000 getting-started
```

`-d`标记后台运行。`-p`用来指定宿主机和容器内的端口映射，通过这个映射可以访问到内部容器的端口。

最后在浏览器上打开`localhost:3000`就能够看到我们的 `app` 了。

![Empty Todo List](https://docs.docker.com/get-started/images/todo-list-empty.png)

此时打开 Docker，会看到 `getting-started` 的镜像启动了。

### update code

现在我们需要更新一下代码，在 `src/static/js/app.js`上更新以下代码：

```diff
- <p className="text-center">No items yet! Add one above!</p>
+ <p className="text-center">You have no todo items yet! Add one above!</p>
```

然后运行以下命令：

```bash
docker build -t getting-started .
docker run -dp 3000:3000 getting-started
```

会报一个错：

```bash
docker: Error response from daemon: driver failed programming external connectivity on endpoint epic_gould (3799c6f242a473e0057eaeb958ea129d03142acd9da927049e5eb041ce198218): Bind for 0.0.0.0:3000 failed: port is already allocated.
```

我们无法启动新容器，因为旧容器仍在运行。

旧容器正在使用主机的端口 3000，并且机器上只有一个进程(包括容器)可以侦听特定的端口。要解决这个问题，我们需要移除旧容器。

查看容器 ID

```
docker ps -a
```

拷贝需要删除的容器的 ID，并执行删除容器命令

```bash
docker rm <Container ID>
```

现在可以重新执行 `docker run` 了

```bash
docker run -dp 3000:3000 getting-started
```

### 上传 image 到 docker Hub

做好的 image 可以上传到 docker Hub。

上传的步骤：

1. 注册并登陆[docker Hub](https://hub.docker.com/)

2. 点击 Create Repository

3. 输入 Repository name

4. 在本地登陆 docker`docker login -u YOUR-USER-NAME`

5. 在本地给 image 重新命名，需要用到 `tag`取一个新的 `image name`

   `docker tag <local image name> <YOUR-USER-NAME>/<Repository Name>:<tag name>`

   例如 ：

   ```bash
   docker tag getting-started qiuyanxi/getting-started:0.0.2
   ```

6. 最后使用 `docker push`上传

   示例：

   ```bash
   docker push qiuyanxi/getting-started:0.0.2
   ```

### volume 存储数据

官方给的示例通过 SQlite 把数据存储到`/etc/todos/todo.db`中，如果我们重新 run 一个新的容器，原来保存的数据都会消失，所以最好的方式是我们通过 volume 将`/etc/todos`与 volume 绑定在一起，这样即使容器删除了数据还在。

**创建 volume**

```bash
docker volume create todo-db
```

再创建并运行一个新的容器命名为 `gs`并将数据与 volume 绑定

```bash
docker run --name gs -dp 3000:3000 -v todo-db:/etc/todos getting-started
```

打开`http://localhost:3000/`，为了测试效果，先在页面中增加一些数据

![image-20221201201233708](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202307110005068.png)

停止和删除容器

```bash
docker stop e971cd1d5837
docker rm e971cd1d5837
```

再新建并运行一个容器，记得挂载 volume

```bash
docker run --name gs2 -dp 3000:3000 -v todo-db:/etc/todos getting-started
```

再打开`localhost:3000`，依然是原来的数据，并没有随着容器的删除而被删除。

![image-20221201201233708](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202307110004750.png)

打开`docker inspect todo-db`能够查看到 volume 的信息

```bash
 docker inspect todo-db
[
    {
        "CreatedAt": "2022-12-01T12:07:00Z",
        "Driver": "local",
        "Labels": {},
        "Mountpoint": "/var/lib/docker/volumes/todo-db/_data",
        "Name": "todo-db",
        "Options": {},
        "Scope": "local"
    }
]
```

`mountpoint`是 docker 将 volume 里的数据存储到 disk 的挂载点。

### 用 bind mount 配置开发环境

通过 volume 做数据持久化，我们不需要关心数据存在哪里，这是 docker 帮我们做的。

如果想要指定挂载点并且持久化数据呢？答案是 bind mount。

通过 bind mount，我们可以在宿主机和容器之间绑定一个由我们指定的确切的挂载点，它经常被用来把额外的数据添加到容器中。

比如我们经常把我们的代码挂载到容器中，一旦它看到代码更改了，就会做出响应，我们也能够马上看到变化。

在上面的示例中，每次更新代码都需要重新 build image 并 run 一个新的容器，非常不方便。

这里就用到 bind mount 来构建一个开发环境。每次代码变更都能马上看到结果。

步骤：

1. 确保 3000 端口没有被占用

2. 基于 `node:18-alpine`镜像构建一个容器，并将代码 bind mount 到容器中

   ```bash
   // 先进入项目目录
   cd ~/desktop/getting-started/app
   docker run -dp 3000:3000 \
        -w /app -v "$(pwd):/app" \
        node:18-alpine \
        sh -c "yarn install && yarn run dev"
   ```

   - `-dp 3000:3000`——后台运行 node18 并将宿主机的 3000 端口映射到容器的 3000 端口

   - `-w /app`——设置一个工作目录或者说设置命令行从哪个目录运行

   - `-v "$(pwd):/app"`——将当前目录与容器中的`/app`目录绑定

   - `node:18-alpine` —— 基础镜像，运行 JavaScript 的环境镜像。

   - `sh -c "yarn install && yarn run dev"` ——使用`sh`执行`yarn install && yarn run dev`，因为 `node18` 没有 `bash`，所以将`sh`作为 shell 跑代码。

3. 执行`docker logs -f <Container ID>`查看 `shell` 执行情况

   ```bash
   docker logs -f <container-id>
    nodemon src/index.js
    [nodemon] 2.0.20
    [nodemon] to restart at any time, enter `rs`
    [nodemon] watching dir(s): *.*
    [nodemon] starting `node src/index.js`
    Using sqlite database at /etc/todos/todo.db
    Listening on port 3000
   ```

4. 在主机上修改代码

   ```diff
   // app.js
   - placeholder="New Item"
   + placeholder="add New Item"
   ```

5. 当完成代码的修改，要发布了，再重新 build 一下

   ```bash
   docker build -t getting-started .
   ```

### 与 MySQL 容器通信

上面的案例使用 `SQLite`做数据管理的，如果想要把数据存在`MySQL`中，应该把数据放在同一个容器里还是另起一个容器？官方给了这样的答案

> each container should do one thing and do it well

原因如下：

1. 很有可能我们必须以不同于 databases 的方式扩展 API 或者前端
2. 分离容器能够独立得进行版本变更

所以我们需要在同一台机器上再构建一个 MySql 容器，然后让应用容器和 Mysql 容器互通通话。

![Todo App connected to MySQL container](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202307110004663.png)

要让两个容器互相通话，需要记住这句话

> If two containers are on the same network, they can talk to each other. If they aren’t, they can’t.

也就是说，我们需要用到 network 来让两个容器互相通信。

**创建自定义网络**

```bash
docker network create todo-app
```

**创建 MySQL 容器并绑定到 network**

```bash
docker run -d \
     --network todo-app --network-alias mysql \
     -v todo-mysql-data:/var/lib/mysql \
     -e MYSQL_ROOT_PASSWORD=secret \
     -e MYSQL_DATABASE=todos \
     mysql:5.7.28
```

- `--network todo-app` 绑定到 todo-app 网络
- `--network-alias` 网络别名
- `-v todo-mysql-data:/var/lib/mysql` 绑定一个 volume 到数据库在容器内的存储空间`/var/lib/mysql`(如果没有这个 volume 则会自动创建)

**连接 MySQL**

现在 MySQL 容器已经启动了，每一个容器都有自己的 IP 地址，但是问题是，如何和另一个同网络下的容器互相连接。

为了弄清楚这一点，官方让我们使用 [nicolaka/netshoot](https://github.com/nicolaka/netshoot)的容器，这个容器附带了很多对解决或调试网络问题很有用的工具。

1. 下载并运行 `netshoot`镜像，并且将它和 MySQL 放在同一个网络下

   ```bash
   docker run -it --network todo-app nicolaka/netshoot
   ```

2. 查看 mysql 的容器 ip

   ```bash
   dig mysql
   ```

   会看到类似这样的内容

   ```bash
   ; <<>> DiG 9.18.8 <<>> mysql
   ;; global options: +cmd
   ;; Got answer:
   ;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 44500
   ;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 0

   ;; QUESTION SECTION:
   ;mysql.				IN	A

   ;; ANSWER SECTION:
   mysql.			600	IN	A	172.19.0.2

   ;; Query time: 5 msec
   ;; SERVER: 127.0.0.11#53(127.0.0.11) (UDP)
   ;; WHEN: Sun Dec 04 05:28:49 UTC 2022
   ;; MSG SIZE  rcvd: 44
   ```

   查看 `ANSWER SECTION`，可以看到 mysql 容器的 ip 地址是`172.19.0.2`。

   虽然这不是一个有效的 IP 地址，但是 docker 能够把它解析成具有网络别名的容器的 IP 地址。

   这就意味着我们能通过网络别名去访问到`database`。

3. 与项目连接

   ```bash
   cd getting-started/app
   docker run -dp 3000:3000 \
      -w /app -v "$(pwd):/app" \
      --network todo-app \
      -e MYSQL_HOST=mysql \
      -e MYSQL_USER=root \
      -e MYSQL_PASSWORD=secret \
      -e MYSQL_DB=todos \
      node:18-alpine \
      sh -c "yarn install && yarn run dev"
   ```

   上面的命令重新基于 image 构建了一个容器，不同之处在于：

   - `--network todo-app` 与 MySQL 放到同一个网络下

   - 添加 MySQL 的配置

     ```bash
        -e MYSQL_HOST=mysql \
        -e MYSQL_USER=root \
        -e MYSQL_PASSWORD=secret \
        -e MYSQL_DB=todos \
     ```

     - `-e MYSQL_HOST=mysql`设置 host 地址，这里填写的是设置过的`alias`
     - `-e MYSQL_USER=root` 设置 MySQL 账号
     - `-e MYSQL_PASSWORD=secret` 设置 MySQL 密码
     - `-e MYSQL_DB=todos` 设置用哪个 database

命令运行结束后，通过 logs 查看进度

```bash
docker logs -f <container ID>
```

当看到这样的信息时，就意味着成功了

```bash
success Already up-to-date.
Done in 0.82s.
yarn run v1.22.19
$ nodemon src/index.js
[nodemon] 2.0.20
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node src/index.js`
Waiting for mysql:3306.
Connected!
Connected to mysql db at host mysql
Listening on port 3000
```

打开 localhost 添加几条信息

![image-20221204140513387](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202307110004761.png)

再去数据库看一下是否有`todos`的`database`

![image-20221204140659319](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202307110004843.png)

这样就完成了数据库与项目的连接。

小结一下，我们为了加入 mysql 做的操作：

1. 自定义 network
2. network 绑定到 mysql 容器
3. 创建一个新的 app 容器，将 network、mysql 环境变量等一起绑定到 app 容器中

这些加在一起，感觉配置还是比较繁琐的。

还好 Docker 给出了一个简便的方式——Docker Compose。

### Docker compose

Docker compose 是一个用来帮助定义多个容器的工具。使用 Docker compose，我们能够创建一个 YAML 文件去定义一些服务。

最大的好处是在项目中用一个文件去定义各种脚本任务，当其他人开启我们的项目时，不需要执行那么多复杂的命令，而是跑 Dockerfile 里定义好的脚本任务，自动把容器组合起来，简化操作。

首先创建 docker-compose.yml，并定义服务列表，服务列表开头这么写：

```yaml
// docker-compose.yml
services:
```

服务列表的内容则是根据之前的命令书写。

**我们生成容器时书写的命令是这样的**

```bash
docker run -dp 3000:3000 \
  -w /app -v "$(pwd):/app" \
  --network todo-app \
  -e MYSQL_HOST=mysql \
  -e MYSQL_USER=root \
  -e MYSQL_PASSWORD=secret \
  -e MYSQL_DB=todos \
  node:18-alpine \
  sh -c "yarn install && yarn run dev"
```

下面是针对以上命令书写 docker-compose 脚本列表的步骤

1. 为容器定义一个 image。

   ```yaml
   services:
     app:
       image: node:18-alpine
   ```

   `app`——服务的名称，名称会自动变成网络别名。同一个 Dockerfile 内的容器都自动在同一个 network，只需要指定别名就行，相当于不需要`--network`仅需要`--network-alias`

   `image: node:18-alpine`—— 镜像名

2. 让容器执行命令,安装和开启项目

   ```yaml
   services:
     app:
       image: node:18-alpine
       command: sh -c "yarn install && yarn run dev"
   ```

3. 指定端口映射

   ```yaml
   services:
     app:
       image: node:18-alpine
       command: sh -c "yarn install && yarn run dev"
       ports:
         - 3000:3000
   ```

4. 指定工作目录并绑定到 volume 上

   ```yaml
   services:
     app:
       image: node:18-alpine
       command: sh -c "yarn install && yarn run dev"
       ports:
         - 3000:3000
       working_dir: /app
       volumes:
         - ./:/app
   ```

   `./:/app`是将 docker-compose 所在的文件夹中的所有内容与容器中的`/app`目录做 volume 绑定。

   > 用 docker-compose 的好处是可以使用相对路径。

5. 指定 MySQL 的环境变量

6. ```yaml
   services:
     app:
       image: node:18-alpine
       command: sh -c "yarn install && yarn run dev"
       ports:
         - 3000:3000
       working_dir: /app
       volumes:
         - ./:/app
       environment:
         MYSQL_HOST: mysql
         MYSQL_USER: root
         MYSQL_PASSWORD: secret
         MYSQL_DB: todos
   ```

容器脚本命令已经书写完毕了，我们还得继续写关于 MySQL 的 Dockerfile。

对 MySQL 创建容器并设置账户密码的命令是这样的：

```bash
docker run -d \
     --network todo-app --network-alias mysql \
     -v todo-mysql-data:/var/lib/mysql \
     -e MYSQL_ROOT_PASSWORD=secret \
     -e MYSQL_DATABASE=todos \
     mysql:5.7.28
```

整体思路基本差不多。

1. 指定服务名（同时也是网络别名），并明确 image

   ```yaml
   services:
     app:
     # The app service definition
     mysql:
       image: mysql:5.7.28
   ```

2. 定义 volume 映射

   ```yaml
   services:
     app:
     # The app service definition
     mysql:
       image: mysql:5.7.28
       volumes:
         - todo-mysql-data:/var/lib/mysql

   volumes:
     todo-mysql-data:
   ```

   当我们执行 `docker run`时，被命名的 volume 会自动创建。然而，Dockercompose 里如果单写`todo-mysql-data:/var/lib/mysql`是不会自动创建 volume 的。我们还需要在顶级的`volumes`字段中写 volume 名才会生效。

   如果只提供 volume 名，则使用默认选项。还有[many more options available](https://docs.docker.com/compose/compose-file/compose-file-v3/#volume-configuration-reference) 可以查阅。

3. 最后就是定义 mysql 的环境变量

   ```yaml
   services:
     app:
     # The app service definition
     mysql:
       image: mysql:5.7.28
       volumes:
         - todo-mysql-data:/var/lib/mysql
       environment:
         MYSQL_ROOT_PASSWORD: secret
         MYSQL_DATABASE: todos

   volumes:
     todo-mysql-data:
   ```

全部的 `docker-compose.yml`内容是这样的：

```yaml
services:
  app:
    image: node:18-alpine
    command: sh -c "yarn install && yarn run dev"
    ports:
      - 3000:3000
    working_dir: /app
    volumes:
      - ./:/app
    environment:
      MYSQL_HOST: mysql
      MYSQL_USER: root
      MYSQL_PASSWORD: secret
      MYSQL_DB: todos

  mysql:
    image: mysql:5.7.28
    volumes:
      - todo-mysql-data:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: todos

volumes:
  todo-mysql-data:
```

### 创建 compose 容器

使用`docker compose up`命令来启动 `docker-compose.yml`里写好的任务栈。

```bash
docker compose up -d
```

`-d`参数是让所有东西都在后台运行。

> 如果不加`-d`,则会在当前 shell 运行并打印出日志。当我们退出 shell 时，会把 compose 容器都停掉。

接着控制台会输出以下内容：

```bash
[+] Running 4/4
Network app_default           Created
Volume "app_todo-mysql-data"  Created
Container app-mysql-1         Started
Container app-app-1           Started
```

可以注意到，我们并没有在 yaml 文件中定义 network，`docker-compose`会自动创建一个 `network` —— `app_default`。

执行`docker compose logs -f`命令，能够将内部执行的 service 日志打印出来。

![image-20221204195601410](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202307110004728.png)

查看不同的 service 可以在后面加上服务名，比如`docker compose logs -f mysql`。

当所有日志都正常时，打开 docker-dashboard 能看到 compose 已经启动好了

![Docker Dashboard with app project expanded](https://raw.githubusercontent.com/18888628835/image-cloud/main/assets202307110004510.png)

### 删除 compose 容器

执行以下命令则会删除 compose 容器

```bash
docker compose down
```

所有容器（包括网络）会停止并被删除。

## 构建 Image 最佳实践

### Sercurity scanning

当已经 build 了一个 Image，我们可以用`docker scan`命令去进行安全性扫描。

> 在执行扫描前必须先登录，执行`docker scan --login`

对某个 image 扫描

```bash
docker scan <image-name>
```

当扫描完成后，如果有问题则会输出有问题的地方，并且附上相关的参考资料的链接

### Layer caching

让我们再看一次 Dockerfile 里面的内容：

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN yarn install --production
CMD ["node", "src/index.js"]
```

我们先拷贝了项目里的所有文件，然后再执行 `yarn install`去构建依赖。

每次 build 新的 image 都会重新执行 `yarn install`去生成 `node_modules`里的文件。

这就意味着项目里的 `node_modules`和`yarn install`后的依赖文件是相同的。

那我们仅仅先将 `package.json`和`lock`文件拷贝到容器中，让它先自行 `install`所有依赖，然后把本地项目中非`node_modules`的文件都拷贝进容器当中，这样就能节省下大量的 `build image`的时间了。

1. 首先，重构 Dockerfile，先拷贝 package.json，再执行`yarn install`,最后拷贝其余的文件

   ```dockerfile
   FROM node:18-alpine
    WORKDIR /app
    COPY package.json yarn.lock ./
    RUN yarn install --production
    COPY . .
    CMD ["node", "src/index.js"]
   ```

2. 在`Dockerfile`同一文件夹下创建`.dockerignore`文件,文件内容如下：

   ```dockerfile
   node_modules
   ```

   在 `.dockerignore`文件内的东西会被忽略，不会被 build。

3. build 一个新的 Image

   ```bash
   docker build -t getting-started .
   ```

   我们应该能看到类似的输出：

   ```bash
   [+] Building 16.1s (10/10) FINISHED
    => [internal] load build definition from Dockerfile
    => => transferring dockerfile: 175B
    => [internal] load .dockerignore
    => => transferring context: 2B
    => [internal] load metadata for docker.io/library/node:18-alpine
    => [internal] load build context
    => => transferring context: 53.37MB
    => [1/5] FROM docker.io/library/node:18-alpine
    => CACHED [2/5] WORKDIR /app
    => [3/5] COPY package.json yarn.lock ./
    => [4/5] RUN yarn install --production
    => [5/5] COPY . .
    => exporting to image
    => => exporting layers
    => => writing image     sha256:d6f819013566c54c50124ed94d5e66c452325327217f4f04399b45f94e37d25
    => => naming to docker.io/library/getting-started
   ```

4. 随便修改项目文件里面的代码,再重新执行`docker build -t getting-started .`。会看到以下输出：

   ```bash
   [+] Building 1.2s (10/10) FINISHED
    => [internal] load build definition from Dockerfile
    => => transferring dockerfile: 37B
    => [internal] load .dockerignore
    => => transferring context: 2B
    => [internal] load metadata for docker.io/library/node:18-alpine
    => [internal] load build context
    => => transferring context: 450.43kB
    => [1/5] FROM docker.io/library/node:18-alpine
    => CACHED [2/5] WORKDIR /app
    => CACHED [3/5] COPY package.json yarn.lock ./
    => CACHED [4/5] RUN yarn install --production
    => [5/5] COPY . .
    => exporting to image
    => => exporting layers
    => => writing image     sha256:91790c87bcb096a83c2bd4eb512bc8b134c757cda0bdee4038187f98148e2eda
    => => naming to docker.io/library/getting-started
   ```

   我们能看到一些步骤里 Docker 用了上一个缓存过的的 layers。这也是第二次 build 的速度非常快的原因。

### React example

当构建 React 项目时，我们需要 Node 环境去编译 JS 代码、sass 样式表还有一些静态 HTML、JS、和 CSS 等代码。如果我们不需要做服务端渲染，我们甚至不需要 node 环境去构建我们的生产版本。

为什么不在 Nginx 容器中运行静态的资源？

```dockerfile
FROM node:18 AS build
WORKDIR /app
COPY package* yarn.lock ./
RUN yarn install
COPY public ./public
COPY src ./src
RUN yarn run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
```

这里，我们用 Node:18 image 去 build（充分利用 layer caching），然后把输出拷贝到 nginx 容器中。
