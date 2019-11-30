import * as R from "ramda";
import { RSAA } from "redux-api-middleware";
import { makeApiTypes, getApiPath } from "../utils";

export const types = {
  ...makeApiTypes("GET_QUOTES", "quotes"),
  ...makeApiTypes("SAVE_QUOTE", "quotes")
};

const initialState = {
  quotes: [],
  busy: false,
  error: null
};

export const getQuotes = authToken => ({
  [RSAA]: {
    endpoint: getApiPath("quotes"),
    method: "POST",
    body: JSON.stringify({ authToken }),
    headers: {
      "Content-Type": "application/json"
    },
    types: [
      types.GET_QUOTES_REQUEST,
      types.GET_QUOTES_SUCCESS,
      types.GET_QUOTES_ERROR
    ]
  }
});

export const saveQuote = (quote, authToken) => {
  // const { quotes, quoteNumber, data } = this.props;
  // const { baseURL, authToken } = data;

  // this.setState({ loadingSave: true });

  // request
  //   .post(`${baseURL}/quotes/save`)
  //   .send({
  //     quote: { ...quotes[quoteNumber], date: currentDate, estimator },
  //     authToken
  //   })
  //   .then(res => {
  //     this.setState({ loadingSave: false });
  //     console.log(res);
  //   })
  //   .catch(err => console.log(err));

  return {
    [RSAA]: {
      endpoint: getApiPath("quotes/save"),
      method: "POST",
      body: JSON.stringify({ quote, authToken }),
      headers: {
        "Content-Type": "application/json"
      },
      types: [
        types.SAVE_QUOTE_REQUEST,
        types.SAVE_QUOTE_SUCCESS,
        types.SAVE_QUOTE_ERROR
      ]
    }
  };
};

export default (state = initialState, { type, payload = {} }) => {
  switch (type) {
    case types.GET_QUOTES_REQUEST:
      return R.pipe(R.assoc("busy", true), R.assoc("error", null))(state);
    case types.GET_QUOTES_SUCCESS:
      return R.pipe(R.assoc("busy", false), R.assoc("quotes", payload))(state);
    case types.GET_QUOTES_ERROR:
      return R.pipe(
        R.assoc("busy", false),
        R.assoc("error", "There was an error with getting quotes")
      )(state);
    case types.SAVE_QUOTE_REQUEST:
      return R.pipe(R.assoc("busy", true), R.assoc("error", null))(state);
    case types.SAVE_QUOTE_SUCCESS:
      return R.pipe(R.assoc("busy", false))(state);
    case types.SAVE_QUOTE_ERROR:
      return R.pipe(
        R.assoc("busy", false),
        R.assoc("error", "There was an error with getting quotes")
      )(state);
    default:
      return state;
  }
};

/*

    getQuotes: ({
      authToken,
      changePage,
      loadQuotes,
      setQuotesLoading
    }) => () => {
      setQuotesLoading(true);
      request
        .post(`${baseURL}/quotes`)
        .send({ authToken })
        .then(res => {
          let quotes = res.body;
          loadQuotes(quotes);
          setQuotesLoading(false);
        })
        .catch(err => {
          console.log(err);
          console.log(err.response.text);
          localStorage.removeItem("authToken");
          changePage("login");
          setQuotesLoading(false);
        }); 

        */
