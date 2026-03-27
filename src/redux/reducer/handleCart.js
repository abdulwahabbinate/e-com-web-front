const getNormalizedStock = (product) => {
  const stock = Number(product?.stock ?? 0);
  return Number.isNaN(stock) ? 0 : Math.max(stock, 0);
};

const getProductIdentity = (product) => {
  return product?._id || product?.id;
};

const cart = [];

const handleCart = (state = cart, action) => {
  const product = action.payload;

  switch (action.type) {
    case "ADDITEM": {
      const productId = getProductIdentity(product);

      if (!productId) return state;

      const existingItem = state.find((item) => getProductIdentity(item) === productId);
      const availableStock = getNormalizedStock(product);

      if (availableStock <= 0) {
        return state;
      }

      if (existingItem) {
        if (Number(existingItem.qty || 1) >= availableStock) {
          return state;
        }

        return state.map((item) =>
          getProductIdentity(item) === productId
            ? {
                ...item,
                qty: Number(item.qty || 1) + 1,
                stock: availableStock,
              }
            : item
        );
      }

      return [
        ...state,
        {
          ...product,
          id: productId,
          _id: product?._id || productId,
          qty: 1,
          stock: availableStock,
        },
      ];
    }

    case "DELITEM": {
      const productId = getProductIdentity(product);

      if (!productId) return state;

      const existingItem = state.find((item) => getProductIdentity(item) === productId);

      if (!existingItem) {
        return state;
      }

      if (Number(existingItem.qty || 1) <= 1) {
        return state.filter((item) => getProductIdentity(item) !== productId);
      }

      return state.map((item) =>
        getProductIdentity(item) === productId
          ? {
              ...item,
              qty: Number(item.qty || 1) - 1,
            }
          : item
      );
    }

    case "REPLACE_CART": {
      return Array.isArray(action.payload) ? action.payload : state;
    }

    default:
      return state;
  }
};

export default handleCart;