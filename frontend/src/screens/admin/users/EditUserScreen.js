/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { userActions } from "../../../actions/userActions";
import LoadingBox from "../../../components/LoadingBox";
import MessageBox from "../../../components/MessageBox";

const EditUserScreen = ({ match }) => {
  let userId = match.params && match.params.id;
  const dispatch = useDispatch();
  const history = useHistory();

  const userList = useSelector((state) => state.user);
  const { userDetailLoading, userDetails, userDetailsError } = userList;

  const [name, setName] = useState(userDetails.name ? userDetails.name : "");
  const [email, setEmail] = useState("");
  const [admin, setAdmin] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [seller, setSeller] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(async () => {
    await dispatch(userActions.getUserDetails(userId));
    setName(userDetails.name);
    setAdmin(userDetails.isAdmin);
    setEmail(userDetails.email);
    setBlocked(userDetails.isBlocked);
    setSeller(userDetails.isSeller);
  }, []);

  const submitHandler = async (e) => {
    // console.log(
    //   name,
    //   email,
    //   admin === "false" ? false : true,
    //   blocked === "false" ? false : true,
    //   seller === "false" ? false : true
    // );
    // console.log(name, email, admin, blocked, seller);
    setLoading(true);
    e.preventDefault();
    let resp = await dispatch(
      userActions.updateUser(userId, {
        name,
        email,
        admin,
        blocked,
        seller,
      })
    );
    console.log(resp);
    setLoading(false);
    if (resp && resp.statusCode === 200) {
      setSuccessMsg(resp.message);
      setErrorMsg("");
      // clearForm();
      setTimeout(() => {
        history.push("/users-list");
      }, 1000);
    } else {
      setErrorMsg(resp.message);
    }
  };

  // const clearForm = () => {
  //   setName("");
  //   setAdmin("");
  //   setEmail("");
  //   setBlocked("");
  //   setSeller("");
  //   setTimeout(() => {}, 2000);
  // };

  return (
    <div>
      (
      <form className="form" onSubmit={submitHandler}>
        <div>
          <Link to="/users-list">
            <i className="fa fa-arrow-left" aria-hidden="true"></i> Go Back
          </Link>
          <h1>Edit User</h1>
        </div>
        {userDetailLoading || (loading && <LoadingBox />)}
        {errorMsg ? (
          <MessageBox variant="danger">{errorMsg}</MessageBox>
        ) : userDetailsError ? (
          <MessageBox variant="danger">{errorMsg}</MessageBox>
        ) : (
          <MessageBox variant="success">{successMsg}</MessageBox>
        )}
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
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div
          onChange={() => {
            console.log(admin);
            setAdmin((admin) => !admin);
          }}
        >
          <label>Select Admin</label>
          <div className="flex">
            <div className="flex ">
              <label htmlFor="admin" className="cursor-pointer">
                <input
                  id="admin"
                  type="radio"
                  name="adminStatus"
                  value={true}
                  checked={admin ? true : false}
                />
                Admin
              </label>
            </div>
            <div className="flex ml-1 cursor-pointer">
              <label htmlFor="user" className="cursor-pointer">
                <input
                  id="user"
                  type="radio"
                  name="adminStatus"
                  value={false}
                  checked={admin ? false : true}
                />
                User
              </label>
            </div>
          </div>
        </div>

        <div onChange={() => setBlocked((blocked) => !blocked)}>
          <label>Select Status</label>
          <div className="flex">
            <div className="flex ">
              <label htmlFor="block" className="cursor-pointer">
                <input
                  id="block"
                  type="radio"
                  name="status"
                  value={true}
                  checked={blocked ? true : false}
                />
                Block
              </label>
            </div>
            <div className="flex ml-1 cursor-pointer">
              <label htmlFor="Unblock" className="cursor-pointer">
                <input
                  id="Unblock"
                  type="radio"
                  name="status"
                  value={false}
                  checked={blocked ? false : true}
                />
                Unblock
              </label>
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="seller">Seller</label>
          <input
            id="seller"
            type="checkbox"
            placeholder="Seller"
            checked={seller ? true : false}
            value={seller}
            onChange={() => {
              setSeller((seller) => !seller);
            }}
          />
        </div>
        <div>
          <label></label>
          <button type="submit" className="primary">
            Update Product
          </button>
        </div>
      </form>
      )
    </div>
  );
};

export default EditUserScreen;
