import React, { ReactElement, useMemo, useState } from 'react';
import { useCallback } from 'react';
import { ThemeProvider } from 'styled-components';

import './App.css';
import { Body } from './components/Body';
import { createSoundChunk, SendEdgeUpdate } from './services/SoundChunk';
import {
  ChunkEdge,
  ChunkEdgeRole,
  ChunkNode,
  ChunkNodeRole,
} from './services/types';
import { theme } from './theme';

const node1: ChunkNode = {
  id: '1',
  roles: [ChunkNodeRole.OUTPUT],
  inputs: ['2', '3'],
  outputs: [],
};

const node2: ChunkNode = {
  id: '2',
  roles: [ChunkNodeRole.GENERATOR],
  inputs: [],
  outputs: ['1'],
};

const node3: ChunkNode = {
  id: '3',
  roles: [ChunkNodeRole.GENERATOR],
  inputs: [],
  outputs: ['1'],
};

const edge1: ChunkEdge = {
  roles: [ChunkEdgeRole.EDGE],
  source: node1.id,
  destination: node1.id,
};

function App(): ReactElement {
  const [elements, setElements] = useState<{
    nodes: ChunkNode[];
    edges: ChunkEdge[];
  }>({
    nodes: [node1, node2, node3],
    edges: [edge1],
  });

  const sendEdgeUpdate: SendEdgeUpdate = useCallback<SendEdgeUpdate>(
    (edges) => {
      console.log('master!', edges);
      return edges;
    },
    []
  );

  const MyChunk = useMemo(
    () =>
      createSoundChunk({
        sendEdgeUpdate: sendEdgeUpdate,
      }),
    []
  );

  return (
    <ThemeProvider theme={theme}>
      <Body>
        <MyChunk nodes={elements} />
      </Body>
    </ThemeProvider>
  );
}

export default App;
