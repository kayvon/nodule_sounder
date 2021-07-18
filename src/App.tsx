import React, { ReactElement, useMemo, useState } from 'react';
import { useCallback } from 'react';
import { ThemeProvider } from 'styled-components';

import './App.css';
import { Body } from './components/Body';
import {
  createSoundChunk,
  SendEdgeUpdate,
} from './services/SoundChunk';
import { theme } from './theme';
import {ChunkEdge, ChunkEdgeRole, ChunkNode, ChunkNodeRole} from "./services/types";

const node1: ChunkNode = {
  id: '1',
  type: ChunkNodeRole.DESTINATION,
  inputs: ['2', '3'],
  outputs: [],
};

const node2: ChunkNode = {
  id: '2',
  type: ChunkNodeRole.SOURCE,
  inputs: [],
  outputs: ['1'],
};

const node3: ChunkNode = {
  id: '3',
  type: ChunkNodeRole.SOURCE,
  inputs: [],
  outputs: ['1'],
};

const edge1: ChunkEdge = {
  type: ChunkEdgeRole.EDGE,
  source: node1.id,
  destination: node1.id,
};

function App(): ReactElement {
  const [elements, setElements] = useState<Array<ChunkNode | ChunkEdge>>([
    node1,
    node2,
    node3,
    edge1,
  ]);

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
