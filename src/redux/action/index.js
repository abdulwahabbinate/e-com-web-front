export const addCart = (product) => {
  return {
    type: "ADDITEM",
    payload: product,
  };
};

export const delCart = (product) => {
  return {
    type: "DELITEM",
    payload: product,
  };
};

export const replaceCart = (items) => {
  return {
    type: "REPLACE_CART",
    payload: items,
  };
};

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