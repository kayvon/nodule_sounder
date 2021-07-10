import dagre from 'dagre';
import React, { FC, useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  FlowElement,
  Node,
  addEdge,
  isNode,
  Connection,
  Edge,
  Position,
  removeElements,
  useStoreState,
} from 'react-flow-renderer';
import { AudioContext } from 'standardized-audio-context';

import { BasicAudioNode } from '../components/nodes/BasicAudioNode';
import { Container } from './styled-components';
import {
  SoundChunkDependencies,
  SoundChunkProps,
  SoundChunkWithDependencies,
} from './types';

export enum ChunkNodeRole {
  SOURCE = 'source',
  MODIFIER = 'modifier',
  DESTINATION = 'destination',
}

export interface ChunkNode {
  id: string;
  name?: 'string';
  type: ChunkNodeRole;
  inputs: string[]; // TODO: strongerize these
  outputs: string[];
}

export enum ChunkEdgeRole {
  EDGE = 'edge',
}

export interface ChunkEdge {
  type: ChunkEdgeRole;
  source: ChunkNode['id'];
  destination: ChunkNode['id'];
}

// :begin: extract layout stuff

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

// In order to keep this example simple the node width and height are hardcoded.
// In a real world app you would use the correct width and height values of
// const nodes = useStoreState(state => state.nodes) and then node.__rf.width, node.__rf.height

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (elements: FlowElement[], direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  elements.forEach((el: Node<unknown> | Edge<unknown> | Connection) => {
    if (isNode(el)) {
      dagreGraph.setNode(el.id, { width: nodeWidth, height: nodeHeight });
    } else {
      // @ts-expect-error fix: if el is a connection, source can be null
      dagreGraph.setEdge(el.source, el.target);
    }
  });

  dagre.layout(dagreGraph);

  return elements.map((el) => {
    if (isNode(el)) {
      const nodeWithPosition = dagreGraph.node(el.id);
      el.targetPosition = isHorizontal ? Position.Left : Position.Top;
      el.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

      // unfortunately we need this little hack to pass a slightly different position
      // to notify react flow about the change. Moreover we are shifting the dagre node position
      // (anchor=center center) to the top left so it matches the react flow node anchor point (top left).
      el.position = {
        x: nodeWithPosition.x - nodeWidth / 2 + Math.random() / 1000,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
    }

    return el;
  });
};

// :end: extract layout stuff

type ChunkNodeOrEdge<T extends ChunkNode | ChunkEdge> = T extends ChunkNode
  ? ChunkNode
  : ChunkEdge;

// TODO: This UINode should implement the desired interface; right now it implements ReactFlow's node interface
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

const mapNodesToUINodes = (nodes: Array<ChunkNode | ChunkEdge>) =>
  nodes.map(mapSingleNodeToUINode);

// # begin audio utils

const resumeAudio = (audioContext: AudioContext) => {
  if (audioContext) {
    try {
      console.log('trye resume on component mount');
      audioContext.resume();
      console.log('tryed resume on mount');
    } catch (err) {
      console.warn('did no resume');
      console.warn(err);
    }
  }
};

const suspendAudio = (audioContext: AudioContext) => {
  if (audioContext) {
    audioContext.suspend();
  }
};

// # end audio utils

const customNodeTypes = {
  basic: BasicAudioNode,
};

const RFNodesDeleteMe = () => {
  const state = useStoreState((s) => s);

  console.log(state);

  return null;
};

const SoundChunk = ({
  nodes,
  sendEdgeUpdate,
  audioContext,
}: SoundChunkWithDependencies) => {
  useEffect(() => {
    resumeAudio(audioContext);

    return () => {
      suspendAudio(audioContext);
    };
  });

  const [elements, setElements] = useState(mapNodesToUINodes(nodes));

  const onConnect = (params: Edge<unknown> | Connection) => {
    sendEdgeUpdate(params as unknown as ChunkEdge[]);
    // setElements((els) =>
    //   addEdge({ ...params, type: 'smoothstep', animated: true }, els)
    // );
  };

  const onElementsRemove = (elementsToRemove: FlowElement[]) => {
    console.log(elementsToRemove);
    setElements((els) => removeElements(elementsToRemove, els));
  };

  const onLayout = useCallback(
    (direction: string) => {
      const layoutedElements = getLayoutedElements(elements, direction);
      setElements(layoutedElements);
    },
    [elements]
  );

  return (
    <Container>
      <button
        onClick={() => onLayout('TB')}
        aria-label="layout"
        type="button"
        name="button"
      >
        format
      </button>
      <button
        onClick={() => resumeAudio(audioContext)}
        aria-label="allow audio"
        type="button"
      >
        allow audio
      </button>
      <ReactFlow
        nodeTypes={customNodeTypes}
        elements={elements}
        onConnect={onConnect}
        onElementsRemove={onElementsRemove}
      >
        {/* <RFNodesDeleteMe /> */}
      </ReactFlow>
    </Container>
  );
};

const defaultDependencies = {
  audioContext: new AudioContext(),
  sendEdgeUpdate: (edge: ChunkEdge[]) => {
    console.warn('need sendEdgeUpdate injected in SoundChunk', edge);
    return edge;
  },
};

export type SendEdgeUpdate = (
  edges: ChunkEdge[]
) => ChunkNodeOrEdge<ChunkEdge>[];

export function createSoundChunk(
  dependencies: Partial<SoundChunkDependencies>
): FC<SoundChunkProps> {
  const { audioContext, sendEdgeUpdate } = {
    ...defaultDependencies,
    ...dependencies,
  };
  return (props: SoundChunkProps) => (
    <SoundChunk
      {...props}
      sendEdgeUpdate={sendEdgeUpdate}
      audioContext={audioContext}
    />
  );
}
