import React from 'react';
import Style from './NotFound.module.css'
import {NavLink} from 'react-router-dom'


const NotFound = () => {
  return(
    <div className={Style.container}>
      <div className={Style.bg}>
        <div className={Style.btnAlign}>
        <NavLink to='/home'>
         <button className={Style.button}>Back Home</button>
        </NavLink> 
        </div>
      </div>
    </div>



  )
}
export default NotFound;
