// use @babel/plugin-transform-react-jsx to parse jsx
// we should implement the createElement function
// https://babeljs.io/docs/en/next/babel-plugin-transform-react-jsx.html

import utils from './utils';

function createElement(type, props, ...children) {
  // 嵌套 children 的特殊处理，二维变一维
  // jsx 被 babel-plugin-transform-react-jsx 编译后的一种情况
  if (children.length === 1 && utils.isArray(children[0])) {
    children = !children[0].length ? [] : children[0];
  }

  let vnode = {
    key: (props && props.key) || null,
    type: type,
    props: props ? props : {},
    children,
  };

  return vnode;
}

export default createElement;
