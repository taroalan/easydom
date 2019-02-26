// 参考 React 实现一个精简版的 createElement 方法

function createElement(type, props, children) {
  let element = {
    key: (props && props.key) || null,
    type: type,
    props: props ? props : {},
    children: children || []
  };


  let count = 0;

  element.children.forEach((child, i) => {
    count++;
  });

  element.count = count;

  return element;
}

export default createElement;
