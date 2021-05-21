import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userActions } from "../actions/userActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const { userInfo, userDetailLoading, userDetails, userDetailsError } =
    useSelector((state) => state.user);
  const { userUpdateLoading, userUpdateState } = useSelector(
    (state) => state.user
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [sellerName, setSellerName] = useState("");
  const [sellerLogo, setSellerLogo] = useState("");
  const [sellerDescription, setSellerDescription] = useState("");
  const [loadingUpload, setLoadingUpload] = useState("");
  const [errorUpload, setErrorUpload] = useState("");

  useEffect(() => {
    setName(userDetails.name);
    setEmail(userDetails.email);
    if (userDetails.isSeller) {
      setSellerName(userDetails.seller.name);
      setSellerLogo(userDetails.seller.logo);
      setSellerDescription(userDetails.seller.description);
    }
  }, [userDetails]);

  useEffect(() => {
    console.log(userInfo);
    if (userInfo._id) {
      dispatch(userActions.getUserDetails(userInfo._id));
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    await dispatch(
      userActions.updateUserDetails(
        userInfo._id,
        name,
        email,
        password,
        sellerName,
        sellerLogo,
        sellerDescription
      )
    );
    // dispatch(userActions.getUserDetails(userInfo._id));
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("image", file);
    setLoadingUpload(true);
    try {
      let { data } = await axios.post("/api/uploads/s3", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      console.log(data);
      setLoadingUpload(false);
      setSellerLogo(data);
    } catch (error) {
      setErrorUpload(error.message);
      setLoadingUpload(false);
    }
  };

  return (
    <div>
      {userDetailLoading ? (
        <LoadingBox />
      ) : userDetailsError ? (
        <MessageBox variant="danger">{userDetailsError}</MessageBox>
      ) : (
        <form className="form" onSubmit={submitHandler}>
          <div>
            <h1>User Profile</h1>
          </div>
          {userUpdateLoading && <LoadingBox />}
          {userUpdateState && (
            <MessageBox variant="success">Profile Updated</MessageBox>
          )}
          <>
            <div>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="text"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="text"
                placeholder="Enter Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {userInfo && Object.keys(userInfo).length && userInfo.isSeller && (
              <>
                <h2>Seller</h2>
                <div>
                  <label htmlFor="sellerName">Seller Name</label>
                  <input
                    id="sellerName"
                    type="text"
                    placeholder="Enter Seller Name"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="sellerLogo">Seller Logo</label>
                  <input
                    id="sellerLogo"
                    type="text"
                    placeholder="Enter Seller Logo"
                    value={sellerLogo}
                    onChange={(e) => setSellerLogo(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="imageFile">Image File</label>
                  <input
                    id="imageFile"
                    type="file"
                    placeholder="Choose Image"
                    onChange={uploadFileHandler}
                  />
                  {loadingUpload && <LoadingBox></LoadingBox>}
                  {errorUpload && (
                    <MessageBox variant="danger">{errorUpload}</MessageBox>
                  )}
                </div>
                <div>
                  <label htmlFor="sellerDescription">Seller Description</label>
                  <input
                    id="sellerDescription"
                    type="text"
                    placeholder="Enter Seller Description"
                    value={sellerDescription}
                    onChange={(e) => setSellerDescription(e.target.value)}
                  />
                </div>
              </>
            )}
            <div>
              <label></label>
              <button className="primary" type="submit">
                Update Profile
              </button>
            </div>
          </>
        </form>
      )}
    </div>
  );
};

export default ProfileScreen;
