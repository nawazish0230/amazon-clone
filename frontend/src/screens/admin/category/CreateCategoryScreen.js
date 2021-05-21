import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { categoryActions } from "../../../actions/categoryActions.js";
import LoadingBox from "../../../components/LoadingBox";
import MessageBox from "../../../components/MessageBox";

const CreateCategoryScreen = () => {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const submitHandler = async (e) => {
    setLoading(true);
    e.preventDefault();
    let resp = await dispatch(
      categoryActions.createCategory(name, description)
    );
    console.log(resp);
    if (resp && resp.statusCode === 200) {
      setSuccessMsg("Category created Successfully");
      setErrorMsg("");
      clearForm();
    } else {
      setErrorMsg(resp.message);
    }
    setLoading(false);
  };

  const clearForm = () => {
    setName("");
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
          <h1>Create Category</h1>
        </div>
        {loading && <LoadingBox />}
        {errorMsg ? (
          <MessageBox variant="danger">{errorMsg}</MessageBox>
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
            Create Category
          </button>
        </div>
      </form>
      )
    </div>
  );
};

export default CreateCategoryScreen;
