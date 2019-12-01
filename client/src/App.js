// src/App.js

import React from "react";
import NavBar from "./components/NavBar";
import LandingPage from "./pages/LandingPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import YourProfilePage from "./pages/YourProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import { Route, Switch } from 'react-router-dom';
import './App.css';

function App() {

  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  fetch("/api/amiloggedin")
    .then(res => res.json())
    .then(res => {
      if (res.success)
        setIsAuthenticated(true);
    })
    .catch(err => console.log(err));

  return (
    <div className="App">
      <header>
        <NavBar isAuthenticated={isAuthenticated} setIsAuthenticatedFunction={setIsAuthenticated} />
      </header>
      <Switch>
        <Route path="/signup" render={(props)=> <SignupPage {...props} setIsAuthenticatedFunction={setIsAuthenticated} />} />
        <Route path="/login" render={(props) => <LoginPage {...props} setIsAuthenticatedFunction={setIsAuthenticated} />} />
        <Route path="/profile" component={YourProfilePage}/>
        <Route path="/edit" component={EditProfilePage}/>
        <Route path="/" render={(props) => <LandingPage {...props} isAuthenticated={isAuthenticated} />} />
      </Switch>
    </div>
  );
}

export default App;
