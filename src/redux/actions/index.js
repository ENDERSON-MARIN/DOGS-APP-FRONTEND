import axios from "axios";
import Swal from "sweetalert2";
/* Importo los actions types */
import {
  GET_ALL_DOGS,
  CREATE_DOG,
  UPDATE_DOG,
  DELETE_DOG,
  GET_DOGS_BY_NAME,
  GET_DOG_BY_ID,
  GET_ALL_TEMPERAMENTS,
  FILTER_BY_TEMPERAMENTS,
  FILTER_BY_EXISTENCE,
  ORDER_BY_ALPHABETICAL,
  ORDER_BY_WEIGHT,
  ORDER_BY_HEIGHT,
  ADD_DOG_FAVORITES,
  REMOVE_DOG_FAVORITES,
  CLEAR_DOG_DETAILS,
} from "./types.js";

/* GET ALL DOGS */
export function getAlldogs() {
  return async function (dispatch) {
    try {
      const dogs = await axios.get("/dogs");
      return dispatch({
        type: GET_ALL_DOGS,
        payload: dogs.data,
      });
    } catch (error) {
      console.log(error);
    }
  };
}

/* CREATE NEW DOG */
export function createDog(body) {
  return async function (dispatch) {
    try {
      await axios.post("/dogs", body);
      return dispatch({
        type: CREATE_DOG,
      });
    } catch (error) {
      console.log(error);
    }
  };
}

/* UPDATE DOG */
export function updateDog(id, body) {
  return async function (dispatch) {
    try {
      await axios.put(`/dogs/${id}`, body);
      return dispatch({
        type: UPDATE_DOG,
      });
    } catch (error) {
      console.log(error);
    }
  };
}

/* DELETE DOG */
export function deleteDog(id) {
  return async function (dispatch) {
    try {
      await axios.delete(`/dogs/${id}`);
      return dispatch({
        type: DELETE_DOG,
      });
    } catch (error) {
      console.log(error);
    }
  };
}

/* GET DOGS BY NAME */
export function getDogsByName(name) {
  return async function (dispatch) {
    try {
      const dogsName = await axios.get(`/dogs?name=${name}`);
      return dispatch({
        type: GET_DOGS_BY_NAME,
        payload: dogsName.data,
      });
    } catch (error) {
      Swal.fire({
        title: "Not found!",
        text: `The Dog name ${name} not found!`,
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: "red",
        timer: "3000",
      });
    }
  };
}

/* GET DOG BY ID */
export function getDogById(id) {
  if (id) {
    return async function (dispatch) {
      try {
        const dogId = await axios.get(`/dogs/${id}`);
        return dispatch({
          type: GET_DOG_BY_ID,
          payload: dogId.data,
        });
      } catch (error) {
        console.log(error);
      }
    };
  }

  return { type: CLEAR_DOG_DETAILS };
}

/* GET DOGS BY TEMPERAMENTS */
export function getDogsByTemperaments() {
  return async function (dispatch) {
    try {
      const dogsTemperaments = await axios.get("/temperaments");
      return dispatch({
        type: GET_ALL_TEMPERAMENTS,
        payload: dogsTemperaments.data,
      });
    } catch (error) {
      console.log(error);
    }
  };
}

/* FILTER DOGS BY TEMPERAMENTS */
export function filterDogsByTemperaments(temperaments) {
  return {
    type: FILTER_BY_TEMPERAMENTS,
    payload:temperaments,
  };
}

/* FILTER DOGS BY EXISTENCE */
export function filterDogsByExistence(existence) {
  return {
    type: FILTER_BY_EXISTENCE,
    payload: existence,
  };
}

/* ORDER DOGS BY ALPHABETICAL */
export function orderDogsByAlphabetical(ordering) {
  return {
    type: ORDER_BY_ALPHABETICAL,
    payload: ordering,
  };
}

/* ORDER DOGS BY WEIGHT */
export function orderDogsByWeight(weight) {
  return {
    type: ORDER_BY_WEIGHT,
    payload: weight,
  };
}

/* ORDER DOGS BY HEIGHT */
export function orderDogsByHeight(height) {
  return {
    type: ORDER_BY_HEIGHT,
    payload: height,
  };
}

/* ADD DOG TO FAVORITES */
export function addDogFavorites(payload) {
  return { type: ADD_DOG_FAVORITES, payload };
}

/* REMOVE DOG FROM FAVORITES */
export function removeDogFavorites(payload) {
  return { type: REMOVE_DOG_FAVORITES, payload };
}
