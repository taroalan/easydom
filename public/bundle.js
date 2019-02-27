(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}(function () { 'use strict';

  let utils = {};

  utils.isType = (type, target) => {
    return Object.prototype.toString.call(target) === `[object ${type}]`;
  };

  ['String', 'Boolean', 'Number', 'Array', 'Function', 'Object', 'Date', 'RegExp', 'Error'].forEach(type => {
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
    let vnode = {
      key: props && props.key || null,
      type: type,
      props: props ? props : {},
      children
    };
    let count = 0;
    vnode.children.forEach(child => {
      count++;
    }); // 标记当前节点下面有几个子节点

    vnode.count = count;
    return vnode;
  }

  function createElement(vnode) {
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


    children.forEach(child => {
      el.appendChild(createElement(child));
    }); // 精简写法:
    // let appendChild = el.appendChild.bind(el);
    // children.map(createElement).map(appendChild);

    return el;
  }

  function render(vdom, el) {
    el.appendChild(vdom);
  }

  // 删除节点

  const REPLACE = 'REPLACE'; // patchType 重新排列节点

  const REORDER = 'REORDER'; // patchType 属性修改

  const PROPS = 'PROPS'; // patchType 文本修改

  const TEXT = 'TEXT';

  function diff(tree, newTree) {
    let index = 0;
    let patches = {};
    diffNode(tree, newTree, index, patches);
    return patches;
  }

  function diffNode(node, newNode, index, patches) {
    let currentPatch = [];

    if (!newNode) {
      // console.log('!newNode ', node);
      return;
    }

    if (utils.isString(node) && utils.isString(newNode)) {
      if (node !== newNode) {
        currentPatch.push({
          type: TEXT,
          content: newNode
        });
      }
    } else if (newNode.type === node.type && newNode.key === node.key) {
      let propsPatches = diffProps(node.props, newNode.props);

      if (Object.keys(propsPatches).length) {
        currentPatch.push({
          type: PROPS,
          props: propsPatches
        });
      }

      diffChildren(node.children, newNode.children, index, patches, currentPatch);
    } else {
      currentPatch.push({
        type: REPLACE,
        node: newNode
      });
    } // console.log('currentPatch: ', currentPatch);
    // console.log('patches: ', index);


    if (currentPatch.length) {
      patches[index] = currentPatch;
    }
  }

  function diffProps(props, newProps) {
    let propsPatches = {};

    for (const key in props) {
      if (newProps[key] !== props[key]) {
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

  function diffChildren(children, newChildren, index, patches, currentPatch) {
    let diffs = diffNodes(children, newChildren); // console.log(diffs);

    newChildren = diffs.nodes;

    if (diffs.moves.length) {
      currentPatch.push({
        type: REORDER,
        moves: diffs.moves
      });
    }

    let leftNode = null;
    let currentNodeIndex = index;
    children.forEach((child, i) => {
      let newChild = newChildren[i];
      currentNodeIndex = leftNode && leftNode.count ? currentNodeIndex + leftNode.count + 1 : currentNodeIndex + 1;
      diffNode(child, newChild, currentNodeIndex, patches);
      leftNode = child;
    });
  }

  function diffNodes(nodes, newNodes) {
    // if (!nodes || !newNodes) {
    //   console.log(nodes, newNodes);
    // }
    let keyMap = buildKeyMap(nodes);
    let newKeyMap = buildKeyMap(newNodes);
    let _nodes = [];
    let moves = [];
    let nodeIndex = 0;
    nodes.forEach(item => {
      const key = item.key;

      if (key) {
        if (!newKeyMap.hasOwnProperty(key)) {
          _nodes.push(null);
        } else {
          _nodes.push(newNodes[key]);
        }
      } else {
        _nodes.push(newNodes[nodeIndex++] || null);
      }
    }); // console.log(oldMap);
    // console.log(_nodes);

    _nodes.forEach((item, i) => {
      if (item === null) {
        moves.push(remove(i));

        _nodes.splice(i, 1);
      }
    }); // console.log('-----');


    let j = 0;
    newNodes.forEach((item, i) => {
      let key = item.key;
      let _nodeItem = _nodes[j];

      if (_nodeItem) {
        let _nodeKey = _nodeItem.key;

        if (_nodeKey === item.key) {
          j++;
        } else {
          if (!keyMap.hasOwnProperty(key)) {
            moves.push(insert(i, item));
          } else {
            let nextKey = _nodes[j + 1].key;

            if (nextKey === key) {
              moves.push(remove(i));

              _nodes.splice(j, 1);

              j++;
            } else {
              moves.push(insert(i, item));
            }
          }
        }
      } else {
        moves.push(insert(i, item));
      }
    }); // console.log(_nodes);
    // console.log(moves);

    return {
      moves,
      nodes: _nodes
    };
  }

  function remove(i) {
    return {
      index: i,
      type: REPLACE
    };
  }

  function insert(i, item) {
    return {
      index: i,
      item,
      type: REORDER
    };
  }

  function buildKeyMap(elements) {
    let keyMap = {};
    elements.forEach((item, i) => {
      if (item.key) {
        keyMap[item.key] = i;
      }
    });
    return keyMap;
  }

  function patch(root, patches) {
    let steps = {
      index: 0
    };
    let index = 0;
    patchNode(root, steps, patches, index);
  }

  function patchNode(node, steps, patches) {
    let currentPatch = patches[steps.index];

    if (currentPatch) {
      applyPatches(node, currentPatch);
    }

    node.childNodes.forEach(child => {
      steps.index++; // console.log(steps, child);

      patchNode(child, steps, patches);
    });
  }

  function applyPatches(node, patch) {
    patch.forEach(item => {
      switch (item.type) {
        case REPLACE:
          // console.log(node, item.node, 'replace');
          let newNode = utils.isString(item.node) ? document.createTextNode(item.node) : createElement(item.node);
          node.parentNode.replaceChild(newNode, node);
          break;

        case REORDER:
          // console.log(node, item.moves, 'reorder');
          reorderChildren(node, item.moves);
          break;

        case PROPS:
          // console.log(node, item.props, 'props');
          utils.setAttrs(node, item.props);
          break;

        case TEXT:
          node.nodeValue = item.content;
          break;

        default:
          throw new Error(`Unknown patch type ${item.type}`);
      }
    });
  }

  function reorderChildren(node, moves) {
    const nodeList = [].slice.call(node.childNodes);
    let maps = {};
    nodeList.forEach(item => {
      if (node.nodeType === 1) {
        let key = node.getAttribute('key');

        if (key) {
          maps[key] = node;
        }
      }
    });
    moves.forEach(move => {
      let index = move.index;

      if (move.type === REPLACE) {
        if (nodeList[index] === node.childNodes[index]) {
          node.removeChild(node.childNodes[index]);
        }

        nodeList.splice(index, 1);
      } else if (move.type === REORDER) {
        let insertNode = maps[move.item.key] ? maps[move.item.key].cloneNode(true) : typeof move.item === 'object' ? createElement(move.item) : document.createTextNode(move.item);
        nodeList.splice(index, 0, insertNode);
        node.insertBefore(insertNode, node.childNodes[index] || null);
      }
    });
  }

  let vtree = createVNode('div', {
    id: 'box'
  }, createVNode('p', {
    className: 'message',
    style: {
      color: '#36f'
    }
  }, 'hello walker'), createVNode('ul', {
    className: 'lists'
  }, createVNode('li', null, 'Item 1'), createVNode('li', null, 'Item 2'), createVNode('li', null, 'Item 3')));
  console.log('vtree: ', vtree);
  let rootNode = createElement(vtree);
  console.log('rootNode: ', rootNode);
  render(rootNode, document.getElementById('app'));
  /*
  let newVtree = createVNode('div', { className: 'new-box', id: 'box' },
    createVNode('h1', { id: 'title' }, 'This is title'),
    createVNode('p', { style: { color: '#f80' } }, 'hello walker, nice to meet you'),
    createVNode('ul', { className: 'lists new-lists' },
      createVNode('li', null, 'Item 1'),
      createVNode('li', null, 'Item 4'),
    )
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
      items.push(createVNode('li', null, `Item ${i}`));
    }

    let color = count % 2 === 0 ? '#36f' : '#f80';
    return createVNode('div', {
      className: 'new-box',
      id: 'box'
    }, createVNode('h1', {
      id: 'title'
    }, 'This is title'), createVNode('p', {
      style: {
        color: color
      }
    }, `hello walker, nice to meet you ${count}`), createVNode('ul', {
      className: 'lists new-lists'
    }, ...items));
  }

  function renderTest() {
    let newVtree = createVtree();
    let patches = diff(vtree, newVtree);
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
