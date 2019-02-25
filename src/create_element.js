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

export default createElement;
