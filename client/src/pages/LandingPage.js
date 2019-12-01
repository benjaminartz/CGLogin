// src/pages/LandingPage.js

import React from "react";
import { Link } from 'react-router-dom';

const LandingPage = (props) => {

  return (
    <div className="main">
      <div className="glow">
        <h1 className="text-red">Thank you!</h1>
        <p>Thank you for considering Ben for this Full Stack position!</p>
        <div>
          {!props.isAuthenticated && <h2 className="text-red">You are currently logged out!</h2>}
          {props.isAuthenticated && <h2 className="text-red">You are currently logged in!</h2>}
        </div>
        {!props.isAuthenticated && <div>
                              <p>Don't have an account?</p>
                              <div className="center">
                                <Link to="/signup" className="cg-button cg-button-primary auth-button">Sign up now!</Link>
                              </div>
                            </div>}
      </div>
    </div>
  );
};

export default LandingPage;
