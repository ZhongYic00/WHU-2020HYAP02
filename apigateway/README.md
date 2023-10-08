# 运行

`pnpm start`启动本地服务器，但不会自动监测源码变化。
`pnpm dev`即可启动开发服务器，通常会自动监测源码变化并自动重编译。

# 结构

目前只有[index.ts](src/index.ts)一个源码文件，其运行时会生成标准GraphQL语法的[schema](src/schema.graphql)文件。

