import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Navbar, Footer } from "../components";
import { addCart, delWishlist } from "../redux/action";
import "./Wishlist.css";

const Wishlist = () => {
  const state = useSelector((state) => state.handleWishlist);
  const dispatch = useDispatch();

  const removeFromWishlist = (product) => {
    dispatch(delWishlist(product));
  };

  const moveToCart = (product) => {
    dispatch(addCart(product));
    dispatch(delWishlist(product));
  };

  const EmptyWishlist = () => {
    return (
      <div className="container py-5">
        <div className="wishlist-empty-box text-center">
          <div className="wishlist-empty-icon">
            <i className="fa fa-heart-o"></i>
          </div>
          <h3 className="mb-3">Your Wishlist is Empty</h3>
          <p className="text-muted mb-4">
            Save your favorite products here and review them later.
          </p>
          <Link to="/product" className="btn btn-dark rounded-pill px-4 py-2">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  };

  const ShowWishlist = () => {
    return (
      <div className="container py-5">
        <div className="wishlist-header mb-4">
          <div>
            <span className="wishlist-badge">Saved Items</span>
            <h2 className="wishlist-title mt-2">My Wishlist</h2>
            <p className="wishlist-subtitle mb-0">
              Your favorite picks, ready to move into cart anytime.
            </p>
          </div>

          <div className="wishlist-count-box">
            <span>{state.length}</span>
            <small>Items</small>
          </div>
        </div>

        <div className="row g-4">
          {state.map((item) => {
            return (
              <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={item.id}>
                <div className="wishlist-card h-100">
                  <button
                    className="wishlist-remove-btn"
                    onClick={() => removeFromWishlist(item)}
                    aria-label="Remove from wishlist"
                  >
                    <i className="fa fa-times"></i>
                  </button>

                  <div className="wishlist-image-wrap">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="wishlist-image"
                    />
                  </div>

                  <div className="wishlist-card-body">
                    <p className="wishlist-category">
                      {item.category || "Fashion"}
                    </p>

                    <h5 className="wishlist-product-title">
                      {item.title}
                    </h5>

                    <div className="wishlist-price-row">
                      <span className="wishlist-price">${item.price}</span>
                      <span className="wishlist-stock">In Stock</span>
                    </div>

                    <div className="wishlist-actions">
                      <button
                        className="wishlist-cart-btn"
                        onClick={() => moveToCart(item)}
                      >
                        <i className="fa fa-shopping-bag me-2"></i>
                        Move to Cart
                      </button>

                      <Link
                        to={`/product/${item.id}`}
                        className="wishlist-view-btn"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="wishlist-page">
        {state.length ? <ShowWishlist /> : <EmptyWishlist />}
      </div>
      <Footer />
    </>
  );
};

export default Wishlist;