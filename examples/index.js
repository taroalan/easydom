import easydom from '../src/index';
const { createElement } = easydom;

// jsx 被 babel 编译后的格式
// let vtree = createElement('div', { id: 'box' },
//   createElement('p', { className: 'message', style: { color: '#36f' } }, 'hello walker'),
//   createElement('ul', { className: 'lists' },
//     createElement('li', null, 'Item 1'),
//     createElement('li', null, 'Item 2'),
//     createElement('li', null, 'Item 3')
//   )
// );

// 这里使用 @babel/plugin-transform-react-jsx 解析
// 只需实现 createElement 即可，名称可以自定义
let vtree = (
  <div id="box">
    <p className="message" style={{ color: '#36f' }}>
      hello walker
    </p>
    <ul className="lists">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
  </div>
);
// vtree = null;

console.log('vtree: ', vtree);

let rootNode = easydom.createDOM(vtree);

console.log('rootNode: ', rootNode);

easydom.render(rootNode, document.getElementById('app'));

// let newVtree = createElement('div', { className: 'new-box', id: 'box' },
//   createElement('h1', { id: 'title' }, 'This is title'),
//   createElement('p', { style: { color: '#f80' } }, 'hello walker, nice to meet you'),
//   createElement('ul', { className: 'lists new-lists' },
//     createElement('li', null, 'Item 1'),
//     createElement('li', null, 'Item 4'),
//   )
// );

// let newVtree = (
//   <div id="box" className="new-box">

//     <p style={{color: '#f80'}}>hello walker, nick to meet you</p>

//   </div>
// );

/*
let newVtree = (
  <div id="box" className="new-box">
    <h1 id="title">This is title</h1>
    <p style={{color: '#f80'}}>hello walker, nick to meet you</p>
    <ul className="lists new-lists">
      <li>Item 1</li>
      <li>Item 4</li>
    </ul>
  </div>
);

let patches = diff(vtree, newVtree);

console.log('patches: ', patches);

patch(rootNode, patches);
*/

// test jsx
// let vdom1 = (
//   <div class="box">
//     <p>1</p>
//     <span>666</span>
//     <ul>
//       <li>item1</li>
//       <li>item1</li>
//       <li>item1</li>
//     </ul>
//   </div>
// );
// console.log(vdom1);

let count = 0;

function createVtree() {
  let items = [];

  for (let i = 0; i < count; i++) {
    // items.push(createElement('li', null, `Item ${i}`));
    items.push(<li>{'Item ' + i}</li>);
  }

  let color = count % 2 === 0 ? '#36f' : '#f80';

  return (
    <div id="box" className="new-box">
      <h1 id="title">This is title</h1>
      some text
      <p style={{ color: color }}>hello walker, nick to meet you</p>
      <ul className="lists new-lists">{items}</ul>
    </div>
  );
  // return createElement('div', { className: 'new-box', id: 'box' },
  //   createElement('h1', { id: 'title' }, 'This is title'),
  //   createElement('p', { style: { color: color } }, `hello walker, nice to meet you ${count}`),
  //   createElement('ul', { className: 'lists new-lists' }, ...items)
  // );
}

function renderTest() {
  let newVtree = createVtree();
  let patches = easydom.diff(vtree, newVtree);
  // console.log(vtree, newVtree);
  console.log('patches: ', patches);
  easydom.patch(rootNode, patches);
  vtree = newVtree;
}

document.getElementById('btn-start').onclick = function() {
  count = 0;
  renderTest();
};

document.getElementById('btn-add').onclick = function() {
  count++;
  renderTest();
};

document.getElementById('btn-remove').onclick = function() {
  count--;
  if (count < 0) count = 0;
  renderTest();
};
