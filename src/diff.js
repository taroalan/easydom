import utils from './utils';
import { INSERT, REMOVE, PROPS, TEXT, REPLACE, ORDER } from './constants';

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
    // currentPatch.push({
    //   type: REMOVE,
    // });
  } else if (utils.isString(oldNode) && utils.isString(newNode)) {
    if (oldNode !== newNode) {
      currentPatch.push({
        type: TEXT,
        content: newNode,
      });
    }
  } else if (
    oldNode &&
    newNode &&
    oldNode.type === newNode.type &&
    oldNode.key === newNode.key
  ) {
    let propsPatches = diffProps(oldNode.props, newNode.props);

    if (Object.keys(propsPatches).length) {
      currentPatch.push({
        type: PROPS,
        props: propsPatches,
      });
    }

    // 对比子节点
    // todo
    diffChildren(
      oldNode.children,
      newNode.children,
      index,
      patches,
      currentPatch
    );
  } else {
    currentPatch.push({
      type: REPLACE,
      node: newNode,
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
  console.log('oldChildren, newChildren: ', oldChildren, newChildren);
  let diffs = diffList(oldChildren, newChildren);

  console.log(diffs);

  if (diffs.moves.length) {
    currentPatch.push({
      type: ORDER,
      moves: diffs.moves,
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

  // 遍历旧节点
  // 观察新节点在同一个位置有什么变化
  oldList.forEach((item, i) => {
    let newItem = newList[i] || null;
    nodes.push(newItem);
  });

  console.log(nodes);

  // 去除 null
  // 如果新节点比旧节点数量减少了，就会出现null的情况
  // 对于旧节点而言就是节点被 REMOVE 了
  nodes.forEach((node, i) => {
    if (node === null) {
      moves.push({
        index: i,
        type: REMOVE,
      });
      // nodes.splice(i, 1);
    }
  });

  nodes.forEach((node, i) => {
    if (node === null) {
      nodes.splice(i, 1);
    }
  });

  if (nodes.length === 1 && nodes[0] === null) {
    nodes = [];
  }

  newList.forEach((item, i) => {
    item = utils.isArray(item) ? item[0] : item;
    let nodeItem = nodes[i];
    if (nodeItem) {
      // 有key的情况
    } else {
      moves.push({
        type: ORDER,
        item,
        index: i,
      });
    }
  });

  // console.log('diffList nodes', nodes);
  // console.log('diffList moves', moves);

  return {
    moves,
    nodes,
  };
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
