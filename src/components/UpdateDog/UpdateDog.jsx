import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getDogsByTemperaments,
  getDogById,
  updateDog,
} from "../../redux/actions/index";
import "./UpdateDog.css";

import Swal from "sweetalert2";

function validateForm(inputs) {
  const errors = {};

  /* REGULAR EXPRESIONS */
  const regexText = /^([a-zA-Z ]+)$/i;
  const regexNumber = /^([0-9]+)$/i;
  const regexImg = /^https?:\/\/.*\/.*\.(png|gif|webp|jpeg|jpg)\??.*$/i;

  if (!inputs.name) {
    errors.name = "The field 'Name' is required!";
  } else if (!regexText.test(inputs.name)) {
    errors.name = "The name can't include especial characters or numbers";
  } else if (parseInt(inputs.name.length) >= 255) {
    errors.name = "must contain less than 255 characters";
  }

  /* INPUT IMAGE */
  if (!inputs.image) {
    errors.image = "The field 'image' is required!";
  } else if (!regexImg.test(inputs.image)) {
    errors.image = "Verify the URL, format image Valid(png|gif|webp|jpeg|jpg) ";
  }

  /* INPUT HEIGHT MAX */
  if (!inputs.height_max) {
    errors.height_max = "The field 'Height-Max' is required!";
  } else if (!regexNumber.test(inputs.height_max)) {
    errors.height_max = "The field 'Height-Max' can only contain numbers";
  }

  /* INPUT HEIGHT MIN */
  if (!inputs.height_min) {
    errors.height_min = "The field 'Height-Min' is required!";
  } else if (!regexNumber.test(inputs.height_min)) {
    errors.height_min = "The field 'Height-Min' can only contain numbers";
  } else if (parseInt(inputs.height_min) >= parseInt(inputs.height_max)) {
    errors.height_min =
      "The field 'Height-Min' must be smaller than the field 'Height-Max'";
  }

  /* INPUT WEIGHT */
  if (!inputs.weight_max) {
    errors.weight_max = "The field 'Weight-Max' is required!";
  } else if (!regexNumber.test(inputs.weight_max)) {
    errors.weight_max = "The field 'Weight-Max' can only contain numbers";
  }

  /* INPUT WEIGHT MIN */
  if (!inputs.weight_min) {
    errors.weight_min = "The field 'Weight-Min' is required!";
  } else if (!regexNumber.test(inputs.weight_min)) {
    errors.weight_min = "The field 'Weight-Min' can only contain numbers";
  } else if (parseInt(inputs.weight_min) >= parseInt(inputs.weight_max)) {
    errors.weight_min =
      "The field 'Weight-Min' must be smaller than the field 'Weight-Max'";
  }

  /* INPUT YEARS LIFE */
  if (!inputs.years_life) {
    errors.years_life = "The field 'years_life' is required!";
  } else if (parseInt(inputs.years_life.length) >= 30) {
    errors.years_life = "must contain less than 30 characters";
  }
  /* INPUT TEMPERAMENTS*/
  if (!inputs.temperaments) {
    errors.temperaments = "You must select at least 1 temperament!";
  }

  return errors;
}

