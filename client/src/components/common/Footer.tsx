import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  width: 100%;
  height: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.palette.white};
`;

const Footer: FunctionComponent = () => {
  return <FooterContainer>Footer</FooterContainer>;
};

export default Footer;
