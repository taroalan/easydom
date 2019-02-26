import utils from './utils';


function createElement(vnode) {
  let { type, props, children } = vnode;

  // type 类型判断，按照 React 的套路，可能是html标签、文本、函数、React组件，
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
      elChild = createElement(child);
    }
    el.appendChild(elChild);
  });

  return el;
}

export default createElement;
