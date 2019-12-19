import * as R from "ramda";
import { RSAA } from "redux-api-middleware";
import { makeApiTypes, getApiPath } from "../utils";
import request from "superagent";

export const types = {
  ...makeApiTypes("FETCH_PRODUCTS", "products"),
  ...makeApiTypes("FIND_PRODUCT", "products"),
  ...makeApiTypes("FETCH_CUSTOM_PRODUCTS", "products"),
  ...makeApiTypes("CREATE_PRODUCT", "products")
};
const initialState = {
  productsBusy: false,
  customProductsBusy: false,
  error: null,
  products: [],
  customProducts: []
};

export const findProducts = (store, searchTerm) => ({
  [RSAA]: {
    endpoint: getApiPath(`products/find/${store}?search=${searchTerm}`),
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    types: Object.values(makeApiTypes("FIND_PRODUCT", "products"))
  }
});

export const fetchProducts = authToken => ({
  [RSAA]: {
    endpoint: getApiPath("products"),
    method: "POST",
    body: JSON.stringify({ authToken }),
    headers: {
      "Content-Type": "application/json"
    },
    types: Object.values(makeApiTypes("FETCH_PRODUCTS", "products"))
  }
});

export const fetchCustomProducts = authToken => ({
  [RSAA]: {
    endpoint: getApiPath("products/custom"),
    method: "POST",
    body: JSON.stringify({ authToken }),
    headers: {
      "Content-Type": "application/json"
    },
    types: Object.values(makeApiTypes("FETCH_CUSTOM_PRODUCTS", "products"))
  }
});

export const addProductToList = product => ({
  payload: product,
  type: types.addProduct
});

export default (state = initialState, { type, payload = {} }) => {
  switch (type) {
    case types.FETCH_PRODUCTS_REQUEST:
      return R.pipe(
        R.assoc("productsBusy", true),
        R.assoc("error", null)
      )(state);
    case types.FETCH_PRODUCTS_SUCCESS:
      return R.pipe(
        R.assoc("productsBusy", false),
        R.assoc("products", payload)
      )(state);
    case types.FETCH_PRODUCTS_ERROR:
      return R.pipe(
        R.assoc("productsBusy", false),
        R.assoc("error", "There has been an error")
      )(state);
    case types.FETCH_CUSTOM_PRODUCTS_REQUEST:
      return R.pipe(
        R.assoc("customProductsBusy", true),
        R.assoc("error", null)
      )(state);
    case types.FETCH_CUSTOM_PRODUCTS_SUCCESS:
      return R.pipe(
        R.assoc("customProductsBusy", false),
        R.assoc("customProducts", payload)
      )(state);
    case types.FETCH_CUSTOM_PRODUCTS_ERROR:
      return R.pipe(
        R.assoc("customProductsBusy", false),
        R.assoc("error", "There has been an error")
      )(state);
    case types.addProduct: {
      const products = R.pathOr([], ["products"], state);
      return R.assoc("products", [...products, payload], state);
    }
    default:
      return state;
  }
};

// export const login = (username, password) => ({
//   [RSAA]: {
//     endpoint: getApiPath("authenticate"),
//     method: "POST",
//     body: JSON.stringify({ username, password }),
//     headers: {
//       "Content-Type": "application/json"
//     },
//     types: Object.values(makeApiTypes("LOGIN", "login"))
//   }
// });

// export default (state = initialState, { type, payload = {} }) => {
//   switch (type) {
//     case types.LOGIN_REQUEST:
//       return R.pipe(R.assoc("busy", true), R.assoc("error", null))(state);
//     case types.LOGIN_SUCCESS:
//       localStorage.setItem("authToken", payload);
//       return R.assoc("busy", false, state);
//     case types.LOGIN_ERROR:
//       return R.pipe(
//         R.assoc("busy", false),
//         R.assoc("error", "There has been an error")
//       )(state);
//     default:
//       return state;
//   }
// };

/*

      request
        .post(`${baseURL}/products/custom`)
        .send({ authToken })
        .then(res => {
          let customProducts = res.body;
          if (shouldUpdate) {
            request
              .post(`${baseURL}/products`)
              .then(response => {
                let products = response.body;
                localStorage.setItem(
                  "productsAccessDate",
                  new Date().getTime()
                );
                localStorage.setItem("products", JSON.stringify(products));
                loadProducts([...customProducts, ...products]);
                setProductsLoading(false);
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            loadProducts([...customProducts, ...existingProducts]);
            setProductsLoading(false);
          }
        })
        .catch(err => {
          console.log(err);
          localStorage.removeItem("authToken");
          changePage("login");
          setProductsLoading(false);
        });

*/
