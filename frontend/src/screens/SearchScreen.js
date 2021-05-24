/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { productActions } from "../actions/productActions";
import { categoryActions } from "../actions/categoryActions.js";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Product from "../components/Product";
import { Link } from "react-router-dom";
import { prices, ratings } from "../utils";
import Rating from "../components/Rating";

const SearchScreen = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    name = "all",
    category = "all",
    min = 0,
    max = 0,
    rating = 0,
    order = "newest",
    pagenumber = 1,
  } = useParams();

  const { productLoading, products, page, pages, errorText } = useSelector(
    (state) => state.product
  );

  const { categoryLoading, categories, categoryError } = useSelector(
    (state) => state.category
  );

  useEffect(() => {
    dispatch(categoryActions.listCategories());
  }, []);

  console.log(category);
  useEffect(() => {
    dispatch(
      productActions.listProducts(
        pagenumber,
        {},
        { name: name !== "all" ? name : "" },
        { category: category !== "all" ? category : "" },
        min,
        max,
        rating,
        order
      )
    );
  }, [name, category, min, max, rating, order, pagenumber]);

  const getFilterUrl = (filter) => {
    console.log(filter);
    const filterPageNum = filter.page || page;
    const filterCategory = filter.category || category;
    const filterName = filter.name || name;
    const filterMin = filter.min ? filter.min : filter.min === 0 ? 0 : min;
    const filterMax = filter.max || max;
    const filterRating = filter.rating || rating;
    const sortOrder = filter.order || order;
    // console.log(filterMin, filterMax);
    return `/search/category/${filterCategory}/name/${filterName}/min/${filterMin}/max/${filterMax}/rating/${filterRating}/order/${sortOrder}/page-number/${filterPageNum}`;
  };

  return (
    <div>
      <div className="row m-1">
        {productLoading ? (
          <LoadingBox />
        ) : errorText ? (
          <MessageBox variant="danger">{errorText}</MessageBox>
        ) : (
          <div>{products.length} Results</div>
        )}
        <div>
          Sort By{" "}
          <select
            name="sortorder"
            value={order}
            onChange={(e) =>
              history.push(getFilterUrl({ order: e.target.value }))
            }
          >
            <option value="newest">Newest Arrival</option>
            <option value="lowest">Price: Low to High</option>
            <option value="highest">Price: High to Low</option>
            <option value="toprated">Avg. Customer Reviews</option>
          </select>
        </div>
      </div>
      <div className="row top m-1">
        <div className="col-1 ">
          <h1>Department</h1>
          <div>
            {categoryLoading ? (
              <LoadingBox />
            ) : categoryError ? (
              <MessageBox variant="danger">{categoryError}</MessageBox>
            ) : (
              <>
                {categories.length === 0 && (
                  <MessageBox>No Product Found</MessageBox>
                )}
                <ul>
                  <li className={"all" === category ? "active" : ""}>
                    <Link to={getFilterUrl({ category: "all" })}>{"Any"}</Link>
                  </li>
                  {categories &&
                    categories.map((cat) => (
                      <li
                        key={cat._id}
                        className={cat._id === category ? "active" : ""}
                      >
                        <Link to={getFilterUrl({ category: cat._id })}>
                          {cat.name}
                        </Link>
                      </li>
                    ))}
                </ul>
              </>
            )}
          </div>
          <h1>Prices</h1>
          <div>
            <ul>
              {prices.map((p) => (
                <li key={p.name}>
                  <Link
                    to={getFilterUrl({ min: p.min, max: p.max })}
                    className={
                      `${p.min} -${p.max}` === `${min} -${max}` ? "active" : ""
                    }
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <h1>Avg. Customer Review</h1>
          <div>
            <ul>
              {ratings.map((r) => (
                <li key={r.name}>
                  <Link
                    to={getFilterUrl({ rating: r.rating })}
                    className={`${r.rating}` === rating ? "active" : ""}
                  >
                    <Rating caption={" & up"} rating={r.rating} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-3">
          {productLoading ? (
            <LoadingBox />
          ) : errorText ? (
            <MessageBox variant="danger">{errorText}</MessageBox>
          ) : (
            <>
              <div className="row center">
                {products.length === 0 && (
                  <MessageBox>No Product Found</MessageBox>
                )}
                <div className="row center">
                  {products &&
                    products.map((product) => (
                      <Product key={product.id} product={product} />
                    ))}
                </div>
              </div>
              <div className="row center pagination">
                {[...Array(pages).keys()].map((pageNum) => (
                  <Link
                    className={pageNum + 1 === page ? "active" : ""}
                    key={pageNum}
                    to={getFilterUrl({ page: pageNum + 1 })}
                  >
                    {pageNum + 1}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchScreen;
