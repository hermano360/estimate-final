import {
  compose,
  withHandlers,
  withProps,
  withState,
  lifecycle
} from "recompose";
import * as R from "ramda";
import { connect } from "react-redux";
import { changePage } from "../../store/Page";
import { saveQuote } from "../../store/Quotes";
import { findProducts } from "../../store/Products";
import {
  findAvailableQuoteNumbers,
  chooseEstimator,
  getCurrentDate
} from "./utils";
import actions from "../../redux/actions/actions";

const enhance = compose(
  connect(
    ({
      estimator,
      quotes,
      quoteNumber,
      shoppingCartDOMNodes,
      databaseQuoteNumbers,
      labor,
      material,
      tax,
      Quotes
    }) => {
      return {
        estimator,
        quotes,
        quoteNumber,
        shoppingCartDOMNodes,
        databaseQuoteNumbers,
        labor,
        material,
        tax,
        quoteBusy: R.pathOr("", ["busy"], Quotes)
      };
    },
    {
      setQuoteNumber: actions.setQuoteNumber,
      addNewQuote: actions.addNewQuote,
      editQuoteAttribute: actions.editQuoteAttribute,
      setShoppingCartNode: actions.setShoppingCartNode,
      editQuoteAttribute: actions.editQuoteAttribute,
      changePage,
      saveQuote,
      findProducts
    }
  ),
  withState("currentDate", "setCurrentDate", ""),
  withState("showTotal", "toggleShowTotal", false),
  withState("showEmailFile", "setShowEmailFile", false),
  withState("showSidebar", "toggleShowModal", false),
  withState("removeQuoteModal", "toggleRemoveQuote", false),
  withState("showAddProduct", "toggleAddProduct", false),
  withState("showAddTemplate", "toggleAddTemplate", false),
  withState("showMaterialInfo", "toggleShowMaterial", false),
  withState("loadingSave", "setLoadingSave", false),
  withHandlers({
    toggleLoading: ({ setLoadingSave, loadingSave }) => () => {
      setLoadingSave(!loadingSave);
    },
    toggleEmailFile: ({ showEmailFile, setShowEmailFile }) => () => {
      setShowEmailFile(!showEmailFile);
    },
    generateTotal: ({ labor, material, tax }) => ({ shoppingCart = [] }) => {
      return shoppingCart
        .reduce((acc, item) => {
          const itemLabor = R.pipe(
            R.propOr("0", "labor"),
            R.replace("$", ""),
            Number
          )(item);
          const itemMaterial = R.pipe(
            R.propOr("0", "totalMaterial"),
            R.replace("$", ""),
            Number
          )(item);

          const totalMarkup =
            (itemLabor * labor) / 100 + (itemMaterial * material) / 100;

          const subTotal =
            item.quantity * (itemLabor + itemMaterial + totalMarkup);

          return acc + subTotal + (subTotal * tax) / 100;
        }, 0)
        .toFixed(2);
    },
    handleChangeDate: props => e => {
      const { quoteNumber, editQuoteAttribute, setCurrentDate } = props;

      const regex = /([0-9]{2})-([0-9]{2})-([0-9]{4})/g;
      let month = Number(e.replace(regex, "$1"));
      let day = Number(e.replace(regex, "$2"));
      let year = Number(e.replace(regex, "$3"));

      if (
        month > 0 &&
        month < 13 &&
        day > 0 &&
        day < 32 &&
        year > 2000 &&
        year < 3000
      ) {
        editQuoteAttribute(quoteNumber, "date", e);
        setCurrentDate(e);
      }
    },
    saveQuoteToDatabase: ({ saveQuote, quotes, quoteNumber, data }) => (
      currentDate,
      estimator
    ) => {
      const { authToken } = data;
      saveQuote(
        { ...quotes[quoteNumber], date: currentDate, estimator },
        authToken
      );

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
    },
    incrementQuoteNumber: props => () => {
      const { quoteNumber, quotes, setCurrentDate, setQuoteNumber } = props;
      const availableQuoteNumbers = findAvailableQuoteNumbers(quotes);
      const currentQuoteNumberPosition = availableQuoteNumbers.indexOf(
        quoteNumber
      );
      if (
        currentQuoteNumberPosition !== -1 &&
        currentQuoteNumberPosition + 1 < availableQuoteNumbers.length
      ) {
        setQuoteNumber(
          Number(availableQuoteNumbers[currentQuoteNumberPosition + 1])
        );
      }
      setCurrentDate("");
    },
    decrementQuoteNumber: props => () => {
      const { quoteNumber, quotes, setQuoteNumber, setCurrentDate } = props;
      const availableQuoteNumbers = findAvailableQuoteNumbers(quotes);
      const currentQuoteNumberPosition = availableQuoteNumbers.indexOf(
        quoteNumber
      );
      if (currentQuoteNumberPosition !== -1 && currentQuoteNumberPosition > 0) {
        setQuoteNumber(
          Number(availableQuoteNumbers[currentQuoteNumberPosition - 1])
        );
      }
      setCurrentDate("");
    },
    redirectToComponent: ({ changePage }) => component => {
      changePage(component);
    }
  }),
  withProps(props => {
    const { quotes = {}, quoteNumber } = props;
    const availableQuoteNumbers = findAvailableQuoteNumbers(quotes) || [];
    const currentQuoteNumber = quoteNumber || availableQuoteNumbers[0];
    if (!R.isEmpty(quotes) && !R.isNil(currentQuoteNumber)) {
      const currentQuote = R.propOr({}, [currentQuoteNumber], quotes);
      const estimator = chooseEstimator(
        currentQuote.estimator,
        localStorage.getItem("estimator")
      );
      const currentQuoteDate = getCurrentDate(
        props.currentDate,
        currentQuote.date
      );
      const grandTotal = props.generateTotal(currentQuote);
      return {
        currentQuoteDate,
        estimator,
        grandTotal
      };
    } else {
      return {};
    }
  }),
  lifecycle({
    componentDidMount() {
      const { quotes, setQuoteNumber, addNewQuote, quoteBusy } = this.props;
      const availableQuoteNumbers = findAvailableQuoteNumbers(quotes);
      if (availableQuoteNumbers.length > 0) {
        setQuoteNumber(availableQuoteNumbers[0]);
      } else if (!quoteBusy) {
        debugger;
        addNewQuote(1);
        setQuoteNumber(1);
      }
    },
    componentDidUpdate(prevProps) {
      const { quotes, setQuoteNumber, addNewQuote, quoteBusy } = this.props;
      const { quotes: prevQuotes = {} } = prevProps;
      const availableQuoteNumbers = findAvailableQuoteNumbers(quotes);
      if (
        Object.keys(prevQuotes).length === 0 &&
        availableQuoteNumbers.length > 0
      ) {
        setQuoteNumber(availableQuoteNumbers[0]);
      } else if (
        prevProps.quoteBusy &&
        !quoteBusy &&
        availableQuoteNumbers.length === 0
      ) {
        debugger;
        addNewQuote(1);
        setQuoteNumber(1);
      }
    }
  })
);

export default enhance;
