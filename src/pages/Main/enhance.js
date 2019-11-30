import { compose, withProps, withState, withHandlers } from "recompose";
import * as R from "ramda";
import { connect } from "react-redux";
import request from "superagent";

import { fetchCategories, fetchCustomCategories } from "../../store/Categories";
import { fetchProducts, fetchCustomProducts } from "../../store/Products";
import { changePage } from "../../store/Page";
import { getQuotes } from "../../store/Quotes";
import baseURL from "../baseURL";
import { shouldPropertyUpdate } from "./utils";
import actions from "../../redux/actions/actions";

const enhance = compose(
  connect(
    ({ Page, Quotes, Categories, Products }) => {
      return {
        page: R.pathOr("", ["page"], Page),
        quotes: R.pathOr([], ["quotes"], Quotes),
        quoteBusy: R.pathOr("", ["busy"], Quotes),
        categoryBusy: R.pathOr("", ["categoryBusy"], Categories),
        customCategoryBusy: R.pathOr("", ["customCategoryBusy"], Categories),
        productsBusy: R.pathOr("", ["categoryBusy"], Products),
        customProductsBusy: R.pathOr("", ["customCategoryBusy"], Products)
      };
    },
    {
      fetchCategories,
      fetchCustomCategories,
      changePage,
      getQuotes,
      fetchProducts,
      fetchCustomProducts,
      loadCategories: actions.loadCategories,
      loadQuotes: actions.loadQuotes,
      loadProducts: actions.loadProducts
    }
  ),

  withProps(
    ({
      pageOptions,
      page,
      productsBusy,
      customProductsBusy,
      quotesBusy,
      customCategoryBusy,
      categoryBusy
    }) => ({
      Component: pageOptions[page],
      data: { baseURL, pageOptions },
      authToken: localStorage.getItem("authToken"),
      loading:
        customCategoryBusy ||
        categoryBusy ||
        productsBusy ||
        customProductsBusy ||
        quotesBusy
    })
  ),
  withHandlers({
    getQuotes: ({
      authToken,
      changePage,
      getQuotes,
      loadQuotes
    }) => async () => {
      const res = await getQuotes(authToken);
      if (res.error) {
        localStorage.removeItem("authToken");
        changePage("login");
        return;
      }

      // trying to go away from this
      request
        .post(`${baseURL}/quotes`)
        .send({ authToken })
        .then(res => {
          let quotes = res.body;
          loadQuotes(quotes);
        })
        .catch(err => {
          console.log(err);
          console.log(err.response.text);
          localStorage.removeItem("authToken");
          changePage("login");
        });
    },
    getCategories: ({
      loadCategories,
      changePage,
      baseURL,
      authToken,
      fetchCategories,
      fetchCustomCategories
    }) => async () => {
      const timeCategoriesLastAccessed = JSON.parse(
        localStorage.getItem("categoriesAccessDate")
      );
      const existingCategories = JSON.parse(localStorage.getItem("categories"));
      let shouldUpdate = shouldPropertyUpdate(timeCategoriesLastAccessed, 1);

      const res1 = await fetchCustomCategories(authToken);
      const res = await fetchCategories(authToken);

      localStorage.setItem("categoriesAccessDate", new Date().getTime());

      // Trying to get away from this
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
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            loadCategories([...customCategories, ...existingCategories]);
          }
        })
        .catch(err => {
          console.log(err);
          localStorage.removeItem("authToken");
          changePage("login");
        });
    },
    getProducts: ({
      loadProducts,

      baseURL,
      authToken,
      fetchProducts,
      fetchCustomProducts
    }) => async () => {
      const timeProductsLastAccessed = JSON.parse(
        localStorage.getItem("productsAccessDate")
      );
      const existingProducts = JSON.parse(localStorage.getItem("products"));

      let shouldUpdate =
        shouldPropertyUpdate(timeProductsLastAccessed) ||
        existingProducts === null;

      const res = await fetchProducts(authToken);
      const res1 = await fetchCustomProducts(authToken);
      if (res.error || res1.error) {
        localStorage.removeItem("authToken");
        changePage("login");
      }

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
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            loadProducts([...customProducts, ...existingProducts]);
          }
        })
        .catch(err => {
          console.log(err);
          localStorage.removeItem("authToken");
          changePage("login");
        });
    }
  }),
  withHandlers({
    getCompleteData: props => () => {
      const {
        authToken,
        changePage,
        getQuotes,
        getCategories,
        getProducts
      } = props;
      if (authToken !== null) {
        getQuotes();
        getCategories();
        getProducts();
      } else {
        changePage("login");
      }
    }
  })
);

export default enhance;
