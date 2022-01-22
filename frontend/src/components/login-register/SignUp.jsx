import React from "react";

class SignUp extends React.Component {
  render() {
    return (
      <div className="signUpContainer">
        <h4 className="headerText">Join Us Today</h4>
        <div className="inputSection">
          <input type="text" className="userName login" required />
          <label className="inputLabel">User Name</label>
        </div>
        <div className="inputSection">
          <input type="password" className="password login" required />
          <label className="inputLabel">Password</label>
        </div>
      </div>
    );
  }
}
export default SignUp;
