// Login.js

import React, { useState } from "react";
import "../style/Login.css"; // Import the CSS file for styling
import Logo from "../assets/images/banner.svg";
import { doGet, doPost, getToken } from "../api/callAPI";
// import { useNavigate } from 'react-router-dom'

const Login = ({tokenGeneratedSuccessfully}) => {
    // const history = useNavigate()
    // State variables to store username and password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  const login = async () =>{
    // history.push("/home")
    if(username && password){
      const res = await getToken(username, password);
      if(!res){
        alert("Incorrect credentials!");
      }else{
        tokenGeneratedSuccessfully();
      }
      console.log(res);
    }else{
        alert("Please enter username and password");
    }
  }

  return (
    <div className="center">
        <img src={Logo} alt="" className="logo" />
      <div className="login-container">
        <h2>Login</h2>
        <form>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="button" onClick={login}>Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
