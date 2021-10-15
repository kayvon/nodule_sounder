import { FlowElement } from 'react-flow-renderer';

import {
  ChunkEdge,
  ChunkEdgeRole,
  ChunkElements,
  ChunkNode,
  ChunkNodeRole,
} from './types';

const mapSingleNodeToUINode = (node: ChunkNode, index: number): FlowElement => {
  const type =
    node.roles.includes(ChunkNodeRole.GENERATOR) ||
    node.roles.includes(ChunkNodeRole.MODIFIER)
      ? 'basic'
      : 'basic';

  const uiNode: FlowElement = {
    id: index.toString(),
    data: { label: `${node.inputs.length} inputs`, text: index },
    type,
    position: { x: 50 * index, y: 50 },
  };

  return uiNode;
};

const mapSingleEdgeToUINode = (node: ChunkEdge, index: number): FlowElement => {
  return {
    id: `e${node.source}-${node.destination}`,
    source: node.source,
    target: node.destination,
    animated: true,
  };
};

// TODO: This UINode should implement the desired interface; right now it implements ReactFlow's node interface
export const mapNodesToUINodes = ({
  nodes,
  edges,
}: ChunkElements): FlowElement[] => [
  ...nodes.map(mapSingleNodeToUINode),
  ...edges.map(mapSingleEdgeToUINode),
];
