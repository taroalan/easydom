import utils from './utils';
import { REMOVE, INSERT, REPLACE, REORDER, PROPS, TEXT } from './constants';
import createElement from './create_element';

function patch(root, patches) {
  let steps = { index: 0 };
  let index = 0;

  patchNode(root, steps, patches, index);
}

function patchNode(node, steps, patches) {
  let currentPatch = patches[steps.index];

  if (currentPatch) {
    applyPatches(node, currentPatch);
  }

  node.childNodes.forEach(child => {
    steps.index++;
    // console.log(steps, child);
    patchNode(child, steps, patches)
  });
}

function applyPatches(node, patch) {
  patch.forEach(item => {
    switch(item.type) {
      case REMOVE:
        // console.log(node, item, 'remove');
        node.parentNode.removeChild(node);
        break;
      case INSERT:
        // console.log(node, item, 'insert');
        // item.node.parentNode.appendChild(item.node);
        break;
      case REPLACE:
        // console.log(node, item.node, 'replace');
        let newNode = utils.isString(item.node)
          ? document.createTextNode(item.node)
          : createElement(item.node);
        node.parentNode.replaceChild(newNode, node);
        break;
      case REORDER:
        // console.log(node, item.moves, 'reorder');
        reorderChildren(node, item.moves);
        break;
      case PROPS:
        // console.log(node, item.props, 'props');
        utils.setAttrs(node, item.props);
        break;
      case TEXT:
        node.nodeValue = item.content;
        break;
      default:
        throw new Error(`Unknown patch type ${item.type}`);
    }
  });
}

function reorderChildren(node, moves) {
  const nodeList = [].slice.call(node.childNodes);
  let maps = {};

  nodeList.forEach(item => {
    if (node.nodeType === 1) {
      let key = node.getAttribute('key');
      if (key) {
        maps[key] = node;
      }
    }
  });

  moves.forEach(move => {
    let index = move.index;
    if (move.type === REPLACE) {
      if (nodeList[index] === node.childNodes[index]) {
        node.removeChild(node.childNodes[index]);
      }
      nodeList.splice(index, 1);
    } else if (move.type === REORDER) {
      let insertNode = maps[move.item.key]
        ? maps[move.item.key].cloneNode(true)
        : (typeof move.item === 'object')
          ? createElement(move.item)
          : document.createTextNode(move.item);
      nodeList.splice(index, 0, insertNode);
      node.insertBefore(insertNode, node.childNodes[index] || null);
    }
  });
}

export default patch;
