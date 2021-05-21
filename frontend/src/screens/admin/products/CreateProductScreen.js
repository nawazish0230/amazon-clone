import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { categoryActions } from "../../../actions/categoryActions";
import { productActions } from "../../../actions/productActions";
import LoadingBox from "../../../components/LoadingBox";
import MessageBox from "../../../components/MessageBox";

const CreateProductScreen = () => {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { categories } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(categoryActions.listCategories());
  }, []);

  const submitHandler = async (e) => {
    setLoading(true);
    e.preventDefault();
    let resp = await dispatch(
      productActions.createProduct(
        name,
        category,
        brand,
        countInStock,
        price,
        description
      )
    );
    console.log(resp);
    if (resp && resp.statusCode === 200) {
      setSuccessMsg("Product created Successfully");
      setErrorMsg("");
      clearForm();
    } else {
      setErrorMsg(resp.message);
    }
    setLoading(false);
  };

  const clearForm = () => {
    setName("");
    setCategory("");
    setBrand("");
    setCountInStock("");
    setPrice("");
    setDescription("");
    setTimeout(() => {
      setSuccessMsg("");
    }, 3000);
  };

  return (
    <div>
      (
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Create Product</h1>
        </div>
        {loading && <LoadingBox />}
        {errorMsg ? (
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
          <label htmlFor="password">Category</label>
          <select
            name="category"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories &&
              categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
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
            Create Product
          </button>
        </div>
      </form>
      )
    </div>
  );
};

export default CreateProductScreen;
