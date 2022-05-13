import styled from 'styled-components';

export const Container = styled.div`
  position: relative;

  span {
    background: #ff9000;
    padding: 8px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    opacity: 0;
    transition: opacity 0.4s;
    /* Ira ocultar o elemento do dom */
    visibility: hidden;

    position: absolute;
    width: 160px;
    bottom: calc(100% + 12px);
    /* Dessa forma irei centralizar o toltip */
    left: 50%;
    transform: translateX(-50%);
    color: #312e38;

    &::before {
      content: '';
      border-style: solid;
      border-color: #ff9000 transparent;
      border-width: 6px 6px 0 6px;
      bottom: 20px;
      top: 100%;
      position: absolute;
      left: 50%;
      transform: translate() (-50%);
    }
  }

  &:hover span {
    opacity: 1;
    /* Ira mostror o elemento no dom */
    visibility: visible;
  }
`;
