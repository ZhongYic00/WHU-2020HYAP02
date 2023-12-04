# 概述

前端项目采用react框架下的antd pro，其以umi v4作为脚手架，集成了antd-pro-components等控件库。

其中umi负责路由（包括页面和控件的创建等）等，具体用的时候看文档。页面路由的配置在`src/config/routes.ts`里，比如最后的demo页。

ApolloClient是按照其文档配置的，由于umi管理了`<App/>`的创建，所以得按它的方式配置`rootContainer`。依赖注入之后，任意部件里就都可以通过`const {loading,error,data}=useQuery('xxx')`来获取数据了。

umi设定了一套完整的项目文件布局规范来自动生成很多东西，所以新增页面和component得按它的规范创文件。

目前前端模板项目已经有登录页面了，但数据和逻辑啥的懂没接上，所以需要参考别人的写法来接我们自己的后端。

## 参考资料

- umi
	- [运行时配置](https://umijs.org/docs/api/runtime-config#rootcontainerlastrootcontainer-args)
	- [目录结构](https://umijs.org/docs/guides/directory-structure)
	- [路由](https://umijs.org/docs/guides/routes)
	- [Umi 4 设计思路 - 云谦 - 支付宝体验科技的文章 - 知乎](https://zhuanlan.zhihu.com/p/543526399)
- antd-pro
	- [新增页面](https://pro.ant.design/zh-CN/docs/new-page)
	- [Pro Components](https://procomponents.ant.design/components)
	- [Ant Design - 一套企业级 UI 设计语言和 React 组件库](https://ant-design.antgroup.com/index-cn)

# Ant Design Pro

**注意，下面的npm都换成pnpm**

This project is initialized with [Ant Design Pro](https://pro.ant.design). Follow is the quick guide for how to use.

## Environment Prepare

```bash
pnpm install
```

## Provided Scripts

Ant Design Pro provides some useful script to help you quick start and build with web project, code style check and test.

Scripts provided in `package.json`. It's safe to modify or add additional script:

### Start project

```bash
npm start
```

### Build project

```bash
npm run build
```

### Check code style

```bash
npm run lint
```

You can also use script to auto fix some lint error:

```bash
npm run lint:fix
```

### Test code

```bash
npm test
```

## More

You can view full document on our [official website](https://pro.ant.design). And welcome any feedback in our [github](https://github.com/ant-design/ant-design-pro).
