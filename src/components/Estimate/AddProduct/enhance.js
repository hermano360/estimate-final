import { compose, lifecycle } from "recompose";
import { connect } from "react-redux";
import { findProducts } from "../../../store/Products";

const enhance = compose(
  connect(
    state => {
      console.log(state);
      return {
        reduxState: state
      };
    },
    {
      findProducts
    }
  ),
  lifecycle({
    async componentDidMount() {
      console.log("cdm");
    }
  })
);

export default enhance;
