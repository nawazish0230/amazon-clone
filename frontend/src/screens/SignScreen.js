import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { userActions } from "../actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { useHistory } from "react-router";

const SignScreen = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const redirect = location.search ? location.search.split("=")[1] : "/";

  const { loading, userInfo, errorMsg } = useSelector((state) => state.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(userActions.signIn(email, password));
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
          <h1>Sign In</h1>
        </div>
        {loading && <LoadingBox />}
        {errorMsg && <MessageBox variant="danger">{errorMsg}</MessageBox>}
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
          <label></label>
          <button type="submit" className="primary">
            Sign In
          </button>
        </div>
        <div>
          <label></label>
          <div>
            New Customer ?{" "}
            <Link to={`register?redirect=${redirect}`}>Create and account</Link>
          </div>
        </div>
      </form>
      )
    </div>
  );
};

export default SignScreen;
