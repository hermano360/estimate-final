import { compose } from "recompose";
import * as R from "ramda";
import { connect } from "react-redux";

const enhance = compose(
  connect(({ Categories, products, quotes, quoteNumber }) => {
    return {
      categories: R.pathOr([], ["categories"], Categories),
      products,
      quotes,
      quoteNumber
    };
  })
);

export default enhance;
