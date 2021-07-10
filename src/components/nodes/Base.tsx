import { motion } from 'framer-motion';
import React, { FunctionComponent } from 'react';
import { Handle, NodeComponentProps, Position } from 'react-flow-renderer';
import styled from 'styled-components';

import { Connection } from '../../services/types';

const boxShadowWithDepth =
  ({ height = 0 }) =>
  ({ depth = 0 }) => {
    return `
      box-shadow: 0 0 ${10 * height}px 0 rgba(50, 50, 50, .5)${Array(depth)
      .fill(0)
      .map(
        (_, depth) =>
          `, ${(depth + 1) * 5}px ${
            (depth + 1) * 3
          }px 0 0 rgba(50, 50, 50, ${Math.pow(0.5, depth + 1)})`
      )
      .join('')};
    `;
  };

export type BaseAudioNodeProps = Pick<NodeComponentProps, 'data'> & {
  depth?: number;
  inputs: Connection[];
  outputs: Connection[];
};

const BaseNode = styled.div<{ depth?: number }>`
  background: white;
  border: 1px solid gray;
  min-width: 30px;
  min-height: 30px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  ${boxShadowWithDepth({ height: 0 })}
  &:hover {
    ${boxShadowWithDepth({ height: 3 })}
  }
`;

const Title = styled.div``;

const Container = styled(motion.div)`
  position: relative;

  ${Title} {
    border: 1px solid ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.lighter};
    position: absolute;
    top: -8px;
    padding: 2px 8px;
    font-size: 12px;
  }
`;

const InputHandle = styled(Handle)<{ index: number }>`
  background: ${({ theme }) => theme.colors.secondary};
`;

const OutputHandle = styled(Handle)<{ index: number }>`
  background: ${({ theme }) => theme.colors.dark};
`;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const BaseAudioNode: FunctionComponent<BaseAudioNodeProps> = ({
  data,
  depth,
  inputs,
  outputs,
  children,
}) => {
  return (
    <Container>
      <BaseNode depth={depth}>
        <Title>{data.text}</Title>

        {inputs.map((_, index) => (
          <InputHandle
            key={index}
            index={index}
            type="target"
            position={Position.Left}
            style={{ top: 10 + index * 10 }}
            onConnect={(params) => console.log('handle onConnect', params)}
          />
        ))}

        {outputs.map(({ name }, index) => (
          <OutputHandle
            key={index}
            index={index}
            type="source"
            position={Position.Right}
            id={name}
            style={{ top: 10 + index * 10 }}
          />
        ))}

        {children}
      </BaseNode>
    </Container>
  );
};
