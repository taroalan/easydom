# vdom

简单的虚拟 DOM 实现

## Preview

在线预览：[http://wangchi.github.io/vdom](http://wangchi.github.io/vdom)

克隆到本地预览：

```bash
npm i
npm run dev
```

Then visit `http://localhost:9001/` in your browser

## 原理

分为四个部分：
+ `createVNode` 创建 VNode
+ `createElement` 把 VNode 转化为 HTML 元素
+ `render` 把转化成 HTML 元素的 VNode append 到页面上
+ `diff` 对比新旧 VNode 的差异
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

let rootNode = createElement(vtree);

render(rootNode, document.getElementById('app'));
```

vdom 对比及局部更新

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
