import * as R from "ramda";

export const types = {
  addProduct: "ADD_PRODUCT",
  createProduct: "CREATE_PRODUCT"
};
const initialState = {
  products: []
};

export const addProductToList = product => ({
  payload: product,
  type: types.addProduct
});

export default (state = initialState, { type, payload = {} }) => {
  switch (type) {
    case types.addProduct: {
      const products = R.pathOr([], ["products"], state);
      return R.assoc("products", [...products, payload], state);
    }
    default:
      return state;
  }
};
