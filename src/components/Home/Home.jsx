import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import Style from "./Home.module.css";
import NavBar from "../NavBar/NavBar";
import DogCard from "../DogCard/DogCard";
import Paginated from "../Paginated/Paginated";
import Loader from "../Loader/Loader";

//---Import Actions--//
import {
  getAlldogs,
  getDogsByTemperaments,
  filterDogsByExistence,
  filterDogsByTemperaments,
  orderDogsByAlphabetical,
  orderDogsByWeight,
  orderDogsByHeight,
  getDogsByName,
} from "../../redux/actions/index";

const Home = () => {
  const allDogs = useSelector((state) => state.dogs);
  const allTemperaments = useSelector((state) => state.temperaments);
  const [, /* status */ setStatus] = useState("All");
  const [loader, setLoader] = useState(true);
  const dispatch = useDispatch();

  //Paginated section
  const [currentPage, setCurrentPage] = useState(1); //inicia pagina 1
  const [dogsPerPage /*setDogsPerPage*/] = useState(8); //8 x pagina
  const lastDogsPerPage = currentPage * dogsPerPage; // 8
  const firstDogsPerPage = lastDogsPerPage - dogsPerPage; // 0
  const currentDogs = allDogs?.slice(firstDogsPerPage, lastDogsPerPage);

  const paginar = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    dispatch(getAlldogs());
    dispatch(getDogsByTemperaments());
  }, [dispatch]);

  //--FILTER BY EXISTENCE-->ALL-API-DB
  const handleFilterExistence = (e) => {
    e.preventDefault();
    setStatus(e.target.value);
    dispatch(filterDogsByExistence(e.target.value)); //le paso la existencia =>ALL, API, DB
    setCurrentPage(1);
  };

  //--FILTER BY ALPHABETICAL-->A-Z/Z-A
  const handleOrderByAlphabetical = (e) => {
    e.preventDefault();
    setStatus(e.target.value);
    dispatch(orderDogsByAlphabetical(e.target.value)); //le paso el order => A-Z, Z-A
    setCurrentPage(1);
  };

  //--ORDER BY WEIGHT-->MIN/MAX
  const handleOrderByWeight = (e) => {
    e.preventDefault();
    setStatus(e.target.value);
    dispatch(orderDogsByWeight(e.target.value)); //le paso el peso => MIN, MAX
    setCurrentPage(1);
  };

  //--ORDER BY HEIGHT-->MINIMUM/MAXIMUM
  const handleOrderByHeight = (e) => {
    e.preventDefault();
    setStatus(e.target.value);
    dispatch(orderDogsByHeight(e.target.value)); //le paso el peso => MINIMUM, MAXIMUM
    setCurrentPage(1);
  };
  //--FILTER BY TEMPERAMENTS (search by temperaments)
  const handleFilterTemperaments = (e) => {
    e.preventDefault();
    dispatch(filterDogsByTemperaments(e.target.value)); // le paso el temperamento a la accion
    setCurrentPage(1);
  };

  const handleSearch = (value) => {
    dispatch(getDogsByName(value));
    setCurrentPage(1);
  };

  const handleReloadBtn = () => {
    window.location.reload();
  };

  if (currentPage && loader) {
    setLoader(false);
  }
  return (
    <>
      <NavBar onSearch={handleSearch} />
      <main className={Style.main}>
        <div>
          <div>
            <div className={Style.selectContainer}>
              <div className={Style.box}>
                <select
                  onChange={(e) => handleFilterTemperaments(e)}
                  defaultValue="Filter by Temperaments"
                >
                  <option value="Filter by Temperaments" disabled>
                    {" "}
                    FILTER BY TEMPERAMENTS
                  </option>
                  <option value="All">All Temperaments</option>
                  {allTemperaments &&
                    allTemperaments.map((e) => (
                      <option value={e.name} key={e.id}>
                        {e.name}
                      </option>
                    ))}
                </select>

                <select
                  onChange={(e) => handleFilterExistence(e)}
                  defaultValue="Filterby"
                >
                  <option value="Filterby" disabled>
                    {" "}
                    FILTER BY EXISTENCE{" "}
                  </option>
                  <option value="All">All</option>
                  <option value="API">API</option>
                  <option value="DB">DB</option>
                </select>

                <select
                  onChange={handleOrderByAlphabetical}
                  defaultValue="Sortby"
                >
                  <option value="Sortby" disabled>
                    {" "}
                    ORDER BY ALPHABETIC{" "}
                  </option>
                  <option value="A-Z"> A-Z </option>
                  <option value="Z-A"> Z-A </option>
                </select>
                <select onChange={handleOrderByWeight} defaultValue="Weight">
                  <option value="Weight" disabled>
                    {" "}
                    ORDER BY WEIGHT{" "}
                  </option>
                  <option value="Max">MAX⬆</option>
                  <option value="Min">MIN⬇</option>
                </select>
                <select onChange={handleOrderByHeight} defaultValue="Height">
                  <option value="Height" disabled>
                    {" "}
                    ORDER BY HEIGHT{" "}
                  </option>
                  <option value="Maximum">MAX⬆</option>
                  <option value="Minimum">MIN⬇</option>
                </select>
              </div>
            </div>
            <div className={Style.reloadBtnContainer}>
              <NavLink to="/dogCreate">
                <button className={Style.reloadBtn}>Create Dog!</button>
              </NavLink>
              <button
                data-text="Reload"
                className={Style.reloadBtn}
                onClick={handleReloadBtn}
              >
                <span className={Style.hoverText} aria-hidden="true">
                  &nbsp;Clear Filters&nbsp;
                </span>
              </button>
              <NavLink to="/dogsFavorites">
                <button className={Style.reloadBtn}>Favorite Dogs!</button>
              </NavLink>
            </div>

            <section className={Style.contentWrapper}>
              {currentDogs.length > 0 && !loader ? (
                currentDogs.map((d) => {
                  return (
                    <DogCard
                      key={d.id}
                      id={d.id}
                      name={d.name}
                      image={d.image}
                      weight_min={d.weight_min}
                      weight_max={d.weight_max}
                      height_min={d.height_min}
                      height_max={d.height_max}
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
              <Paginated
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
export default Home;
