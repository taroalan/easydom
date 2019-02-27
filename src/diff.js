import utils from './utils';
import { REMOVE, INSERT, PROPS, TEXT, REPLACE, REORDER,  } from './constants';

function diff(tree, newTree) {
  // console.log('diff');
  let index = 0;
  let patches = {};

  return diffNode(tree, newTree, index, patches);
}

function diffNode(oldNode, newNode, index, patches) {
  // let patches = {};
  let currentPatch = [];

  // console.log(`DIFF STEPS: ${index}: `, oldNode, newNode);

  if (!newNode) {
    // 这种情况归并到 REORDER 里去处理
    // currentPatch.push({
    //   type: REMOVE
    // });
  } else if (utils.isString(oldNode) && utils.isString(newNode)) {
    if (oldNode !== newNode) {
      currentPatch.push({
        type: TEXT,
        content: newNode
      });
    }
  } else if (oldNode && newNode && oldNode.type === newNode.type && oldNode.key === newNode.key) {
    let propsPatches = diffProps(oldNode.props, newNode.props);

    if (Object.keys(propsPatches).length) {
      currentPatch.push({
        type: PROPS,
        props: propsPatches
      });
    }

    // 对比子节点
    // todo
    diffChildren(oldNode.children, newNode.children, index, patches, currentPatch);

  } else {
    currentPatch.push({
      type: REPLACE,
      node: newNode
    });
  }

  // console.log(`GOTO patchs[index] -- ${index}`);

  if (currentPatch.length) {
    // console.log(patches);
    patches[index] = currentPatch;
  }

  return patches;
}

function diffChildren(oldChildren, newChildren, index, patches, currentPatch) {
  // console.log('oldChildren, newChildren: ', oldChildren, newChildren);
  let diffs = diffList(oldChildren, newChildren);

  // console.log(diffs);

  if (diffs.moves.length) {
    currentPatch.push({
      type: REORDER,
      moves: diffs.moves
    });
  }

  newChildren = diffs.nodes;

  let count = 0;
  for (var i = 0; i < oldChildren.length || i < newChildren.length; i++) {
    let oldNode = oldChildren[i];
    let newNode = newChildren[i];
    // console.log(`i -- index -- count : ${i}-${index}-${count}`);
    // count++;
    index++;
    diffNode(oldNode, newNode, i + index, patches);
  }
}

function diffList(oldList, newList) {
  let moves = [];
  let nodes = [];

  oldList.forEach((item, i) => {
    let newItem = newList[i] || null;
    nodes.push(newItem);
  });

  // console.log(nodes);

  // 去除 null
  nodes.forEach((node, i) => {
    if (node === null) {
      moves.push({
        index: i,
        type: REPLACE
      });
      nodes.splice(i, 1);
    }
  });


  if (nodes.length === 1 && nodes[0] === null) {
    nodes = [];
    moves.push({
      index: nodes.length,
      type: REPLACE
    });
  }


  newList.forEach((item, i) => {
    item = utils.isArray(item) ? item[0] : item;
    let nodeItem = nodes[i];
    if (nodeItem) {
      // 有key的情况
    } else {
      moves.push({
        type: 'REORDER',
        item,
        index: i
      });
    }
  });

  // console.log('diffList nodes', nodes);
  // console.log('diffList moves', moves);

  return {
    moves,
    nodes
  }
}

function diffProps(props, newProps) {
  let propsPatches = {};

  for (const key in props) {
    if (newProps.hasOwnProperty(key) && newProps[key] !== props[key]) {
      propsPatches[key] = newProps[key];
    }
  }

  for (const key in newProps) {
    if (!props.hasOwnProperty(key)) {
      propsPatches[key] = newProps[key];
    }
  }

  return propsPatches;
}

export default diff;
