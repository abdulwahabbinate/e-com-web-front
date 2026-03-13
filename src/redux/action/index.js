// For Add Item to Cart
export const addCart = (product) =>{
    return {
        type:"ADDITEM",
        payload:product
    }
}

// For Delete Item to Cart
export const delCart = (product) =>{
    return {
        type:"DELITEM",
        payload:product
    }
}

// For Add Item to Wishlist
export const addWishlist = (product) => {
  return {
    type: "ADDWISHLIST",
    payload: product,
  };
};

// For Delete Item from Wishlist
export const delWishlist = (product) => {
  return {
    type: "DELWISHLIST",
    payload: product,
  };
};