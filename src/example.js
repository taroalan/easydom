import {
  createElement,
  createVdom,
  render,
  diff,
  patch
} from './index';

// jsx 被 babel 编译后会转化为 createElement 的形式，
let elements = createElement('div', { id: 'box' }, [
  createElement('p', { className: 'message', style: { color: '#36f' } }, ['hello walker']),
  createElement('ul', { className: 'lists' }, [
    createElement('li', null, [`Item 1`]),
    createElement('li', null, [`Item 2`]),
    createElement('li', null, [`Item 3`])
  ])
]);


console.log('elements: ', elements);

let vdom = createVdom(elements);

console.log('vdom: ', vdom);

render(vdom, document.getElementById('app'));


/*
let newElements = createElement('div', { className: 'new-box', id: 'box' }, [
  createElement('h1', { id: 'title' }, ['This is title']),
  createElement('p', { style: { color: '#f80' } }, ['hello walker, nice to meet you']),
  createElement('ul', { className: 'lists new-lists' }, [
    createElement('li', null, [`Item 1`]),
    createElement('li', null, [`Item 4`]),
  ])
]);

let patches = diff(elements, newElements);

console.log('patches: ', patches);

patch(vdom, patches);
*/

let count = 0;

function createEl() {

  let items = [];

  for(let i = 0; i < count; i++) {
    items.push(createElement('li', null, [`Item ${i}`]));
  }

  let color = (count % 2 === 0) ? '#36f': '#f80';

  return createElement('div', { className: 'new-box', id: 'box' }, [
    createElement('h1', { id: 'title' }, ['This is title']),
    createElement('p', { style: { color: color } }, [`hello walker, nice to meet you ${count}`]),
    createElement('ul', { className: 'lists new-lists' }, items)
  ]);
}

function renderTest() {
  let newElements = createEl();
  let patches = diff(elements, newElements);
  console.log('patches: ', patches);
  patch(vdom, patches);
  elements = newElements;
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




