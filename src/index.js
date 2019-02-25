import utils from './utils';

import createElement from './create_element';
import createVdom from './create_vdom';
import render from './render';
import diff from './diff';
import patch from './patch'

// jsx 被 babel 编译后会转化为 createElement 的形式，
let elements = createElement('div', { className: 'box', id: 'box' }, [
  createElement('p', { style: { color: '#36f' } }, ['hello walker']),
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


let newElements = createElement('div', { className: 'box', id: 'box' }, [
  createElement('h1', { id: 'title' }, ['This is title']),
  createElement('p', { style: { color: '#f80' } }, ['hello walker, nice to meet you']),
  createElement('ul', { className: 'lists new-lists' }, [
    createElement('li', null, [`Item 1`]),
    createElement('li', null, [`Item 2`]),
    createElement('li', null, [`Item 3`]),
    createElement('li', null, [`Item 4`]),
  ])
]);

let patches = diff(elements, newElements);

console.log('patches: ', patches);

