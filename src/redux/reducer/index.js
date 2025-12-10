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
} from "../actions/types";

/* Importo las funciones de filtrado y ordenamiento */
import {
  filterByExistence,
  orderByAlphabetic,
  orderByWeight,
  orderByHeight,
} from "./filtersOrder";

function getLocalData() {
  let dogsFav = window.localStorage.getItem("dogsFav");
  if (dogsFav) dogsFav = JSON.parse(dogsFav);
  return dogsFav;
}

function setLocalData(dogsFav) {
  window.localStorage.setItem("dogsFav", JSON.stringify(dogsFav));
}

/* creo el estado inicial de la app */
const initialState = {
  dogs: [],
  dogsCopy: [],
  dogsApi: [],
  dogsDb: [],
  temperaments: [],
  dogDetails: [],
  dogsFavorites: getLocalData(),
};

/* creo la funcion reducer */

function rootReducer(state = initialState, { type, payload }) {
  switch (type) {
    case GET_ALL_DOGS:
      return {
        ...state,
        dogs: payload,
        dogsCopy: payload,
        dogDetails: payload,
        dogsApi: filterByExistence("API", payload),
        dogsDb: filterByExistence("DB", payload),
      };
    case CREATE_DOG:
      return {
        ...state,
      };
    case UPDATE_DOG:
      return {
        ...state,
      };
    case DELETE_DOG:
      return {
        ...state,
      };
    case GET_DOGS_BY_NAME:
      return {
        ...state,
        dogs: payload,
      };
    case GET_DOG_BY_ID:
      return {
        ...state,
        dogDetails: payload,
      };
    case CLEAR_DOG_DETAILS: {
      return {
        ...state,
        dogDetails: undefined,
      };
    }
    case GET_ALL_TEMPERAMENTS:
      return {
        ...state,
        temperaments: payload,
      };
    case FILTER_BY_TEMPERAMENTS:
      const allDogs = state.dogsCopy;
      const filterTemp =
        payload === "All"
          ? allDogs
          : allDogs.filter((d) => {
              return d.temperaments.includes(payload);
            });
      return {
        ...state,
        dogs: filterTemp,
      };

    case FILTER_BY_EXISTENCE:
      return {
        ...state,
        dogs: filterByExistence(payload, state.dogsCopy),
      };
    case ORDER_BY_ALPHABETICAL:
      return {
        ...state,
        dogs: orderByAlphabetic(payload, state.dogsCopy),
      };
    case ORDER_BY_WEIGHT:
      return {
        ...state,
        dogs: orderByWeight(payload, state.dogsCopy),
      };
    case ORDER_BY_HEIGHT:
      return {
        ...state,
        dogs: orderByHeight(payload, state.dogsCopy),
      };

    case ADD_DOG_FAVORITES: {
      let newState;
      if (state.dogsFavorites) {
        if (state.dogsFavorites.find((dog) => dog.id === payload.id))
          newState = state;
        else {
          newState = {
            ...state,
            dogsFavorites: [...state.dogsFavorites, payload],
          };
        }
      } else {
        newState = {
          ...state,
          dogsFavorites: [payload],
        };
      }
      setLocalData(newState.dogsFavorites);
      return newState;
    }
    case REMOVE_DOG_FAVORITES: {
      let newState;
      if (state.dogsFavorites) {
        newState = {
          ...state,
          dogsFavorites: state.dogsFavorites.filter(
            (dog) => dog.id !== payload
          ),
        };
      } else {
        newState = state;
      }
      setLocalData(newState.dogsFavorites);
      return newState;
    }

    default:
      return state;
  }
}

export default rootReducer;
