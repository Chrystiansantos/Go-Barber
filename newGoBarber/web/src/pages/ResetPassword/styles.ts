import styled, { keyframes } from 'styled-components';
import { shade } from 'polished';
import signInBackgroundImg from '../../assets/sign-in-background.png';

export const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: stretch;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  /* ira alinhar ao centro como se fosse um align items center */
  place-content: center;
  width: 100%;
  max-width: 700px;
`;

const appearFromLeft = keyframes`
from{
  opacity:0;
  transform:translateX(-50px)
}
to{
  opacity:1
  transform:translateX(-50px)
}`;

export const AnimationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  animation: ${appearFromLeft} 1s;

    margin: 80px 0;
    width: 340px;
    text-align: center;

    h1 {
      margin-bottom: 24px;
    }

    button {
    }
    a {
      color: #f4ede8;
      display: block;
      margin-top: 24px;
      text-decoration: none;
      transition: color o.2s;

      &:hover {
        /* ira escurecer um pouco */
        color: ${shade(0.2, '#f4ede8')};
      }
    }
  }
  /* ustilizando > eu irei pegar somente os a que estiver naquele nivel */
  > a {
    color: #ff9000;
    display: block;
    margin-top: 24px;
    text-decoration: none;
    transition: color 0.2s;

    display: flex;
    align-items: center;

    svg {
      margin-right: 16px;
    }

    &:hover {
      color: ${shade(0.2, '#ff9000')};
    }
  }
`;

export const Background = styled.div`
  flex: 1;
  background: url(${signInBackgroundImg}) no-repeat center;
  background-size: cover;
`;
