import { AudioContext } from 'standardized-audio-context';

import { SendEdgeUpdate } from './SoundChunk';

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

export enum ChunkEdgeRole {
  EDGE = 'edge',
}

export enum ChunkNodeRole {
  SOURCE = 'source',
  MODIFIER = 'modifier',
  DESTINATION = 'destination',
}

export interface ChunkNode {
  id: string;
  name?: 'string';
  roles: ChunkNodeRole[];
  inputs: string[]; // TODO: strongerize these
  outputs: string[];
}

export interface ChunkEdge {
  type: ChunkEdgeRole;
  source: ChunkNode['id'];
  destination: ChunkNode['id'];
}

export type Connection = {
  type: ConnectionRole;
  name: string;
};

export enum ChunkNodeTypes {
  OUTPUT = 'output',
  OSCILLATOR = 'oscillator',
  FILTER = 'filter',
  ECHO = 'echo',
  GAIN = 'gain',
}

export interface ChunkNodeType {
  name: ChunkNodeTypes;
}

export type ChunkElement<T extends ChunkNode | ChunkEdge> = T extends ChunkNode
  ? ChunkNode
  : ChunkEdge;
