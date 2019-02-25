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

  // 参考 React 实现一个精简版的 createElement 方法
  function createElement(type, props, children) {
    let element = {
      key: (props && props.key) | null,
      type: type,
      props: props ? props : {}
    };

    if (children && children.length >= 1) {
      element.children = children;
    }

    return element;
  }

  function createVdom(element) {
    let {
      type,
      props,
      children
    } = element; // type 类型判断，按照 React 的套路，可能是html标签、文本、函数、React组件，
    // 这里暂时只处理html标签及文本的情况
    // jsx 解析后文本为字符串，html标签会解析为对象

    let el = document.createElement(type);
    utils.setAttrs(el, props);

    if (!children) {
      return el;
    }

    children.forEach(child => {
      let elChild;

      if (utils.isString(child)) {
        elChild = document.createTextNode(child);
      }

      if (utils.isObject(child)) {
        elChild = createVdom(child);
      }

      el.appendChild(elChild);
    });
    return el;
  }

  function render(vdom, el) {
    el.appendChild(vdom);
  }

  // patchType 替换节点

  function diff(node, newNode) {
    console.log('diff');
    let index = 0;
    let patches = {};
    diffByType(node, newNode, index, patches);
    return patches;
  }

  function diffByType(node, newNode, index, patches) {

    if (utils.isString(node) && utils.isString(newNode)) ;
  }

  let elements = createElement('div', {
    className: 'box',
    id: 'box'
  }, [createElement('p', {
    style: {
      color: '#36f'
    }
  }, ['hello walker']), createElement('ul', {
    className: 'lists'
  }, [createElement('li', null, [`Item 1`]), createElement('li', null, [`Item 2`]), createElement('li', null, [`Item 3`])])]);
  console.log('elements: ', elements);
  let vdom = createVdom(elements);
  console.log('vdom: ', vdom);
  render(vdom, document.getElementById('app'));
  let newElements = createElement('div', {
    className: 'box',
    id: 'box'
  }, [createElement('h1', {
    id: 'title'
  }, ['This is title']), createElement('p', {
    style: {
      color: '#f80'
    }
  }, ['hello walker, nice to meet you']), createElement('ul', {
    className: 'lists new-lists'
  }, [createElement('li', null, [`Item 1`]), createElement('li', null, [`Item 2`]), createElement('li', null, [`Item 3`]), createElement('li', null, [`Item 4`])])]);
  let patches = diff(elements, newElements);
  console.log('patches: ', patches);

}));
//# sourceMappingURL=bundle.js.map
