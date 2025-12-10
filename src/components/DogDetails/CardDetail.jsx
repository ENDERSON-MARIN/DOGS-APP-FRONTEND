import {
  DogDetailWrapper,
  DogDetailImg,
  DogDetailTemperaments,
  DogDetailWrapperOthers,
  DogDetailOthers,
  Wrapper,
} from "./CardDetail.js";

const CardDetail = ({ dog }) => {
  // console.log(dog);
  return (
    <Wrapper>
      <DogDetailWrapper>
        <DogDetailImg src={dog.image} alt="Dog" />
        <DogDetailWrapperOthers>
          <DogDetailOthers>
            Name : {dog.name ? dog.name : "Not Found"}
          </DogDetailOthers>
          <DogDetailOthers>
            Years Life : {dog.years_life ? dog.years_life : "Not Found"}
          </DogDetailOthers>
          <DogDetailOthers>
            Height Min(cm) : {dog.height_min ? dog.height_min : "Not Found"}
          </DogDetailOthers>
          <DogDetailOthers>
            Height Max(cm) : {dog.height_max ? dog.height_max : "Not Found"}
          </DogDetailOthers>
          <DogDetailOthers>
            Weight Min(kg) : {dog.weight_min ? dog.weight_min : "Not Found"}
          </DogDetailOthers>
          <DogDetailOthers>
            Weight Max(kg) : {dog.weight_max ? dog.weight_max : "Not Found"}
          </DogDetailOthers>
        </DogDetailWrapperOthers>
        <DogDetailTemperaments>
          Temperaments: {dog.temperaments}
        </DogDetailTemperaments>
      </DogDetailWrapper>
    </Wrapper>
  );
};

export default CardDetail;
