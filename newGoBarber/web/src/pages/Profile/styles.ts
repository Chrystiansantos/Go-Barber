import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  height: 100vh;

  header {
    height: 144px;
    background: #28262e;
    display: flex;
    align-items: center;

    div {
      width: 100%;
      max-width: 1120px;
      margin: 0 auto;

      svg {
        color: #999591;
        width: 50px;
        height: 50px;
      }
    }
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  /* ira alinhar ao centro como se fosse um align items center */
  place-content: center;
  width: 100%;
  max-width: 700px;
  margin: -176px auto 0;
  form {
    margin: 80px 0;
    width: 340px;
    text-align: center;
    display: flex;
    flex-direction: column;

    h1 {
      font-weight: 700;
      margin-bottom: 24px;
      font-size: 20px;
      text-align: left;
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
    input[name='old_passoword'] {
      margin-top: 24px;
    }
  }
`;

export const Avatarinput = styled.div`
  margin-bottom: 32px;
  position: relative;
  align-self: center;
  img {
    width: 186px;
    height: 186px;
    border-radius: 50%;
  }
  label {
    position: absolute;
    width: 48px;
    height: 48px;
    background: #ff9000;
    border-radius: 50%;
    bottom: 0;
    right: 0;
    border: 0;
    transition: background 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    input {
      display: none;
    }

    svg {
      width: 20px;
      height: 20px;
    }
    &:hover {
      background: ${shade(0.2, '#ff9000')};
    }
  }
`;
