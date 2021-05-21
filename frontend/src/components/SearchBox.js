import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const SearchBox = () => {
  const history = useHistory();
  const [name, setName] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    history.push(`/search/name/${name}`);
  };

  return (
    <form className=" search" onSubmit={submitHandler}>
      <div className="row">
        <input
          type="text"
          name="search"
          id="search"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="primary" type="submit">
          <i className="fa fa-search"></i>
        </button>
      </div>
    </form>
  );
};

export default SearchBox;
