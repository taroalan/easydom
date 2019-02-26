// 参考 React 实现一个精简版的 createVNode 方法

function createVNode(type, props, children) {
  let vnode = {
    key: (props && props.key) || null,
    type: type,
    props: props ? props : {},
    children: children || []
  };

  let count = 0;

  vnode.children.forEach((child, i) => {
    count++;
  });

  vnode.count = count;

  return vnode;
}

export default createVNode;
