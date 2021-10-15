import { AudioContext } from 'standardized-audio-context';

import { SendEdgeUpdate } from './SoundChunk';

export type SoundChunkWithDependencies = {
  nodes: ChunkElements;
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
  GENERATOR = 'generator',
  MODIFIER = 'modifier',
  OUTPUT = 'output',
}

export interface ChunkNode {
  id: string;
  name?: 'string';
  roles: ChunkNodeRole[];
  inputs: string[]; // TODO: strongerize these
  outputs: string[];
}

export interface ChunkEdge {
  roles: ChunkEdgeRole[];
  source: ChunkNode['id'];
  destination: ChunkNode['id'];
}

export enum ConnectionRole {
  SOURCE = 'source',
  DESTINATION = 'destination',
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

export interface ChunkElements {
  nodes: ChunkNode[];
  edges: ChunkEdge[];
}
