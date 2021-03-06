import React, { useEffect } from "react";
import Product from "../components/Product";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useDispatch, useSelector } from "react-redux";
import { productActions } from "../actions/productActions";
import { Link } from "react-router-dom";
import { userActions } from "../actions/userActions";

const HomeScreen = () => {
  // const [products, setProducts] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const { topSellerLoading, topSellers } = useSelector((state) => state.user);
  const { categoryLoading, categories, categoryError } = useSelector(
    (state) => state.category
  );

  const productList = useSelector((state) => state.product);
  const { productLoading, products, errorText } = productList;

  useEffect(() => {
    dispatch(productActions.listProducts());
    dispatch(userActions.getTopSellers());
    // console.log(productList);
  }, []);

  return (
    <main>
      <h2>Top Products</h2>
      {topSellerLoading ? (
        <LoadingBox></LoadingBox>
      ) : (
        <Carousel showArrows autoPlay showThumbs={false}>
          {topSellers &&
            topSellers.map((sel) => (
              <Link
                key={sel._id}
                to={`/seller/${sel._id}`}
                className="text-center"
              >
                <img
                  src={sel.seller.logo}
                  alt={sel.seller.description}
                  height={"100%"}
                  width={"100%"}
                />
              </Link>
            ))}
        </Carousel>
      )}

      <h2>Category </h2>
      {categoryLoading ? (
        <LoadingBox />
      ) : categoryError ? (
        <MessageBox variant="danger">{categoryError}</MessageBox>
      ) : (
        <div className="row center">
          {categories &&
            categories.map((category) => (
              <Link key={category._id} to={`/category/${category._id}`}>
                <div className="col-1 mx-2 card">
                  <img
                    src={category.image}
                    alt="category image"
                    width="300px"
                    height="300px"
                  />
                  <h1 className="p-1">{category.name}</h1>
                </div>
              </Link>
            ))}
        </div>
      )}

      <h2>Featured Product</h2>
      {productLoading ? (
        <LoadingBox />
      ) : errorText ? (
        <MessageBox variant="danger">{errorText}</MessageBox>
      ) : (
        <div className="row center">
          {products &&
            products.map((product) => (
              <Product key={product.id} product={product} />
            ))}
        </div>
      )}
    </main>
  );
};

export default HomeScreen;
