# easydom

[![Build Status][travis-image]][travis-url]
[![Coverage Status](https://coveralls.io/repos/github/bluesdari/easydom/badge.svg?branch=master)](https://coveralls.io/github/bluesdari/easydom?branch=master)
[![npm version][npm-version-image]](npm-url)
[![npm downloads][npm-download-image]][npm-url]

[npm-version-image]: https://img.shields.io/npm/v/easydom.svg?style=flat-square
[npm-download-image]: https://img.shields.io/npm/dm/easydom.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/easydom
[travis-image]: https://travis-ci.org/bluesdari/easydom.svg?branch=master
[travis-url]: https://travis-ci.org/bluesdari/easydom

A simple virtual DOM implementation, include create vnode, diff and patch.

Preview Online: [https://bluesdari.github.io/easydom/](https://bluesdari.github.io/easydom/)

English | [中文文档](./README_zh_cn.md)

## Introduction

Easydom include the following methods:

- `createElement` create a virtual dom tree
- `createDOM` parse virtual dom to HTML elements
- `render` append HTML elements to page or target element
- `diff` diff the differents between old VNode tree and new VNode tree, and return differents as patches
- `patch` update the patches to HTML elements

About diff types:

- `INSERT` insert elements
- `REMOVE` remove elements
- `REPLACE` replace elements
- `ORDER` record the order of child nodes, then replace or move
- `PROPS` update attributes
- `TEXT` replace text content

## Usage

Install easydom

```shell
npm i easydom --save
```

Examples:

```js
import easydom from 'easydom';

// use @babel/plugin-transform-react-jsx to parse jsx
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

// compile vnode to HTML elements
let rootNode = easydom.createDOM(vtree);

// append the elements to page
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

// diff
let patches = easydom.diff(vtree, newVtree);

console.log('patches: ', patches);

// update the patches to HTML elements
easydom.patch(rootNode, patches);
```

## License

[MIT License](./LICENSE)