function Form() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getDogsByTemperaments());
    id && dispatch(getDogById(id));
  }, [dispatch, id]);

  const dogDetail = useSelector((state) => state.dogDetails);
  const allTemperaments = useSelector((state) => state.temperaments);

  const [selectTemperaments, setSelectTemperaments] = useState([]);
  const [errors, setErrors] = useState({});
  const [data, setData] = useState({
    name: dogDetail.name,
    height_min: dogDetail.height_min,
    height_max: dogDetail.height_max,
    weight_min: dogDetail.weight_min,
    weight_max: dogDetail.weight_max,
    image: dogDetail.image,
    years_life: dogDetail.years_life,
    temperaments: selectTemperaments,
  });

  function handleChange(e) {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
    setErrors(
      validateForm({
        ...data,
        [e.target.name]: e.target.value,
      })
    );
  }

  function handleSelect(e) {
    //console.log(e.target.value);
    if (data.temperaments.includes(e.target.value)) return;

    setData({
      ...data,
      temperaments: [...data.temperaments, e.target.value],
    });

    const temperamentsId = e.target.value;

    setData({
      ...data,
      temperaments: [...data.temperaments, temperamentsId],
    });
    setSelectTemperaments([
      ...selectTemperaments,
      allTemperaments.find((e) => e.id === parseInt(temperamentsId)),
    ]);
  }

  function handleSubmit(e) {
    e.preventDefault();
    // console.log(data);
    if (
      !errors.name &&
      !errors.image &&
      !errors.height_min &&
      !errors.height_max &&
      !errors.weight_min &&
      !errors.weight_min &&
      !errors.years_life &&
      !errors.temperaments
    ) {
      try {
        if (data.name) {
          dispatch(updateDog(id, data));
          Swal.fire({
            title: "Updated!",
            text: "Dog update successfully!",
            icon: "success",
            confirmButtonText: "Ok",
            confirmButtonColor: "green",
            timer: "3000",
          });
          setData({
            name: "",
            height_min: "",
            height_max: "",
            weight_min: "",
            weight_max: "",
            image: "",
            years_life: "",
            temperaments: [],
          });
          setSelectTemperaments([]);
          document.getElementById("form").reset();
          navigate("/home");
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  function handleDelete(e) {
    setData({
      ...data,
      temperaments: data.temperaments.filter((t) => t !== e.target.value),
    });
    setSelectTemperaments(
      selectTemperaments.filter((t) => t.id !== parseInt(e.target.value))
    );
  }

  return (
    <div className="Form_container">
      <h2 className="form_title">UPDATE DOG</h2>
      <p className="datos_obligatorios">Fields with * obligatories</p>

      <form id="form" className="form" action="" onSubmit={handleSubmit}>
        {/* ---- INPUT NAME ---- */}
        <div>
          <div>
            <label>Name *</label>
            <div className={errors.name ? "div_input error" : "div_input"}>
              <input
                className="form_input"
                placeholder="Name Dog"
                onChange={handleChange}
                name="name"
                value={data.name}
              />
            </div>
            {errors.name && (
              <span className="dato_incorrecto">{errors.name}</span>
            )}
          </div>
        </div>

        {/* ---- INPUT HEIGHT ---- */}
        <div className="div_inputs_dobles">
          <div className="max">
            <label>Height Max *</label>
            <div
              className={errors.height_max ? "div_input error" : "div_input"}
            >
              <input
                className="form_input min"
                placeholder="Height Max"
                onChange={handleChange}
                name="height_max"
                value={data.height_max}
              />
              <span className="unidad">cm</span>
            </div>
            {errors.height_max && (
              <span className="dato_incorrecto">{errors.height_max}</span>
            )}
          </div>

          <div className="min">
            <label>Height Min *</label>
            <label className="label_min">Peso</label>
            <div
              className={errors.height_min ? "div_input error" : "div_input"}
            >
              <input
                className="form_input max"
                placeholder="Height Min"
                onChange={handleChange}
                name="height_min"
                value={data.height_min}
              />
              <span className="unidad">cm</span>
            </div>
            {errors.height_min && (
              <span className="dato_incorrecto">{errors.height_min}</span>
            )}
          </div>
        </div>

        {/* ---- INPUT WEIGHT ---- */}
        <div className="div_inputs_dobles">
          <div className="max">
            <label>Weight Max *</label>
            <div
              className={errors.weight_max ? "div_input error" : "div_input"}
            >
              <input
                className="form_input min"
                placeholder="Weight Max"
                onChange={handleChange}
                name="weight_max"
                value={data.weight_max}
              />
              <span className="unidad">kg</span>
            </div>
            {errors.weight_max && (
              <span className="dato_incorrecto">{errors.weight_max}</span>
            )}
          </div>

          <div className="min">
            <label>Weight Min *</label>
            <div
              className={errors.weight_min ? "div_input error" : "div_input"}
            >
              <input
                className="form_input max"
                placeholder="Weight Min"
                onChange={handleChange}
                name="weight_min"
                value={data.weight_min}
              />
              <span className="unidad">kg</span>
            </div>
            {errors.weight_min && (
              <span className="dato_incorrecto">{errors.weight_min}</span>
            )}
          </div>
        </div>

        {/* ---- INPUT YEARS LIFE ---- */}
        <div>
          <div className="max">
            <label>Years Life *</label>
            <div
              className={errors.years_life ? "div_input error" : "div_input"}
            >
              <input
                className="form_input min_years"
                placeholder="Years Life"
                onChange={handleChange}
                name="years_life"
                value={data.years_life}
              />
              <span className="unidad">Years</span>
            </div>
            {errors.years_life && (
              <span className="dato_incorrecto">{errors.years_life}</span>
            )}
          </div>
        </div>

        {/* ---- INPUT IMAGE ---- */}
        <div>
          <label>Image</label>
          <div className="max">
            <div className={errors.image ? "div_input error" : "div_input"}>
              <input
                className="form_input"
                placeholder="Image URL"
                onChange={handleChange}
                name="image"
                value={data.image}
              />
            </div>
            {errors.image && (
              <span className="dato_incorrecto">{errors.image}</span>
            )}
          </div>
        </div>

        {/* ---- INPUT TEMPERAMENTS ---- */}
        <div>
          <label>Temperaments</label>
          <div
            className={errors.temperaments ? "div_input error" : "div_input"}
          >
            <div className="div_input">
              <select
                className="select_form"
                name="temperaments"
                onChange={handleSelect}
              >
                {allTemperaments.map((t, i) => {
                  return (
                    <option className="option_form" key={i} value={t.id}>
                      {t.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="div_form_final_temps">
            <ul className="ul_temp">
              {selectTemperaments?.map((e, i) => {
                return (
                  <li className="li_temp" key={i}>
                    {e.name}
                    <button
                      className="delete_temp"
                      type="button"
                      value={e.id}
                      onClick={handleDelete}
                    >
                      x
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          {errors.temperaments && (
            <span className="dato_incorrecto">{errors.temperaments}</span>
          )}
        </div>

        <input
          className="submit"
          type="submit"
          value="Submit Form"
          disabled={
            errors.name ||
            errors.image ||
            errors.height_min ||
            errors.height_max ||
            errors.weight_min ||
            errors.weight_max ||
            errors.years_life ||
            errors.temperaments
          }
        />
      </form>
    </div>
  );
}

export default Form;
