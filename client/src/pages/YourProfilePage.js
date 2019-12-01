// src/pages/SignupPage.js

import React, {useState, useEffect} from "react";
import { Link, Redirect } from 'react-router-dom';
import "./YourProfilePage.css";

var md5 = require("md5");

const SignupPage = () => {
  const  [hasError, setErrors] = useState(false);
  const  [user, setUser]= useState({});
  const avatar = "";

  useEffect(() => {
    fetch("/api/profile")
      .then(res => res.json())
      .then(user => {
        if (!user.email)
          setErrors("Unauthorized");
        user.avatar = md5(user.email.toLowerCase().trim());
        setUser(user);
      })
      .catch(err => setErrors(err));
  }, []);

  if (hasError) {
    return <Redirect to="/login" />
  }

  return (
    <div className="main">
      <div className="glow">
        <h1 className="text-red">Your Profile</h1>
        <div className="user-card">
          <Link to="/edit" className="cg-fab" title="Edit Profile">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7.127 22.562l-7.127 1.438 1.438-7.128 5.689 5.69zm1.414-1.414l11.228-11.225-5.69-5.692-11.227 11.227 5.689 5.69zm9.768-21.148l-2.816 2.817 5.691 5.691 2.816-2.819-5.691-5.689z"/></svg>
          </Link>
          <div className="profile-pic">
            <img src={`http://gravatar.com/avatar/${user.avatar}?s=300&d=mp`}></img>
          </div>
          <div className="profile-info">
            <div className="name">{user.fname} {user.lname}</div>
            <div className="dance">{user.dance} Dancer</div>
            <div className="email"><a href={"mailto:" + user.email}>{user.email}</a></div>
            <div className="comments">{user.comments}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
