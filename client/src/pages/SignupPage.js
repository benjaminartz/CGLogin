// src/pages/SignupPage.js

import React from "react";
import { Redirect } from 'react-router-dom';

const SignupPage = (props) => {

  const [state, setState] = React.useState({
    redirect: false,
    email: "",
    password: "",
    fname: "",
    lname: "",
    dance: "Contemporary",
    comments: ""
  });

  const submitForm = () => {
    return false;
  }

  const handleChange = (e) => {
    setState({...state, [e.target.name]: e.target.value});
  }

  const handleSubmit = async (event) => {
      event.preventDefault();
      const theFetch = await fetch('/api/account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(state),
      });
      if (!theFetch.ok) {
        setState({...state, error: "Oops, looks like an error happened. Maybe try a different email address?"});
        return;
      }
      const responseJson = await theFetch.json();
      if (responseJson.success) {
        props.setIsAuthenticatedFunction(true);
        setState({redirect: true});
      } else {
        setState({...state, error: "Oops, looks like an error happened. Maybe try a different email address?"})
      }
  }

  if (state.redirect) {
    return (<Redirect to={{pathname: '/profile'}} />)
  }

  return (
    <div className="main">
      <div className="glow">
        <h1 className="text-red">Let's get you signed up!</h1>
        {state.error && <div className="error">{state.error}</div>}
        <form onSubmit={handleSubmit} >
          <label>Email</label>
          <input name="email" type="email" value={state.email} required onChange={handleChange}></input>
          <label>Password</label>
          <input name="password" type="password" value={state.password} required onChange={handleChange}></input>
          <label>First Name</label>
          <input name="fname" type="text" value={state.fname} required onChange={handleChange}></input>
          <label>Last Name</label>
          <input name="lname" type="text" value={state.lname} required onChange={handleChange}></input>
          <label>Favorite Dance Style</label>
          <select name="dance" value={state.dance} required onChange={handleChange}>
            <option>Contemporary</option>
            <option>Ballet</option>
            <option>Jazz</option>
            <option>Tap</option>
            <option>Hip-hop</option>
            <option>Ballroom</option>
            <option>Latin</option>
            <option>Swing</option>
            <option>Country</option>
          </select>
          <label>Comments</label>
          <textarea name="comments" value={state.comments} maxLength="500" required onChange={handleChange}></textarea>
          <div className="chars-remaining text-red">{(state.comments?500 - state.comments.length:500)}</div>
          <button className="cg-button cg-button-primary" onClick={submitForm}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
