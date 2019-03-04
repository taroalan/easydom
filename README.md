# vdom

A simple virtual DOM implementation, include create vnode, diff and patch.

English | [中文文档](./README_zh_cn.md)

## Preview

Preview Online: [http://wangchi.github.io/vdom](_http://wangchi.github.io/vdom_)

Preview Local: clone the repository then run the following commands

```bash
npm i
npm run dev
```

Then visit `http://localhost:9001/` in your browser.

## Introduction

Including the following five parts:

+ `createVNode` create a virtual dom tree
+ `createElement` parse virtual dom to HTML elements
+ `render` append HTML elements to page
+ `diff` diff the differents between old vnode tree and new vnode tree
+ `patch` update the patches to HTML elements

About diff types:

+ `TEXT` replace text content
+ `PROPS` update attributes
+ `REORDER` record the order of child nodes, then replace or move
+ `REPLACE` replace elements


Examples:
```js
// use @babel/plugin-transform-react-jsx to parse jsx
// we should implement the createVNode function，the function will in your define
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

// compile vnode to HTML elements
let rootNode = createElement(vtree);

// append the elements to page
render(rootNode, document.getElementById('app'));
```

Create a new vtree, then update the patches to HTML elements.

```js
// create a new vtree use jsx
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

// diff
let patches = diff(vtree, newVtree);

console.log('patches: ', patches);

// update the patches to HTML elements
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
