import React from "react";

const SignUp = ({usernameSignUp, passwordSignUp, setUserNameSignUp, setPasswordSignUp}) => {
  return (
    <div className="signUpContainer">
      <h4 className="headerText">Join Us Today</h4>
      <div className="inputSection">
        <input 
        type="text" 
        className="userName login" 
        value={usernameSignUp} 
        required 
        onChange={(e) => {
          setUserNameSignUp(e.target.value)
        }}
        />
        <label className="inputLabel">User Name</label>
      </div>
      <div className="inputSection">
        <input 
        type="password" 
        className="password login" 
        value={passwordSignUp} 
        required 
        onChange={(e) => {
          setPasswordSignUp(e.target.value)
        }}
        />
        <label className="inputLabel">Password</label>
      </div>
    </div>
  );
}

export default SignUp;
