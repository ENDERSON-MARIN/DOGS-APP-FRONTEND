import React from "react";
import { Link } from "react-router-dom";
import Style from "./DogCard.module.css";
import { useDispatch, useSelector } from "react-redux";

import { addDogFavorites } from "../../redux/actions/index";

import Swal from "sweetalert2";

//--HOME CARDS
const DogCard = ({ id, name, weight_min, weight_max, height_min, height_max, image, temperaments }) => {
  const dispatch = useDispatch();
  const dogsFavorites = useSelector((state) => state.dogsFavorites);

  //--ADD DOGS TO FAVORITES
  const handleAddFavorites = () => {
    dispatch(
      addDogFavorites({
        id,
        name,
        weight_min,
        weight_max,
        image,
        temperaments,
      })
    );
    Swal.fire({
      title: "Added!",
      text: "Dog added Favorites!",
      icon: "success",
      confirmButtonText: "Ok",
      confirmButtonColor: "green",
      timer: "3000",
    });
  };

  return (
    <>
      <section className={Style.card}>
        <section className={Style.card2}>
          <Link to={`/dogDetails/${id}`}>
            <img className={Style.img} src={image} alt={name} />
            <h2 className={Style.cardName}> {name.toUpperCase()} </h2>
            <h4 className={Style.cardWeight}>Weight Min: {weight_min} Kg</h4>{" "} | 
            {" "}
            <h4 className={Style.cardWeight}>Weight Max: {weight_max} Kg</h4>
            <h4 className={Style.cardWeight}>Height Min: {height_min} Kg</h4>{" "} |
            {" "}
            <h4 className={Style.cardWeight}>Height Max: {height_max} Kg</h4>
            <h3 className={Style.cardTemperaments}>
              {" "}
              <p className={Style.temperaments}>Temperaments: {temperaments}</p>
            </h3>
          </Link>

          <button
            className={Style.cardLike}
            onClick={handleAddFavorites}
            disabled={dogsFavorites?.find((v) => v.id === id)}
          >
            💖
          </button>
        </section>
      </section>
    </>
  );
};
export default DogCard;
