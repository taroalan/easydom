var e = {};
function t(n) {
  if (e.isNull(n)) return document.createTextNode('');
  var r = n.type,
    o = n.props,
    i = n.children;
  if (e.isString(n)) return document.createTextNode(n);
  var c = document.createElement(r);
  if ((e.setAttrs(c, o), !i)) return c;
  var a = c.appendChild.bind(c);
  return i.map(t).map(a), c;
}
(e.isType = function (e, t) {
  return Object.prototype.toString.call(t) === '[object '.concat(e, ']');
}),
  [
    'String',
    'Boolean',
    'Number',
    'Array',
    'Function',
    'Object',
    'Date',
    'RegExp',
    'Error',
    'Null',
  ].forEach(function (t) {
    e['is'.concat(t)] = function (n) {
      return e.isType(t, n);
    };
  }),
  (e.setAttrs = function (e, t) {
    for (var n in t)
      if (
        (-1 !== ['id', 'href', 'value'].indexOf(n) && e.setAttribute(n, t[n]),
        'className' === n && e.setAttribute('class', t.className),
        'style' === n)
      )
        for (var r in t.style) e.style[r] = t.style[r];
  });
function n(t, r, o, i) {
  var c = [];
  if (r)
    if (e.isString(t) && e.isString(r))
      t !== r && c.push({ type: 'TEXT', content: r });
    else if (t && r && t.type === r.type && t.key === r.key) {
      var a = (function (e, t) {
        var n = {};
        for (var r in e) t.hasOwnProperty(r) && t[r] !== e[r] && (n[r] = t[r]);
        for (var o in t) e.hasOwnProperty(o) || (n[o] = t[o]);
        return n;
      })(t.props, r.props);
      Object.keys(a).length && c.push({ type: 'PROPS', props: a }),
        (function (t, r, o, i, c) {
          console.log('oldChildren, newChildren: ', t, r);
          var a = (function (t, n) {
            var r = [],
              o = [];
            t.forEach(function (e, t) {
              var r = n[t] || null;
              o.push(r);
            }),
              console.log(o),
              o.forEach(function (e, t) {
                null === e && r.push({ index: t, type: 'REMOVE' });
              }),
              o.forEach(function (e, t) {
                null === e && o.splice(t, 1);
              }),
              1 === o.length && null === o[0] && (o = []);
            return (
              n.forEach(function (t, n) {
                (t = e.isArray(t) ? t[0] : t),
                  o[n] || r.push({ type: 'ORDER', item: t, index: n });
              }),
              { moves: r, nodes: o }
            );
          })(t, r);
          console.log(a),
            a.moves.length && c.push({ type: 'ORDER', moves: a.moves });
          r = a.nodes;
          for (var s = 0; s < t.length || s < r.length; s++) {
            n(t[s], r[s], s + ++o, i);
          }
        })(t.children, r.children, o, i, c);
    } else c.push({ type: 'REPLACE', node: r });
  else;
  return c.length && (i[o] = c), i;
}
function r(n, o, i) {
  (o[i] || []).forEach(function (r, o) {
    switch (r.type) {
      case 'INSERT':
        break;
      case 'REMOVE':
        console.log(n, r, 'remove'), n.parentNode.removeChild(n);
        break;
      case 'REPLACE':
        var i = t(r.node);
        n.parentNode.replaceChild(i, n);
        break;
      case 'ORDER':
        !(function (n, r) {
          var o = [].slice.call(n.childNodes);
          r.forEach(function (r) {
            var i = r.index;
            if ('REMOVE' === r.type) n.removeChild(o[i]);
            else if ('ORDER' === r.type) {
              var c = e.isObject(r.item)
                ? t(r.item)
                : document.createTextNode(r.item);
              o.splice(i, 0, c), n.insertBefore(c, n.childNodes[i] || null);
            }
          });
        })(n, r.moves);
        break;
      case 'PROPS':
        e.setAttrs(n, r.props);
        break;
      case 'TEXT':
        n.parentNode.textContent = r.content;
    }
  }),
    n.childNodes.forEach(function (e, t) {
      i++, r(e, o, t + i);
    });
}
var o = {
  createElement: function (t, n) {
    for (
      var r = arguments.length, o = new Array(r > 2 ? r - 2 : 0), i = 2;
      i < r;
      i++
    )
      o[i - 2] = arguments[i];
    1 === o.length && e.isArray(o[0]) && (o = o[0].length ? o[0] : []);
    var c = { key: (n && n.key) || null, type: t, props: n || {}, children: o };
    return c;
  },
  createDOM: t,
  render: function (e, t) {
    t.appendChild(e);
  },
  diff: function (e, t) {
    return n(e, t, 0, {});
  },
  patch: function (e, t) {
    r(e, t, 0);
  },
};
export default o;
