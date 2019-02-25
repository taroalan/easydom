import utils from './utils';
import { REPLACE, REORDER, PROPS, TEXT } from './constants';

function diff(node, newNode) {
  console.log('diff');
  let index = 0;
  let patches = {};

  diffByType(node, newNode, index, patches);

  return patches;
}

function diffByType(node, newNode, index, patches) {
  let currentPatch = [];

  if (utils.isString(node) && utils.isString(newNode)) {
    // 新旧节点均为文本且不一样
    if (node !== newNode) {
      currentPatch.push({
        type: TEXT,
        content: newNode
      });
    }
  }

}

export default diff;
