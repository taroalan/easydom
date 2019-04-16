import utils from './utils';

function createElement(vnode) {
  if (utils.isNull(vnode)) {
    return document.createTextNode('');
  }

  let { type, props, children } = vnode;

  // type 类型判断，按照 React 的套路，可能是html标签(String)、函数(Function)、React组件(Component)，
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
  }

  // 常规写法:
  // children.forEach(child => {
  //   el.appendChild(createElement(child));
  // });

  // 精简写法:
  let appendChild = el.appendChild.bind(el);
  children.map(createElement).map(appendChild);

  return el;
}

export default createElement;
