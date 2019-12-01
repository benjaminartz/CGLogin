// src/components/NavBar.js

import React from "react";
import './NavBar.css';
import { Link } from 'react-router-dom';

const NavBar = (props) => {

  const logout = () => {
    fetch('/api/logout', () => {
      props.setIsAuthenticatedFunction(false);
    });
  }

  return (
    <div className="NavBar">
      <Link to="/"><img className="logo" src="../cg_logo.svg"></img></Link>

      {!props.isAuthenticated && (
        <>
          <Link to="/login" className="cg-button cg-button-primary auth-button">Log in</Link>
          <Link to="/signup" className="cg-button cg-button-secondary auth-button">Sign up</Link>
        </>
      )}

      {props.isAuthenticated && (
        <>
          <a href="/" className="cg-button cg-button-secondary auth-button" onClick={() => logout()}>Log out</a>
          <Link to="/profile" title="View your profile" className="cg-button cg-button-secondary auth-button" style={{padding: '6px 9px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 30 30" style={{fill: '#333132' }}>
              <path d="M18,19v-2c0.45-0.223,1.737-1.755,1.872-2.952c0.354-0.027,0.91-0.352,1.074-1.635c0.088-0.689-0.262-1.076-0.474-1.198 c0,0,0.528-1.003,0.528-2.214c0-2.428-0.953-4.5-3-4.5c0,0-0.711-1.5-3-1.5c-4.242,0-6,2.721-6,6c0,1.104,0.528,2.214,0.528,2.214 c-0.212,0.122-0.562,0.51-0.474,1.198c0.164,1.283,0.72,1.608,1.074,1.635C10.263,15.245,11.55,16.777,12,17v2c-1,3-9,1-9,8h24 C27,20,19,22,18,19z"></path>
            </svg>
          </Link>
        </>
      )}
    </div>
  );
};

export default NavBar;
