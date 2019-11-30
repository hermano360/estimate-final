import * as R from "ramda";
import { RSAA } from "redux-api-middleware";
import { makeApiTypes, getApiPath } from "../utils";

export const types = {
  ...makeApiTypes("FETCH_CATEGORIES", "categories"),
  ...makeApiTypes("FETCH_CUSTOM_CATEGORIES", "categories")
};
const initialState = {
  categoryBusy: false,
  customCategoryBusy: false,
  error: false,
  categories: [],
  customCategories: []
};

export const fetchCategories = authToken => ({
  [RSAA]: {
    endpoint: getApiPath("categories"),
    method: "POST",
    body: JSON.stringify({ authToken }),
    headers: {
      "Content-Type": "application/json"
    },
    types: [
      types.FETCH_CATEGORIES_REQUEST,
      types.FETCH_CATEGORIES_SUCCESS,
      types.FETCH_CATEGORIES_ERROR
    ]
  }
});
export const fetchCustomCategories = authToken => ({
  [RSAA]: {
    endpoint: getApiPath("categories/custom"),
    method: "POST",
    body: JSON.stringify({ authToken }),
    headers: {
      "Content-Type": "application/json"
    },
    types: [
      types.FETCH_CUSTOM_CATEGORIES_REQUEST,
      types.FETCH_CUSTOM_CATEGORIES_SUCCESS,
      types.FETCH_CUSTOM_CATEGORIES_ERROR
    ]
  }
});

export default (state = initialState, { type, payload = {} }) => {
  switch (type) {
    case types.FETCH_CATEGORIES_REQUEST:
      return R.pipe(
        R.assoc("categoryBusy", true),
        R.assoc("error", null)
      )(state);
    case types.FETCH_CATEGORIES_SUCCESS:
      return R.pipe(
        R.assoc("categoryBusy", false),
        R.assoc("categories", payload)
      )(state);
    case types.FETCH_CATEGORIES_ERROR:
      return R.pipe(
        R.assoc("categoryBusy", false),
        R.assoc("error", "There has been an error")
      )(state);
    case types.FETCH_CUSTOM_CATEGORIES_REQUEST:
      return R.pipe(
        R.assoc("customCategoryBusy", true),
        R.assoc("error", null)
      )(state);
    case types.FETCH_CUSTOM_CATEGORIES_SUCCESS:
      return R.pipe(
        R.assoc("customCategoryBusy", false),
        R.assoc("customCategories", payload)
      )(state);
    case types.FETCH_CUSTOM_CATEGORIES_ERROR:
      return R.pipe(
        R.assoc("customCategoryBusy", false),
        R.assoc("error", "There has been an error")
      )(state);
    default:
      return state;
  }
};

/*

      request
        .post(`${baseURL}/categories/custom`)
        .send({ authToken })
        .then(res => {
          let customCategories = res.body;
          if (shouldUpdate) {
            request
              .post(`${baseURL}/categories`)
              .then(response => {
                let categories = response.body;
                localStorage.setItem(
                  "categoriesAccessDate",
                  new Date().getTime()
                );
                localStorage.setItem("categories", JSON.stringify(categories));
                console.log(this.props);

                loadCategories([...customCategories, ...categories]);

                setCategoriesLoading(false);
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            loadCategories([...customCategories, ...existingCategories]);

            setCategoriesLoading(false);
          }
        })
        .catch(err => {
          console.log(err);
          localStorage.removeItem("authToken");
          changePage("login");
          setCategoriesLoading(false);
        });

        */
