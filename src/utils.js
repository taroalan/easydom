let utils = {};

utils.isType = (type, target) => {
  return Object.prototype.toString.call(target) === `[object ${type}]`;
};

['String', 'Boolean', 'Number', 'Array', 'Function', 'Object', 'Date', 'RegExp', 'Error'].forEach(type => {
  utils[`is${type}`] = (target) => utils.isType(type, target);
});


// props 中关于 html 属性的处理
// 暂时只处理一部分，仅供演示
// 注意 className、内联样式 style
utils.setAttrs = (el, props) => {
  for (let key in props) {
    if (['id', 'href', 'value'].indexOf(key) !== -1) {
      el.setAttribute(key, props[key])
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

export default utils;
