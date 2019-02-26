import utils from './utils';
import { REPLACE, REORDER, PROPS, TEXT } from './constants';

function diff(tree, newTree) {
  let index = 0;
  let patches = {};

  diffNode(tree, newTree, index, patches);

  return patches;
}

function diffNode(node, newNode, index, patches) {
  let currentPatch = [];

  if (!newNode) {
    // console.log('!newNode ', node);
    return;
  }

  if (utils.isString(node) && utils.isString(newNode)) {
    if (node !== newNode) {
      currentPatch.push({
        type: TEXT,
        content: newNode
      });
    }
  } else if (newNode.type === node.type && newNode.key === node.key) {
    let propsPatches = diffProps(node.props, newNode.props);

    if (Object.keys(propsPatches).length) {
      currentPatch.push({
        type: PROPS,
        props: propsPatches
      });
    }

    diffChildren(node.children, newNode.children, index, patches, currentPatch);

  } else {
    currentPatch.push({
      type: REPLACE,
      node: newNode
    });
  }
  // console.log('currentPatch: ', currentPatch);
  // console.log('patches: ', index);
  if (currentPatch.length) {
    patches[index] = currentPatch;
  }
}

function diffProps(props, newProps) {
  let propsPatches = {};

  for (const key in props) {
    if (newProps[key] !== props[key]) {
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

function diffChildren(children, newChildren, index, patches, currentPatch) {
  let diffs = diffNodes(children, newChildren);
  // console.log(diffs);
  newChildren = diffs.nodes;

  if (diffs.moves.length) {
    currentPatch.push({
      type: REORDER,
      moves: diffs.moves
    });
  }

  let leftNode = null;
  let currentNodeIndex = index;
  children.forEach((child, i) => {
    let newChild = newChildren[i];
    currentNodeIndex = (leftNode && leftNode.count)
      ? currentNodeIndex + leftNode.count + 1
      : currentNodeIndex + 1;
    diffNode(child, newChild, currentNodeIndex, patches);
    leftNode = child;
  });
}

function diffNodes(nodes, newNodes) {
  // if (!nodes || !newNodes) {
  //   console.log(nodes, newNodes);
  // }

  let keyMap = buildKeyMap(nodes);
  let newKeyMap = buildKeyMap(newNodes);

  let _nodes = [];
  let moves = [];

  let nodeIndex = 0;
  nodes.forEach(item => {
    const key = item.key
    if (key) {
      if (!newKeyMap.hasOwnProperty(key)) {
        _nodes.push(null);
      } else {
        _nodes.push(newNodes[key]);
      }
    } else {
      _nodes.push(newNodes[nodeIndex++] || null);
    }
  });

  // console.log(oldMap);
  // console.log(_nodes);

  _nodes.forEach((item, i) => {
    if (item === null) {
      moves.push(remove(i));
      _nodes.splice(i, 1);
    }
  });

  // console.log('-----');


  let j = 0;
  newNodes.forEach((item, i) => {
    let key = item.key;
    let _nodeItem = _nodes[j];
    if (_nodeItem) {
      let _nodeKey = _nodeItem.key;
      if (_nodeKey === item.key) {
        j++;
      } else {
        if (!keyMap.hasOwnProperty(key)) {
          moves.push(insert(i, item));
        } else {
          let nextKey = _nodes[j + 1].key;
          if (nextKey === key) {
            moves.push(remove(i));
            _nodes.splice(j, 1);
            j++;
          } else {
            moves.push(insert(i, item));
          }
        }
      }
    } else {
      moves.push(insert(i, item));
    }
  });

  // console.log(_nodes);
  // console.log(moves);
  return {
    moves,
    nodes: _nodes
  };
}

function remove(i) {
  return {
    index: i,
    type: REPLACE
  };
}

function insert(i, item) {
  return {
    index: i,
    item,
    type: REORDER
  };
}

function buildKeyMap(elements) {
  let keyMap = {};

  elements.forEach((item, i) => {
    if (item.key) {
      keyMap[item.key] = i;
    }
  });

  return keyMap;
}


export default diff;
