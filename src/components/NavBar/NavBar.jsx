import React, { useState } from "react";
import Style from "./NavBar.module.css";

import Swal from "sweetalert2";

const NavBar = ({ onSearch }) => {
  const [value, setValue] = useState("");

  const handleSearchValue = (e) => {
    setValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value) {
      Swal.fire({
        title: "Not name!",
        text: "You must write a dog name!",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: "red",
        timer: "3000",
      });
    } else {
      onSearch(value);
      setValue("");
    }
  };

  return (
    <>
      <nav className={Style.navbar}>
        <ul>
          <form className={Style.searchIcon} onSubmit={handleSubmit}>
            <input
              className={Style.searchInput}
              onChange={handleSearchValue} //se va cambiando el valor en el estado local
              value={value}
              type="search"
              placeholder="Search Dogs by name..."
            />
          </form>
        </ul>
      </nav>
    </>
  );
};
export default NavBar;
