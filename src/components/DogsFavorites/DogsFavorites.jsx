import { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import Style from "./DogsFavorites.module.css";
import DogCardFavorites from "../DogCardFavorites/DogCardFavorites.jsx";
import PaginatedFavorites from "../PaginatedFavorites/PaginatedFavorites.jsx";
import Loader from "../Loader/Loader";

const DogsFavorites = () => {
  const allDogsFavorites = useSelector((state) => state.dogsFavorites);
  const [loader, setLoader] = useState(true);

  //Paginated section
  const [currentPage, setCurrentPage] = useState(1); //inicia pagina 1
  const [dogsPerPage /*setDogsPerPage*/] = useState(8); //8 x pagina
  const lastDogsPerPage = currentPage * dogsPerPage; // 8
  const firstDogsPerPage = lastDogsPerPage - dogsPerPage; // 0
  const currentDogs = allDogsFavorites?.slice(
    firstDogsPerPage,
    lastDogsPerPage
  );

  const paginar = (page) => {
    setCurrentPage(page);
  };

  if (currentPage && loader) {
    setLoader(false);
  }
  return (
    <>
      <nav className={Style.navbar}>
        <ul>
          <h1> 💖 FAVORITE DOGS 💖</h1>
        </ul>
      </nav>
      <main className={Style.main}>
        <div>
          <div>
            <div className={Style.BtnContainer}>
              <NavLink to="/home">
                <button className={Style.Btn}>Go back Home!</button>
              </NavLink>
              <NavLink to="/dogCreate">
                <button className={Style.Btn}>Create Dog!</button>
              </NavLink>
            </div>

            <section className={Style.contentWrapper}>
              {currentDogs?.length > 0 && !loader ? (
                currentDogs.map((d) => {
                  return (
                    <DogCardFavorites
                      key={d.id}
                      id={d.id}
                      name={d.name}
                      image={d.image}
                      weight_min={d.weight_min}
                      weight_max={d.weight_max}
                      temperaments={d.temperaments}
                      years_life={d.years_life}
                    />
                  );
                })
              ) : !currentDogs && loader ? (
                <h1>Cargando Dogs...!</h1>
              ) : (
                <Loader />
              )}
            </section>
            <div className={Style.paginated}>
              <PaginatedFavorites
                pageFunction={paginar}
                data={dogsPerPage}
                current={currentPage}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
export default DogsFavorites;
