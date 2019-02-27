// 参考 React 实现一个精简版的 createVNode 方法
// babel plugin: jsx to vnode
// https://babeljs.io/docs/en/next/babel-plugin-transform-react-jsx.html

import utils from './utils';

function createVNode(type, props, ...children) {

  let vnode = {
    key: (props && props.key) || null,
    type: type,
    props: props ? props : {},
    children
  };

  let count = 0;

  vnode.children.forEach((child) => {
    count++;
  });

  // 标记当前节点下面有几个子节点
  vnode.count = count;

  return vnode;
}

export default createVNode;
