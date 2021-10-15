import dagre from 'dagre';
import React, { Dispatch, FC, useCallback, useEffect, useState } from 'react';
import { SetStateAction } from 'react';
import ReactFlow, {
  Connection,
  Edge,
  FlowElement,
  isNode,
  Node,
  Position,
  removeElements,
  useStoreState,
} from 'react-flow-renderer';
import { AudioContext } from 'standardized-audio-context';

import { BasicAudioNode } from '../components/nodes/BasicAudioNode';
import { mapNodesToUINodes } from './ReactFlowAdapter';
import { Container } from './styled-components';
import {
  ChunkEdge,
  ChunkElements,
  SoundChunkDependencies,
  SoundChunkProps,
  SoundChunkWithDependencies,
} from './types';

// This doesn't seem to really be a service, does it?
// It's a view, which takes a set nodes with its own SoundChunk interface
//   - how is it going to interface with sound/video?
//   - what should its boundaries be? view stuff, to be a desired interface to the gui only?
//   - a combo of view, media interfaces to be used with its nodes?
//   - maybe it should take a graph viewer dependency
//         - this dependency could be an adapater-interface/wrapper around a graph gui, like react-flow...
//         - if so, should that adapted graph library also include methods for layout in its interface?
//    - how to self contain it — a SoundChunk node should be able to receive a SoundChunk, but...
//        should a node that is a SoundChunk have some sort of peer dependency? ... prob no,
//        so need to keep in mind any leaking dependencies/expectations about what each sound chunk is working with... web audio api, video api, whatever

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

  const [elements, setElements] = useState<FlowElement[]>(
    mapNodesToUINodes(nodes)
  );

  const onConnect = (params: Edge<unknown> | Connection) => {
    sendEdgeUpdate(params as unknown as ChunkEdge[]);
    // setElements((els) =>
    //   addEdge({ ...params, type: 'smoothstep', animated: true }, els)
    // );
  };

  const onElementsRemove = (elementsToRemove: FlowElement[]) => {
    console.log('remove', elementsToRemove);
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

export type SendEdgeUpdate = (edges: ChunkEdge[]) => ChunkEdge[];

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
