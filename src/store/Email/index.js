import * as R from "ramda";
import { RSAA } from "redux-api-middleware";
import { makeApiTypes, getApiPath } from "../utils";

export const types = {
  ...makeApiTypes("EMAIL_DOCUMENT", "email")
};
const initialState = {
  busy: false,
  error: null
};

export const emailDocument = (name, email, documentType = "estimate") => ({
  [RSAA]: {
    endpoint: getApiPath(`email/${documentType}`),
    method: "POST",
    body: JSON.stringify({ name, email }),
    headers: {
      "Content-Type": "application/json"
    },
    types: [
      types.EMAIL_DOCUMENT_REQUEST,
      types.EMAIL_DOCUMENT_SUCCESS,
      types.EMAIL_DOCUMENT_ERROR
    ]
  }
});

export default (state = initialState, { type, payload = {} }) => {
  switch (type) {
    case types.EMAIL_DOCUMENT_REQUEST:
      return R.pipe(R.assoc("busy", true), R.assoc("error", null))(state);
    case types.EMAIL_DOCUMENT_SUCCESS:
      return R.pipe(R.assoc("busy", false))(state);
    case types.EMAIL_DOCUMENT_ERROR:
      return R.pipe(
        R.assoc("busy", false),
        R.assoc("error", payload.error || "There has been an error")
      )(state);
    default:
      return state;
  }
};
