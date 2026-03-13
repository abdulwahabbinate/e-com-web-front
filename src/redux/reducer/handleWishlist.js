// Retrieve initial state from localStorage if available
const getInitialWishlist = () => {
  const storedWishlist = localStorage.getItem("wishlist");
  return storedWishlist ? JSON.parse(storedWishlist) : [];
};

const handleWishlist = (state = getInitialWishlist(), action) => {
  const product = action.payload;
  let updatedWishlist;

  switch (action.type) {
    case "ADDWISHLIST":
      // Check if product already exists in wishlist
      const exist = state.find((x) => x.id === product.id);

      if (exist) {
        return state;
      }

      updatedWishlist = [...state, product];
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      return updatedWishlist;

    case "DELWISHLIST":
      updatedWishlist = state.filter((x) => x.id !== product.id);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      return updatedWishlist;

    default:
      return state;
  }
};

export default handleWishlist;