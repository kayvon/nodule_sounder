import { motion } from 'framer-motion';
import styled from 'styled-components/macro';

import logo from '../logo.svg';

export const Container = styled(motion.div)`
  position: relative;
  width: 100vw;
  height: 50vh;
  background: ${({ theme }) => theme.colors.secondary};
  border: 1px solid black;
`;

export const Handle = styled.div.attrs({ className: 'handle' })`
  display: flex;
  background: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  width: 4vmin;
  height: 4vmin;
  vertical-align: middle;
  top: -1.5vmin;
  left: -1.5vmin;
  position: absolute;
  cursor: grab;
  z-index: 99;
`;

export const Logo = styled.img.attrs({ src: logo, alt: 'logo' })`
  width: 100%;
  height: 100%;
  pointer-events: none;
`;
