import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { userActions } from "../actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { useHistory } from "react-router";

const RegisterScreen = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const redirect = location.search ? location.search.split("=")[1] : "/";

  const { loading, userInfo, errorMsg } = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return alert("password dont match");
    }
    dispatch(userActions.register(name, email, password));
  };

  useEffect(() => {
    if (userInfo && Object.keys(userInfo).length > 0) {
      history.push(redirect);
    }
  }, [userInfo]);

  return (
    <div>
      (
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Create Account</h1>
        </div>
        {loading && <LoadingBox />}
        {errorMsg && <MessageBox variant="danger">{errorMsg}</MessageBox>}
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="text"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Confirm Password</label>
          <input
            id="password"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label></label>
          <button type="submit" className="primary">
            Register
          </button>
        </div>
        <div>
          <label></label>
          <div>
            Already have account ?{" "}
            <Link to={`signin?redirect=${redirect}`}>Sign In</Link>
          </div>
        </div>
      </form>
      )
    </div>
  );
};

export default RegisterScreen;
