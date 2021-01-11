# easydom

[![Build Status][travis-image]][travis-url]
[![Coverage Status](https://coveralls.io/repos/github/wangchi/easydom/badge.svg?branch=master)](https://coveralls.io/github/wangchi/easydom?branch=master)
[![npm version][npm-version-image]](npm-url)
[![npm downloads][npm-download-image]][npm-url]

[npm-version-image]: https://img.shields.io/npm/v/easydom.svg?style=flat-square
[npm-download-image]: https://img.shields.io/npm/dm/easydom.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/easydom
[travis-image]: https://travis-ci.org/wangchi/easydom.svg?branch=master
[travis-url]: https://travis-ci.org/wangchi/easydom

简单的虚拟 DOM 实现，包含 `createElement`, `createDOM`, `diff`, `patch` 等方法。

在线预览: [https://wangchi.github.io/easydom/](https://wangchi.github.io/easydom/)

[English](./README.md) | 中文文档

## 介绍

Easydom 的实现主要包含下面几个方法：

- `createElement` 用于创建 Virtual DOM，用 JavaScript 对象来表示 DOM 结构
- `createDOM` 把 Virtual DOM 转化为 HTML 元素
- `render` 把转化后的 HTML 元素渲染到页面上
- `diff` 对比新旧 Virtual DOM 的差异，并作为结果返回
- `patch` 把差异更新到页面中

关于 diff 这一块分为以下几种类型：

- `INSERT` 插入元素
- `REMOVE` 移除元素
- `REPLACE` 替换元素
- `ORDER` 重新排列元素
- `PROPS` 属性变化
- `TEXT` 文本变化

## 使用

安装 `easydom` 作为依赖

```shell
npm i easydom --save
```

示例代码:

```js
import easydom from 'easydom';

// 使用 @babel/plugin-transform-react-jsx 解析 jsx
// 它会自动调用 easydom 的 createElement 方法来生成虚拟 DOM 树
let vtree = (
  <div id="box">
    <p className="message" style={{ color: '#36f' }}>
      hello walker
    </p>
    <ul className="lists">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
  </div>
);

// 把虚拟 DOM 转化为 HTML 元素
let rootNode = easydom.createDOM(vtree);

// 把 HTML 元素渲染到页面中
easydom.render(rootNode, document.getElementById('app'));
```

Create a new vtree, then update the patches to HTML elements.

```js
let newVtree = (
  <div id="box" className="new-box">
    <h1 id="title">This is title</h1>
    <p style={{ color: '#f80' }}>hello walker, nick to meet you</p>
    <ul className="lists new-lists">
      <li>Item 1</li>
      <li>Item 4</li>
    </ul>
  </div>
);

// 对比差异
let patches = easydom.diff(vtree, newVtree);

console.log('patches: ', patches);

// 把差异更新到页面中
easydom.patch(rootNode, patches);
```

## License

[MIT License](./LICENSE)
