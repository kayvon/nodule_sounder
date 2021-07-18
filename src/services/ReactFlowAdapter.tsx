import { FlowElement } from 'react-flow-renderer';

import { ChunkEdge, ChunkEdgeRole, ChunkNode, ChunkNodeRole } from './types';

function mapSingleNodeToUINode(
  node: ChunkNode | ChunkEdge,
  index: number
): FlowElement {
  const type =
    node.type === ChunkNodeRole.SOURCE || ChunkNodeRole.MODIFIER
      ? 'basic'
      : 'basic';

  let uiNode: FlowElement;

  if (node.type === ChunkEdgeRole.EDGE) {
    uiNode = {
      id: `e${node.source}-${node.destination}`,
      source: node.source,
      target: node.destination,
      animated: true,
    };
  } else {
    uiNode = {
      id: index.toString(),
      data: { label: `${node.inputs.length} inputs`, text: index },
      type,
      position: { x: 50 * index, y: 50 },
    };
  }

  return uiNode;
}

// TODO: This UINode should implement the desired interface; right now it implements ReactFlow's node interface
export const mapNodesToUINodes = (nodes: Array<ChunkNode | ChunkEdge>) =>
  nodes.map(mapSingleNodeToUINode);
