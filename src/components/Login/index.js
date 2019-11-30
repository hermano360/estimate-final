import React from "react";
import Loadable from "react-loading-overlay";
import { Button, ControlLabel, FormControl } from "react-bootstrap";

import enhance from "./enhance";
import logo from "../../assets/images/ezestimator_logo.png";

const Login = ({
  username,
  password,
  error,
  setUserName,
  setPassword,
  handleSubmit,
  busy
}) => (
  <Loadable active={busy} spinner text={`Loading`}>
    <div className="c-home-body">
      <img src={logo} alt="Estimate Logo" className="c-home-logo" />
      <form>
        <ControlLabel>Name</ControlLabel>
        <FormControl
          value={username}
          onChange={setUserName}
          style={{ textAlign: "center" }}
        />
        <ControlLabel>Password</ControlLabel>
        <FormControl
          value={password}
          type="password"
          onChange={setPassword}
          style={{ textAlign: "center" }}
        />
        {error && <div style={{ color: "red" }}>error</div>}
        <Button onClick={handleSubmit}>Submit</Button>
      </form>
    </div>
  </Loadable>
);

export default enhance(Login);
