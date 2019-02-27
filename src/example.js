import {
  createVNode,
  createElement,
  render,
  diff,
  patch
} from './index';

// jsx 被 babel 编译后的格式
let vtree = createVNode('div', { id: 'box' },
  createVNode('p', { className: 'message', style: { color: '#36f' } }, 'hello walker'),
  createVNode('ul', { className: 'lists' },
    createVNode('li', null, 'Item 1'),
    createVNode('li', null, 'Item 2'),
    createVNode('li', null, 'Item 3')
  )
);

console.log('vtree: ', vtree);

let rootNode = createElement(vtree);

console.log('rootNode: ', rootNode);

render(rootNode, document.getElementById('app'));


/*
let newVtree = createVNode('div', { className: 'new-box', id: 'box' },
  createVNode('h1', { id: 'title' }, 'This is title'),
  createVNode('p', { style: { color: '#f80' } }, 'hello walker, nice to meet you'),
  createVNode('ul', { className: 'lists new-lists' },
    createVNode('li', null, 'Item 1'),
    createVNode('li', null, 'Item 4'),
  )
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

  for(let i = 0; i < count; i++) {
    items.push(createVNode('li', null, `Item ${i}`));
  }

  let color = (count % 2 === 0) ? '#36f': '#f80';

  return createVNode('div', { className: 'new-box', id: 'box' },
    createVNode('h1', { id: 'title' }, 'This is title'),
    createVNode('p', { style: { color: color } }, `hello walker, nice to meet you ${count}`),
    createVNode('ul', { className: 'lists new-lists' }, ...items)
  );
}

function renderTest() {
  let newVtree = createVtree();
  let patches = diff(vtree, newVtree);
  console.log('patches: ', patches);
  patch(rootNode, patches);
  vtree = newVtree;
}


document.getElementById('btn-start').onclick = function () {
  count = 0;
  renderTest();
};

document.getElementById('btn-add').onclick = function () {
  count++;
  renderTest();
};

document.getElementById('btn-remove').onclick = function () {
  count--;
  if (count < 0) count = 0;
  renderTest();
};


