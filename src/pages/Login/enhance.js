import { compose, withStateHandlers, lifecycle, withHandlers } from "recompose";
import { connect } from "react-redux";
import * as R from "ramda";

import { loadCategories } from "../../store/Categories";
import { changePage } from "../../store/Page";
import { login } from "../../store/Login";
const enhance = compose(
  connect(
    ({ Login }) => ({
      busy: R.path(["busy"], Login)
    }),
    {
      loadCategories,
      changePage,
      login
    }
  ),
  withStateHandlers(
    ({ username = "", password = "", error }) => ({
      username,
      password,
      error
    }),
    {
      setUserName: () => e => ({
        username: e.target.value,
        error: false
      }),
      setPassword: () => e => ({
        password: e.target.value,
        error: false
      }),
      setError: () => error => ({
        error
      })
    }
  ),
  withHandlers({
    handleSubmit: props => async () => {
      const {
        username,
        password,
        login,
        getCompleteData,
        changePage,
        setError
      } = props;

      const loginRes = await login(username, password);
      if (loginRes.error) {
        setError(loginRes.error);
        return;
      }
      await getCompleteData();
      changePage("home");
    },
    redirectToHome: props => () => {
      const { changePage, getCompleteData } = props;
      getCompleteData();
      changePage("home");
    }
  }),
  lifecycle({
    componentDidMount() {
      const { authToken, redirectToHome } = this.props;
      if (!R.either(R.isNil, R.isEmpty)(authToken)) {
        redirectToHome();
      }
    }
  })
);

export default enhance;
