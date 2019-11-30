import * as R from "ramda";
import { RSAA } from "redux-api-middleware";
import { makeApiTypes, getApiPath } from "../utils";

export const types = {
  ...makeApiTypes("LOGIN", "login")
};
const initialState = {
  busy: false,
  error: null
};

export const login = (username, password) => ({
  [RSAA]: {
    endpoint: getApiPath("authenticate"),
    method: "POST",
    body: JSON.stringify({ username, password }),
    headers: {
      "Content-Type": "application/json"
    },
    types: Object.values(makeApiTypes("LOGIN", "login"))
  }
});

export default (state = initialState, { type, payload = {} }) => {
  switch (type) {
    case types.LOGIN_REQUEST:
      return R.pipe(R.assoc("busy", true), R.assoc("error", null))(state);
    case types.LOGIN_SUCCESS:
      localStorage.setItem("authToken", payload);
      return R.assoc("busy", false, state);
    case types.LOGIN_ERROR:
      return R.pipe(
        R.assoc("busy", false),
        R.assoc("error", "There has been an error")
      )(state);
    default:
      return state;
  }
};
