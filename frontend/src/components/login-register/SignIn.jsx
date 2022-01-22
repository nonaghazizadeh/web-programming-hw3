import React from "react";

class SignIn extends React.Component {
  render() {
    return (
      <div className="signInContainer">
        <h4 className="headerText">Welcome Back</h4>
        <div className="inputSection">
          <input type="text" className="userName login" required />
          <label className="inputLabel">User Name</label>
        </div>
        <div className="inputSection">
          <input type="text" className="password login" required />
          <label className="inputLabel">Password</label>
        </div>
      </div>
    );
  }
}

export default SignIn;
