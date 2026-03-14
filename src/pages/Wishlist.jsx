import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Footer, Navbar, ProductCard, QuickViewModal } from "../components";
import { addCart, delWishlist } from "../redux/action";
import toast from "react-hot-toast";
import "./Wishlist.css";

const Wishlist = () => {
  const state = useSelector((state) => state.handleWishlist) || [];
  const dispatch = useDispatch();
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const removeFromWishlist = (product) => {
    dispatch(delWishlist(product));
    toast.success("Removed from wishlist");
  };

  const moveToCart = (product) => {
    dispatch(addCart(product));
    dispatch(delWishlist(product));
    toast.success("Moved to cart");
  };

  const isInWishlist = (product) => {
    return state.some((item) => item.id === product.id);
  };

  const EmptyWishlist = () => {
    return (
      <div className="wishlist-page">
        <div className="container py-5">
          <div className="wishlist-empty-box text-center">
            <div className="wishlist-empty-icon">
              <i className="far fa-heart"></i>
            </div>

            <h2 className="wishlist-empty-title">Your Wishlist is Empty</h2>
            <p className="wishlist-empty-subtitle mb-4">
              Save your favorite products here and review them later.
            </p>

            <Link to="/product" className="wishlist-continue-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const ShowWishlist = () => {
    return (
      <div className="wishlist-page">
        <div className="container py-4">
          <div className="wishlist-header mb-4">
            <div>
              <span className="wishlist-badge">Saved Items</span>
              <h2 className="wishlist-title">My Wishlist</h2>
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
            {state.map((item) => (
              <div key={item.id} className="col-xxl-3 col-xl-4 col-md-6 col-12">
                <ProductCard
                  product={item}
                  onAddToCart={moveToCart}
                  onToggleWishlist={removeFromWishlist}
                  isWishlisted={isInWishlist(item)}
                  onQuickView={setQuickViewProduct}
                />
              </div>
            ))}
          </div>
        </div>

        <QuickViewModal
          product={quickViewProduct}
          isOpen={Boolean(quickViewProduct)}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={moveToCart}
          onToggleWishlist={removeFromWishlist}
          isWishlisted={quickViewProduct ? isInWishlist(quickViewProduct) : false}
        />
      </div>
    );
  };

  return (
    <>
      <Navbar />
      {state.length ? <ShowWishlist /> : <EmptyWishlist />}
      <Footer />
    </>
  );
};

export default Wishlist;