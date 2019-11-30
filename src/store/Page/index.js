import * as R from "ramda";

export const types = {
  changePage: "CHANGE_PAGE"
};

const initialState = {
  page: "login"
};

export const changePage = page => {
  return {
    type: types.changePage,
    payload: { page }
  };
};

export default (state = initialState, { type, payload = {} }) => {
  switch (type) {
    case types.changePage: {
      return R.assoc("page", payload.page, state);
    }
    default:
      return state;
  }
};
