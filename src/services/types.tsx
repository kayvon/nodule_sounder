import { AudioContext } from 'standardized-audio-context';

import { ChunkEdge, ChunkNode, SendEdgeUpdate } from './SoundChunk';

export type SoundChunkWithDependencies = {
  nodes: Array<ChunkNode | ChunkEdge>;
} & SoundChunkDependencies;

export type SoundChunkDependencies = {
  sendEdgeUpdate: SendEdgeUpdate;
  audioContext: AudioContext;
};

export type SoundChunkProps = Omit<
  SoundChunkWithDependencies,
  keyof SoundChunkDependencies
>;

export enum ConnectionRole {
  SOURCE = 'source',
  DESTINATION = 'destination',
}

export type Connection = {
  type: ConnectionRole;
  name: string;
};
