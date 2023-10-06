# WHU-2020HYAP02 珞珈生活

## 贡献指南

### 项目结构

项目分为前端/接口层/其他后端。前端位于client/，数据接口位于apigateway/，其他后端有待扩充。
前后端采用GraphQL进行交互，目前项目已初步实现前后端基本通信，见前端项目的`/demo`页面。
GraphQL技术较RESTful省去较多前后端磨合接口的工作，本项目采用的neo4j-graphql同时省去了后端与数据库的对接。相关参考资料如下：

- 

其中，前端通过ApolloClient连接至graphql endpoint（即`localhost:4000`开发服务器地址），执行所需graphql查询后拿到json格式的数据。

查询的编写需参考接口层定义的schema，及neo4j-graphql的schema自动生成文档。亦可借助后端开发服务器所提供的Apollo Stuidio可视化编辑工具。

### 开发运行

前置条件：前后端采用js编写，需具有pnpm包管理器

注：

- 仅保证Linux上的正常运行
- 推荐采用GitHub codespace，其具有预装的pnpm，且云服务器连接npm源较快。结合vscode使用体验更佳（端口映射等）。但对科学上网可能有一定需求）

1. 克隆本项目
2. 进入client或apigateway目录
3. 运行pnpm install，应当会安装所需运行时及开发时（devDependency）
4. 运行pnpm start或pnpm dev启动开发服务器，相应端口vscode应会自动映射（或手动映射，端口号见终端输出）。其他命令见package.json及子项目目录
