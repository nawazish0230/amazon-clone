/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { productActions } from "../../../actions/productActions";
import LoadingBox from "../../../components/LoadingBox";
import MessageBox from "../../../components/MessageBox";
import axios from "axios";

const EditProductScreen = ({ match }) => {
  let productId = match.params && match.params.id;
  const dispatch = useDispatch();
  const history = useHistory();

  const { userInfo } = useSelector((state) => state.user);
  const productList = useSelector((state) => state.product);
  const { productDetailsLoading, product, errorText } = productList;

  const [name, setName] = useState(product.name ? product.name : "");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loadingUpload, setLoadingUpload] = useState("");
  const [errorUpload, setErrorUpload] = useState("");

  useEffect(async () => {
    await dispatch(productActions.detailsProduct(productId));
    setName(product.name);
    setCategory(product.category);
    setBrand(product.brand);
    setCountInStock(product.countInStock);
    setPrice(product.price);
    setDescription(product.description);
  }, []);

  const submitHandler = async (e) => {
    setLoading(true);
    e.preventDefault();
    let resp = await dispatch(
      productActions.updateProduct(productId, {
        name,
        image,
        category,
        brand,
        countInStock,
        price,
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
        history.push("/products-list");
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
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("image", file);
    setLoadingUpload(true);
    try {
      let { data } = await axios.post("/api/uploads", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      console.log(data);
      setLoadingUpload(false);
      setImage(data);
    } catch (error) {
      setErrorUpload(error.message);
      setLoadingUpload(false);
    }
  };

  return (
    <div>
      (
      <form className="form" onSubmit={submitHandler}>
        <div>
          <Link to="/products-list">
            <i className="fa fa-arrow-left" aria-hidden="true"></i> Go Back
          </Link>
          <h1>Edit Product</h1>
        </div>
        {productDetailsLoading || (loading && <LoadingBox />)}
        {errorMsg ? (
          <MessageBox variant="danger">{errorMsg}</MessageBox>
        ) : errorText ? (
          <MessageBox variant="danger">{errorMsg}</MessageBox>
        ) : (
          <MessageBox variant="success">{successMsg}</MessageBox>
        )}
        <div>
          <label htmlFor="name">Product Title</label>
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
          {loadingUpload && <LoadingBox></LoadingBox>}
          {errorUpload && (
            <MessageBox variant="danger">{errorUpload}</MessageBox>
          )}
        </div>
        <div>
          <label htmlFor="password">Category</label>
          <select
            name="category"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Pants">Pants</option>
            <option value="Shirts">Shirt</option>
          </select>
        </div>
        <div>
          <label htmlFor="price">Price</label>
          <input
            id="price"
            type="number"
            placeholder="Enter Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="countInStock">Stock Count</label>
          <input
            id="countInStock"
            type="number"
            placeholder="Enter Stock Count"
            value={countInStock}
            onChange={(e) => setCountInStock(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="brand">Brand</label>
          <input
            id="brand"
            type="text"
            placeholder="Enter Brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
          />
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
            Update Product
          </button>
        </div>
      </form>
      )
    </div>
  );
};

export default EditProductScreen;
