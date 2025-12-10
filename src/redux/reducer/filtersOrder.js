/* FUNCIONES PARA EL FILTRADO Y ORDENAMIENTO */

export const filterByExistence = (existence, stateDogs) => {
  switch (existence) {
    case "API":
      return stateDogs.filter((dog) => typeof dog.id === "number");
    case "DB":
      return stateDogs.filter((dog) => typeof dog.id === "string");
    default:
      return stateDogs;
  }
};

export const orderByAlphabetic = (order, stateDogs) => {
  switch (order) {
    case "A-Z":
      return stateDogs.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    case "Z-A":
      return stateDogs.sort((a, b) => {
        return b.name.localeCompare(a.name);
      });
    default:
      return stateDogs;
  }
};

export const orderByWeight = (weight, stateDogs) => {
  switch (weight) {
    case "Max":
      return stateDogs.sort((a, b) => {
        if (a.weight_max > b.weight_max) return -1;
        if (b.weight_max > a.weight_max) return 1;
        else return 0;
      });
    case "Min":
      return stateDogs.sort((a, b) => {
        if (a.weight_min > b.weight_min) return 1;
        if (b.weight_min > a.weight_min) return -1;
        else return 0;
      });
    default:
      return stateDogs;
  }
};
export const orderByHeight = (height, stateDogs) => {
  switch (height) {
    case "Maximum":
      return stateDogs.sort((a, b) => {
        if (a.height_max > b.height_max) return -1;
        if (b.height_max > a.height_max) return 1;
        else return 0;
      });
    case "Minimum":
      return stateDogs.sort((a, b) => {
        if (a.height_min > b.height_min) return 1;
        if (b.height_min > a.height_min) return -1;
        else return 0;
      });
    default:
      return stateDogs;
  }
};
