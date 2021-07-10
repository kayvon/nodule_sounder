import React, { FunctionComponent } from 'react';
import { NodeComponentProps } from 'react-flow-renderer';

import { ConnectionRole } from '../../services/types';
import { BaseAudioNode } from './Base';

export type BasicAudioNodeProps = NodeComponentProps;

export const BasicAudioNode: FunctionComponent<BasicAudioNodeProps> = ({
  data,
}) => {
  const inputs = [{ type: ConnectionRole.SOURCE, name: 'basic input' }];
  const outputs = [
    { type: ConnectionRole.DESTINATION, name: 'basic output 1' },
    { type: ConnectionRole.DESTINATION, name: 'basic output 2' },
  ];

  return (
    <BaseAudioNode data={data} inputs={inputs} outputs={outputs}>
      <div>I am a basic audio</div>
    </BaseAudioNode>
  );
};
