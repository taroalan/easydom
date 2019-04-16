(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}(function () { 'use strict';

  let utils = {};

  utils.isType = (type, target) => {
    return Object.prototype.toString.call(target) === `[object ${type}]`;
  };

  ['String', 'Boolean', 'Number', 'Array', 'Function', 'Object', 'Date', 'RegExp', 'Error', 'Null'].forEach(type => {
    utils[`is${type}`] = target => utils.isType(type, target);
  }); // props 中关于 html 属性的处理
  // 暂时只处理一部分，仅供演示
  // 注意 className、内联样式 style

  utils.setAttrs = (el, props) => {
    for (let key in props) {
      if (['id', 'href', 'value'].indexOf(key) !== -1) {
        el.setAttribute(key, props[key]);
      }

      if (key === 'className') {
        el.setAttribute('class', props['className']);
      }

      if (key === 'style') {
        for (let p in props.style) {
          el.style[p] = props.style[p];
        }
      }
    }
  };

  // 参考 React 实现一个精简版的 createVNode 方法

  function createVNode(type, props, ...children) {
    // 嵌套 children 的特殊处理，二维变一维
    // jsx 被 babel-plugin-transform-react-jsx 编译后的一种情况
    if (children.length === 1 && utils.isArray(children[0])) {
      children = !children[0].length ? [] : children[0];
    }

    let vnode = {
      key: props && props.key || null,
      type: type,
      props: props ? props : {},
      children
    };
    return vnode;
  }

  function createElement(vnode) {
    if (utils.isNull(vnode)) {
      return document.createTextNode('');
    }

    let {
      type,
      props,
      children
    } = vnode; // type 类型判断，按照 React 的套路，可能是html标签(String)、函数(Function)、React组件(Component)，
    // 这里暂时只处理html标签及文本的情况
    // jsx 解析后文本为字符串(不再有子节点) children: ['text']
    // html标签会解析为对象(需要再去查看子节点) { type: 'div', props: { id: 'container' }, children: [...]}

    if (utils.isString(vnode)) {
      return document.createTextNode(vnode);
    }

    let el = document.createElement(type);
    utils.setAttrs(el, props);

    if (!children) {
      return el;
    } // 常规写法:
    // children.forEach(child => {
    //   el.appendChild(createElement(child));
    // });
    // 精简写法:


    let appendChild = el.appendChild.bind(el);
    children.map(createElement).map(appendChild);
    return el;
  }

  function render(vdom, el) {
    el.appendChild(vdom);
  }

  // patchType 定义
  // 插入节点
  const INSERT = 'INSERT'; // 删除节点

  const REMOVE = 'REMOVE'; // 替换节点

  const REPLACE = 'REPLACE'; // 重新排列节点

  const ORDER = 'ORDER'; // 属性修改

  const PROPS = 'PROPS'; // 文本修改

  const TEXT = 'TEXT';

  function diff(tree, newTree) {
    // console.log('diff');
    let index = 0;
    let patches = {};
    return diffNode(tree, newTree, index, patches);
  }

  function diffNode(oldNode, newNode, index, patches) {
    // let patches = {};
    let currentPatch = []; // console.log(`DIFF STEPS: ${index}: `, oldNode, newNode);

    if (!newNode) ; else if (utils.isString(oldNode) && utils.isString(newNode)) {
      if (oldNode !== newNode) {
        currentPatch.push({
          type: TEXT,
          content: newNode
        });
      }
    } else if (oldNode && newNode && oldNode.type === newNode.type && oldNode.key === newNode.key) {
      let propsPatches = diffProps(oldNode.props, newNode.props);

      if (Object.keys(propsPatches).length) {
        currentPatch.push({
          type: PROPS,
          props: propsPatches
        });
      } // 对比子节点
      // todo


      diffChildren(oldNode.children, newNode.children, index, patches, currentPatch);
    } else {
      currentPatch.push({
        type: REPLACE,
        node: newNode
      });
    } // console.log(`GOTO patchs[index] -- ${index}`);


    if (currentPatch.length) {
      // console.log(patches);
      patches[index] = currentPatch;
    }

    return patches;
  }

  function diffChildren(oldChildren, newChildren, index, patches, currentPatch) {
    console.log('oldChildren, newChildren: ', oldChildren, newChildren);
    let diffs = diffList(oldChildren, newChildren);
    console.log(diffs);

    if (diffs.moves.length) {
      currentPatch.push({
        type: ORDER,
        moves: diffs.moves
      });
    }

    newChildren = diffs.nodes;

    for (var i = 0; i < oldChildren.length || i < newChildren.length; i++) {
      let oldNode = oldChildren[i];
      let newNode = newChildren[i]; // console.log(`i -- index -- count : ${i}-${index}-${count}`);
      // count++;

      index++;
      diffNode(oldNode, newNode, i + index, patches);
    }
  }

  function diffList(oldList, newList) {
    let moves = [];
    let nodes = []; // 遍历旧节点
    // 观察新节点在同一个位置有什么变化

    oldList.forEach((item, i) => {
      let newItem = newList[i] || null;
      nodes.push(newItem);
    });
    console.log(nodes); // 去除 null
    // 如果新节点比旧节点数量减少了，就会出现null的情况
    // 对于旧节点而言就是节点被 REMOVE 了

    nodes.forEach((node, i) => {
      if (node === null) {
        moves.push({
          index: i,
          type: REMOVE
        }); // nodes.splice(i, 1);
      }
    });
    nodes.forEach((node, i) => {
      if (node === null) {
        nodes.splice(i, 1);
      }
    });

    if (nodes.length === 1 && nodes[0] === null) {
      nodes = [];
    }

    newList.forEach((item, i) => {
      item = utils.isArray(item) ? item[0] : item;
      let nodeItem = nodes[i];

      if (nodeItem) ; else {
        moves.push({
          type: ORDER,
          item,
          index: i
        });
      }
    }); // console.log('diffList nodes', nodes);
    // console.log('diffList moves', moves);

    return {
      moves,
      nodes
    };
  }

  function diffProps(props, newProps) {
    let propsPatches = {};

    for (const key in props) {
      if (newProps.hasOwnProperty(key) && newProps[key] !== props[key]) {
        propsPatches[key] = newProps[key];
      }
    }

    for (const key in newProps) {
      if (!props.hasOwnProperty(key)) {
        propsPatches[key] = newProps[key];
      }
    }

    return propsPatches;
  }

  /**
   * patch 根据 diff 的结果对差异进行更新
   * @param {*} root HTML rootNode generated by vnode
   * @param {*} patches
   */

  function patch(root, patches) {
    let index = 0;
    patchNode(root, patches, index);
  }

  function patchNode(node, patches, index) {
    let currentPatch = patches[index] || [];
    currentPatch.forEach((patch, i) => {
      switch (patch.type) {
        case INSERT:
          // console.log(node, patch, 'insert');
          // console.log(patch.node);
          break;

        case REMOVE:
          console.log(node, patch, 'remove');
          node.parentNode.removeChild(node);
          break;

        case REPLACE:
          // console.log(node, patch.node, 'replace');
          const newNode = createElement(patch.node);
          node.parentNode.replaceChild(newNode, node);
          break;

        case ORDER:
          // console.log(node, patch, 'reorder');
          reorderChildren(node, patch.moves);
          break;

        case PROPS:
          // console.log(node, patch.props, 'props');
          utils.setAttrs(node, patch.props);
          break;

        case TEXT:
          // console.log(node, patch, 'text');
          // console.log(node.parentNode);
          node.parentNode.textContent = patch.content; // utils.setAttrs(node, patch.props);

          break;
      }
    });
    node.childNodes.forEach((node, i) => {
      index++; // console.log(node);

      patchNode(node, patches, i + index);
    });
  }

  function reorderChildren(node, moves) {
    // console.log(node.childNodes);
    const nodeList = [].slice.call(node.childNodes); // console.log(nodeList);

    moves.forEach(move => {
      let index = move.index; // console.log(move.index);
      // console.log(move);

      if (move.type === REMOVE) {
        // console.log(index, nodeList[index], node.childNodes[index]);
        // console.log(nodeList[index]);
        node.removeChild(nodeList[index]); // if (nodeList[index] === node.childNodes[index]) {
        //   // console.log(move.index);
        //   // console.log(node, nodeList[index], node.childNodes[index]);
        //   // if (node.childNodes[index]) {
        //   // console.log(node.childNodes[index]);
        //   // node.removeChild(node.childNodes[index]);
        //   // }
        // }
        // nodeList.splice(index, 1);
        // console.log(index, nodeList);
      } else if (move.type === ORDER) {
        let insertNode = utils.isObject(move.item) ? createElement(move.item) : document.createTextNode(move.item); // console.log('insertNode: ');
        // console.log(insertNode);
        // console.log(node.childNodes[move.index]);

        nodeList.splice(index, 0, insertNode);
        node.insertBefore(insertNode, node.childNodes[index] || null);
      }
    });
  }

  // let vtree = createVNode('div', { id: 'box' },
  //   createVNode('p', { className: 'message', style: { color: '#36f' } }, 'hello walker'),
  //   createVNode('ul', { className: 'lists' },
  //     createVNode('li', null, 'Item 1'),
  //     createVNode('li', null, 'Item 2'),
  //     createVNode('li', null, 'Item 3')
  //   )
  // );
  // 这里使用 @babel/plugin-transform-react-jsx 解析
  // 只需实现 createVNode 即可，名称可以自定义

  let vtree = createVNode("div", {
    id: "box"
  }, createVNode("p", {
    className: "message",
    style: {
      color: '#36f'
    }
  }, "hello walker"), createVNode("ul", {
    className: "lists"
  }, createVNode("li", null, "Item 1"), createVNode("li", null, "Item 2"), createVNode("li", null, "Item 3"))); // vtree = null;

  console.log('vtree: ', vtree);
  let rootNode = createElement(vtree);
  console.log('rootNode: ', rootNode);
  render(rootNode, document.getElementById('app')); // let newVtree = createVNode('div', { className: 'new-box', id: 'box' },
  //   createVNode('h1', { id: 'title' }, 'This is title'),
  //   createVNode('p', { style: { color: '#f80' } }, 'hello walker, nice to meet you'),
  //   createVNode('ul', { className: 'lists new-lists' },
  //     createVNode('li', null, 'Item 1'),
  //     createVNode('li', null, 'Item 4'),
  //   )
  // );
  // let newVtree = (
  //   <div id="box" className="new-box">
  //     <p style={{color: '#f80'}}>hello walker, nick to meet you</p>
  //   </div>
  // );

  /*
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

  let patches = diff(vtree, newVtree);

  console.log('patches: ', patches);

  patch(rootNode, patches);
  */
  // test jsx
  // let vdom1 = (
  //   <div class="box">
  //     <p>1</p>
  //     <span>666</span>
  //     <ul>
  //       <li>item1</li>
  //       <li>item1</li>
  //       <li>item1</li>
  //     </ul>
  //   </div>
  // );
  // console.log(vdom1);

  let count = 0;

  function createVtree() {
    let items = [];

    for (let i = 0; i < count; i++) {
      // items.push(createVNode('li', null, `Item ${i}`));
      items.push(createVNode("li", null, 'Item ' + i));
    }

    let color = count % 2 === 0 ? '#36f' : '#f80';
    return createVNode("div", {
      id: "box",
      className: "new-box"
    }, createVNode("h1", {
      id: "title"
    }, "This is title"), "some text", createVNode("p", {
      style: {
        color: color
      }
    }, "hello walker, nick to meet you"), createVNode("ul", {
      className: "lists new-lists"
    }, items)); // return createVNode('div', { className: 'new-box', id: 'box' },
    //   createVNode('h1', { id: 'title' }, 'This is title'),
    //   createVNode('p', { style: { color: color } }, `hello walker, nice to meet you ${count}`),
    //   createVNode('ul', { className: 'lists new-lists' }, ...items)
    // );
  }

  function renderTest() {
    let newVtree = createVtree();
    let patches = diff(vtree, newVtree); // console.log(vtree, newVtree);

    console.log('patches: ', patches);
    patch(rootNode, patches);
    vtree = newVtree;
  }

  document.getElementById('btn-start').onclick = function () {
    count = 0;
    renderTest();
  };

  document.getElementById('btn-add').onclick = function () {
    count++;
    renderTest();
  };

  document.getElementById('btn-remove').onclick = function () {
    count--;
    if (count < 0) count = 0;
    renderTest();
  };

}));
//# sourceMappingURL=bundle.js.map
