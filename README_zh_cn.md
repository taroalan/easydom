# vdom

简单的虚拟 DOM 实现

[English](./README.md) | 中文文档

## 预览

在线预览：[http://wangchi.github.io/vdom](http://wangchi.github.io/vdom)

克隆到本地预览：

```bash
npm i
npm run dev
```

然后访问 `http://localhost:9001/` 即可。

## 原理

实现部分主要分为以下五个函数：

+ `createVNode` 用于创建 Virtual DOM，用 JavaScript 对象来表示 DOM 结构
+ `createElement` 把 Virtual DOM 转化为 HTML 元素
+ `render` 把转化后的 HTML 元素渲染到页面上
+ `diff` 对比新旧 Virtual DOM 的差异，并作为结果返回
+ `patch` 把差异更新到真实 DOM 上

关于 diff 这一块分为以下几种类型：

+ `TEXT` 文本替换
+ `PROPS` 属性变更
+ `REORDER` 元素位置的变更，用于处理子元素，然后进行递归处理
+ `REPLACE` 整体替换（包含元素新增及删除）

代码示例：
```js
// 这里使用 @babel/plugin-transform-react-jsx 解析
// 只需实现 createVNode 即可，名称可以自定义
let vtree = (
  <div id="box">
    <p className="message" style={{color: '#36f'}}>hello walker</p>
    <ul className="lists">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
  </div>
);

// 把虚拟 DOM 转化为 HTML 元素
let rootNode = createElement(vtree);

// 把转化后的 HTML 元素渲染到页面上
render(rootNode, document.getElementById('app'));
```

vdom 对比及局部更新：

```js
// 创建一个新的 vdom 树
let newVtree = (
  <div id="box" className="new-box">
    <h1 id="title">This is title</h1>
    <p style={{color: '#f80'}}>hello walker, nick to meet you</p>
    <ul className="lists new-lists">
      <li>Item 1</li>
      <li>Item 4</li>
    </ul>
  </div>
);

// 对比差异
let patches = diff(vtree, newVtree);

console.log('patches: ', patches);

// 把差异更新到真实 DOM 上
patch(rootNode, patches);
```

## Todos

- [x] project scaffold
- [x] create visual node
- [x] create element
- [x] render
- [x] diff
- [x] patch
- [x] interactional examples
- [ ] diff and patch by key

## License

[MIT License](./LICENSE)
