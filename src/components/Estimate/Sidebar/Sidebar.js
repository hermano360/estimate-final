import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import SimpleModal from "../../Common/SimpleModal";
import actions from "../../../redux/actions/actions";
import request from "superagent";
import baseURL from "../../baseURL";

import "./Sidebar.scss";

export class Sidebar extends Component {
  constructor(e) {
    super(e);
    this.state = {
      estimateReady: false,
      shoppingListReady: false
    };
    this.onHideModal = this.onHideModal.bind(this);
    this.handleEmailBid = this.handleEmailBid.bind(this);
  }

  removeEmptyItems(quote) {
    return {
      ...quote,
      shoppingCart: [...quote.shoppingCart].filter(item => {
        return item.quantity !== 0;
      })
    };
  }

  handleEstimate = () => {
    const { quotes, quoteNumber, toggleShowModal, grandTotal } = this.props;
    const quoteInformation = this.removeEmptyItems(quotes[quoteNumber]);
    const { estimateReady } = this.state;
    if (quoteInformation.shoppingCart.length > 0) {
      request
        .post(`${baseURL}/assets/estimate`)
        .set("Content-Type", "application/json")
        .send({
          quoteInformation,
          total: grandTotal
        })
        .then(res => {
          this.setState({
            estimateReady: !estimateReady
          });
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      toggleShowModal();
    }
  };

  handleShoppingList = () => {
    const { quotes, quoteNumber, grandTotal } = this.props;
    const { shoppingListReady } = this.state;

    if (quotes[quoteNumber].shoppingCart.length > 0) {
      request
        .post(`${baseURL}/assets/shopping-list`)
        .set("Content-Type", "application/json")
        .send({
          shoppingList: quotes[quoteNumber].shoppingCart,
          quoteNumber,
          total: grandTotal
        })
        .then(res => {
          this.setState({
            shoppingListReady: !shoppingListReady
          });
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      toggleShowModal();
    }
  };
  handleDuplicate = () => {
    const {
      quotes,
      quoteNumber,
      availableQuoteNumbers,
      dispatch,
      toggleShowModal
    } = this.props;
    const nextAvailableQuoteNumber =
      availableQuoteNumbers[availableQuoteNumbers.length - 1] + 1;
    dispatch(
      actions.duplicateQuote(quotes[quoteNumber], nextAvailableQuoteNumber)
    );
    dispatch(actions.setQuoteNumber(nextAvailableQuoteNumber));
    toggleShowModal();
  };
  handleNewQuote = () => {
    const { dispatch, availableQuoteNumbers, toggleShowModal } = this.props;
    let nextAvailableQuoteNumber = 1;
    if (availableQuoteNumbers[0] !== undefined) {
      nextAvailableQuoteNumber =
        availableQuoteNumbers[availableQuoteNumbers.length - 1] + 1;
    }
    dispatch(actions.addNewQuote(nextAvailableQuoteNumber));
    dispatch(actions.setQuoteNumber(nextAvailableQuoteNumber));
    toggleShowModal();
  };
  handleWorkOrder() {
    console.log("work order");
  }

  firstTest = () => {
    return "success!";
  };

  handleEmailBid() {
    const {
      toggleShowModal,

      toggleEmailFile
    } = this.props;

    toggleShowModal();
    toggleEmailFile();
  }

  onHideModal() {
    const { toggleShowModal } = this.props;
    toggleShowModal();
    this.setState({
      estimateReady: false
    });
  }
  handleAddProduct = () => {
    const { toggleAddProduct, toggleShowModal } = this.props;
    toggleShowModal();
    toggleAddProduct(true);
  };
  handleAddTemplate = () => {
    this.props.toggleShowModal();
    this.props.toggleAddTemplate(true);
  };

  render() {
    const { toggleShowModal, show, baseURL } = this.props;
    const { estimateReady, shoppingListReady } = this.state;
    return (
      <SimpleModal open={show} toggle={this.onHideModal}>
        <div className="c-sidebar-body">
          <div className="c-sidebar-header">Options</div>

          {!estimateReady && (
            <div className="c-sidebar-item" onClick={this.handleEstimate}>
              Estimate
            </div>
          )}
          {estimateReady && (
            <a
              href={`${baseURL}/assets/estimate`}
              onClick={() => {
                this.setState({
                  estimateReady: false
                });
              }}
            >
              <div className="c-sidebar-item">Download</div>
            </a>
          )}
          <div className="c-sidebar-item" onClick={this.handleDuplicate}>
            Duplicate
          </div>
          <div className="c-sidebar-item" onClick={this.handleNewQuote}>
            New Quote
          </div>
          <div className="c-sidebar-item" onClick={this.handleWorkOrder}>
            Work Order
          </div>
          {!shoppingListReady && (
            <div className="c-sidebar-item" onClick={this.handleShoppingList}>
              Shopping List
            </div>
          )}
          {shoppingListReady && (
            <a
              href={`${baseURL}/assets/shopping-list`}
              onClick={() => {
                this.setState({
                  shoppingListReady: false
                });
              }}
            >
              <div className="c-sidebar-item">Download</div>
            </a>
          )}

          <div className="c-sidebar-item" onClick={this.handleEmailBid}>
            Email Bid
          </div>
          <div
            className="c-sidebar-item"
            onClick={() => this.handleAddProduct()}
          >
            Add Product
          </div>
          <div className="c-sidebar-item" onClick={this.handleAddTemplate}>
            Add Template
          </div>

          <Button className="c-sidebar-close" onClick={toggleShowModal}>
            Close
          </Button>
        </div>
      </SimpleModal>
    );
  }
}

export default connect(state => {
  return {
    quotes: state.quotes,
    quoteNumber: state.quoteNumber,
    tax: state.tax,
    labor: state.labor,
    material: state.material
  };
})(Sidebar);
