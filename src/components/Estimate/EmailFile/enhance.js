import { compose } from "recompose";

import { connect } from "react-redux";

export default connect(state => {
  return {
    quoteNumber: state.quoteNumber
  };
})(EmailFile);

const enhance = compose(
  connect(
    ({ quoteNumber }) => ({
      quoteNumber
    }),
    {}
  )
);

export default enhance;
