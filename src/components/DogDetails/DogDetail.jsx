import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Style from "./DogDetail.module.css";

import { deleteDog, getDogById } from "../../redux/actions/index";

import CardDetail from "./CardDetail.jsx";
import Loader from "../Loader/Loader.jsx";

import Swal from "sweetalert2";

const DogDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const dogDetails = useSelector((state) => state.dogDetails);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getDogById(id));
    // console.log(id);
    return () => {
      getDogById();
    };
  }, [dispatch, id]);

  const handleDelete = () => {
    Swal.fire({
      title: `Are you sure delete this Dog?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteDog(id));
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Dog deleted successfully!!",
          confirmButtonColor: "green",
          confirmButtonText: "Ok!",
          showCancelButton: false,
          cancelButtonColor: "#d33",
          timer: 3000,
        });
        navigate("/home");
      } else if (result.isDenied) {
        //Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  // console.log(dogDetails);

  return (
    <div>
      <div className={Style.btncontainer}>
        <NavLink to="/home">
          <button className={Style.backBtn}>
            <span className={Style.buttonTop}>GO BACK HOME</span>
          </button>
        </NavLink>
        {typeof dogDetails.id === "string" && (
          <NavLink to={`/dogUpdate/${id}`}>
            <button className={Style.backBtn}>
              <span className={Style.buttonTop}>UPDATE DOG</span>
            </button>
          </NavLink>
        )}
        {typeof dogDetails.id === "string" && (
          <button className={Style.backBtn} onClick={handleDelete}>
            {" "}
            <span className={Style.buttonTop}>DELETE DOG</span>
          </button>
        )}
      </div>
      <section className={Style.container}>
        {dogDetails ? <CardDetail dog={dogDetails} /> : <Loader />}
      </section>
    </div>
  );
};
export default DogDetail;
