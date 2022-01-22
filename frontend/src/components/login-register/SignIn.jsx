import React from "react";

const SignIn = ({usernameSignIn, passwordSignIn, setUserNameSignIn, setPasswordSignIn}) => {
  return (
    <div className="signInContainer">
      <h4 className="headerText">Welcome Back</h4>
      <div className="inputSection">
        <input 
          type="text" 
          className="userName login" 
          value={usernameSignIn} 
          required 
          onChange={(e) => {
            setUserNameSignIn(e.target.value)
          }}
        />
        <label className="inputLabel">User Name</label>
      </div>
      <div className="inputSection">
        <input 
          type="text" 
          className="password login" 
          value={passwordSignIn} 
          required 
          onChange={(e) => {
            setPasswordSignIn(e.target.value)
        }}

        />
        <label className="inputLabel">Password</label>
      </div>
    </div>
  );
}

export default SignIn;
