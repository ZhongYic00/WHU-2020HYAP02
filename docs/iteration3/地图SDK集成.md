## 两个控件
- 地点选择，用于填写Point类型的数据
    - 初始时定位到当前所在位置，支持缩放、移动
    - 中心显示十字叉或者定位气泡icon
    - 底部有确认按钮，点击后调用一个外部传入的setPos函数填写中心位置
- 地理维度的查看，用于浏览附件的相关事件、对象等
    - 具体查询略，输入（当前或选择的）位置、查看范围，输出`[{pos:Point, typename:string, label:string, _id:ID}]`
    - 地图上渲染所得对象，位置为pos文本为label，颜色根据typename选择
        - 点击对象后显示InfoWindow（可选）
        - 再点击会跳转至相应的对象浏览页面（根据id和typename）
    - 缩放改变查询的范围，移动拖拽改变查询的中心位置，范围有一个最小半径和一个最大半径
## 参考文档
- 高德的文档写的不错 [点聚合-海量点-进阶教程-地图 JS API 2.0 | 高德地图API](https://lbs.amap.com/api/javascript-api-v2/guide/amap-massmarker/marker-cluster)
- 用[pansy封装过的react-amap](https://react-amap-pansyjs.vercel.app/components/about/about)好了
	- 主要缺高德的一些api，包括定位和搜索