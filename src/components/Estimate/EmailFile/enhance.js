import { compose } from "recompose";

import { connect } from "react-redux";

import { emailDocument } from "../../../store/Email";

const enhance = compose(
  connect(
    ({ quoteNumber }) => {
      return {
        quoteNumber
      };
    },
    { emailDocument }
  )
);

export default enhance;
