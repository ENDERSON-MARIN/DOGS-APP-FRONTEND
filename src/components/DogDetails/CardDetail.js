import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

export const DogDetailWrapper = styled.div`
  width: 55%;
  border: 3px solid var(--color-primary);
  border-radius: 25px;
  position: absolute;
  background-color: #000000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 10px;

  @media (max-width: 600px) {
    font-size: 12px;
  }
`;

export const DogDetailImg = styled.img`
  width: 100%;
  height: 500px;
  border-radius: 25px;
  margin-bottom: 15px;

  @media (max-width: 600px) {
    max-width: 100%;
    height: auto;
  }
`;

export const DogDetailTemperaments = styled.p`
  color: var(--color-white);
  text-align: center;
  font-weight: 400;
  width: 100%;
  padding: 5px;
  margin-bottom: 10px;

  @media (max-width: 600px) {
    font-size: 12px;
  }
`;

export const DogDetailWrapperOthers = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5px 0.5px;
  width: 50vw;

  @media (max-width: 750px) {
    width: 100%;
    grid-template-columns: 1fr;
  }
`;

export const DogDetailOthers = styled.p`
  justify-content: center;
  display: flex;
  padding: 10px;
  margin: 5px;
  border-radius: 15px;
  color: var(--color-white);
  background-color: var(--color-primary);
`;

export const DogDetailLabel = styled.span`
  justify-content: center;
  display: flex;
`;
