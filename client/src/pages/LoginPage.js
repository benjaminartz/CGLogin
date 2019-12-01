// src/pages/SignupPage.js

import React from "react";
import { Redirect } from 'react-router-dom';

const LoginPage = (props) => {

  const [state, setState] = React.useState({
    created: false,
    error: false,
    redirect: false,
    email: "",
    password: ""
  });

  const submitForm = () => {
    return false;
  }

  const handleChange = (e) => {
    setState({...state, [e.target.name]: e.target.value});
  }

  const handleSubmit = async (event) => {
      event.preventDefault();
      const theFetch = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(state),
      });
      if (!theFetch.ok) {
        setState({...state, error: "Invalid username/password. Please try again."});
        return;
      }
      const responseJson = await theFetch.json();
      if (responseJson.success) {
        props.setIsAuthenticatedFunction(true)
        setState({redirect: true})
      } else {
        setState({...state, error: "Invalid username/password. Please try again."})
      }
  }

  if (state.redirect) {
    return (<Redirect to={{pathname: '/profile'}} />)
  }

  return (
    <div className="main">
      <div className="glow">
        <h1 className="text-red">Please log in!</h1>
        {state.error && <div className="error">{state.error}</div>}
        {state.created && <div className="success">Your account was created successfully. You can now log in.</div>}
        <form className="glow" onSubmit={handleSubmit} >
          <label>Email</label>
          <input name="email" type="email" value={state.email} required onChange={handleChange}></input>
          <label>Password</label>
          <input name="password" type="password" value={state.password} required onChange={handleChange}></input>
          <button className="cg-button cg-button-primary" onClick={submitForm}>Log in</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
