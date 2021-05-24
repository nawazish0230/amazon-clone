/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import LoadingBox from "../../../components/LoadingBox";
import MessageBox from "../../../components/MessageBox";
import { categoryActions } from "../../../actions/categoryActions";

const EditCategoryScreen = ({ match }) => {
  let categoryId = match.params && match.params.id;
  const dispatch = useDispatch();
  const history = useHistory();

  const productList = useSelector((state) => state.product);
  const { productDetailsLoading, product, errorText } = productList;

  const [name, setName] = useState(product.name ? product.name : "");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [errorUpload, setErrorUpload] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(async () => {
    let res = await dispatch(categoryActions.getCategoryById(categoryId));
    // console.log(res);
    setName(res.name);
    setImage(res.image);
    setDescription(res.description);
  }, [dispatch]);

  const submitHandler = async (e) => {
    setLoading(true);
    e.preventDefault();
    let resp = await dispatch(
      categoryActions.updateCategory(categoryId, {
        name,
        image,
        description,
      })
    );
    console.log(resp);
    setLoading(false);
    if (resp && resp.statusCode === 200) {
      setSuccessMsg(resp.message);
      setErrorMsg("");
      // clearForm();
      setTimeout(() => {
        history.push("/category-list");
      }, 1000);
    } else {
      setErrorMsg(resp.message);
    }
  };

  // const clearForm = () => {
  //   setName("");
  //   setCategory("");
  //   setBrand("");
  //   setCountInStock("");
  //   setPrice("");
  //   setDescription("");
  //   setTimeout(() => {}, 2000);
  // };

  const uploadFileHandler = async (e) => {
    console.log(e);
    console.log(e.target.files[0]);
    let resp = await dispatch(categoryActions.uploadImage(e.target.files[0]));
    console.log(resp);
    if (resp.statusCode === 200) {
      setImage(resp.result.imageUrl);
    } else {
      setErrorUpload(resp);
      setTimeout(() => {
        setErrorUpload("");
      }, 4000);
    }
  };

  return (
    <div>
      (
      <form className="form" onSubmit={submitHandler}>
        <div>
          <Link to="/category-list">
            <i className="fa fa-arrow-left" aria-hidden="true"></i> Go Back
          </Link>
          <h1>Edit Category</h1>
        </div>
        {productDetailsLoading || (loading && <LoadingBox />)}
        {errorMsg ? (
          <MessageBox variant="danger">{errorMsg}</MessageBox>
        ) : errorText ? (
          <MessageBox variant="danger">{errorText}</MessageBox>
        ) : (
          <MessageBox variant="success">{successMsg}</MessageBox>
        )}
        <div>
          <label htmlFor="name">Category Title</label>
          <input
            id="name"
            type="text"
            placeholder="Enter Title"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="image">Image</label>
          <input
            id="image"
            type="text"
            placeholder="Enter Image"
            disabled
            value={image}
            onChange={(e) => setImage(e.target.value)}
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
          {errorUpload && (
            <MessageBox variant="danger">{errorUpload}</MessageBox>
          )}
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            type="text"
            placeholder="Enter Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label></label>
          <button type="submit" className="primary">
            Update Category
          </button>
        </div>
      </form>
      )
    </div>
  );
};

export default EditCategoryScreen;
