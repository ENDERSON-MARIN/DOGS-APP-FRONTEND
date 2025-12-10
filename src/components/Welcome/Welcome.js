import styled from "styled-components";

const BgContainer = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  & img {
    width: 100vw;
    height: 100vh;
  }
`;

const StartButton = styled.a`
  padding: 8px;
  background-color: #00608A;
  border-radius: 50px;
  color: #fff;
  text-decoration: none;
  font-weight: bolder;
  position: absolute;
  transition: all 0.3s;
  top:9.5vh;

  &:hover {
    cursor: pointer;
    background-color: #1db954;
  }
`;

export { BgContainer, StartButton };
