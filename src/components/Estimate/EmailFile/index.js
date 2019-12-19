import React, { Component } from "react";
// import TiArrowLeftOutline from "react-icons/lib/ti/arrow-left-outline";
// import TiArrowRightOutline from "react-icons/lib/ti/arrow-right-outline";
// import Loadable from "react-loading-overlay";
import SimpleModal from "../../Common/SimpleModal";
import request from "superagent";
import baseURL from "../../baseURL";

import enhance from "./enhance";
import { determineSubmitError } from "./utils";
import "./EmailFile.scss";

export class EmailFile extends Component {
  constructor(e) {
    super(e);
    this.state = {
      fileToBeSent: "",
      recipientName: "",
      recipientEmail: "",
      nameError: false,
      emailError: false,
      fileError: false,
      loadingEmail: false
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleFileSelect = this.handleFileSelect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleNameChange(recipientName) {
    this.setState({
      recipientName,
      nameError: false
    });
  }
  handleEmailChange(recipientEmail) {
    this.setState({
      recipientEmail,
      emailError: false
    });
  }
  handleFileSelect(fileToBeSent) {
    this.setState({
      fileToBeSent,
      fileError: false
    });
  }
  removeEmptyItems(quote) {
    return {
      ...quote,
      shoppingCart: [...quote.shoppingCart].filter(item => {
        return item.quantity !== 0;
      })
    };
  }

  async handleSubmit() {
    const { fileToBeSent, recipientName, recipientEmail } = this.state;
    const { name, toggleEmailFile, emailDocument } = this.props;

    const { quotes, quoteNumber, grandTotal } = this.props;

    const quoteInformation = this.removeEmptyItems(quotes[quoteNumber]);

    let finalName = recipientName === "" ? name : recipientName;
    if (quotes[quoteNumber].shoppingCart.length > 0) {
      if (fileToBeSent === "estimate") {
        console.log("start", fileToBeSent);
        await request
          .post(`${baseURL}/assets/estimate`)
          .set("Content-Type", "application/json")
          .send({
            quoteInformation,
            total: grandTotal
          });
        console.log("end", fileToBeSent);
      } else {
        console.log("start", fileToBeSent);
        await request
          .post(`${baseURL}/assets/shopping-list`)
          .set("Content-Type", "application/json")
          .send({
            shoppingList: quotes[quoteNumber].shoppingCart,
            quoteNumber,
            total: grandTotal
          });
        console.log("end", fileToBeSent);
      }
    }
    await emailDocument(finalName, recipientEmail, fileToBeSent);
    toggleEmailFile();
    this.setState({
      fileToBeSent: "",
      recipientName: "",
      recipientEmail: "",
      loadingEmail: false
    });
  }

  render() {
    const { loadingEmail } = this.state;
    const { dispatch, show, toggleEmailFile, quoteNumber } = this.props;
    let name = this.props.name.trim();

    const {
      recipientName,
      recipientEmail,
      fileToBeSent,
      fileError,
      nameError,
      emailError
    } = this.state;

    if (recipientName !== "") {
      name = recipientName;
    }
    // console.log(fileToBeSent);

    return (
      <SimpleModal
        open={show}
        toggle={() => {
          this.setState({
            fileToBeSent: "",
            recipientName: "",
            recipientEmail: "",
            loadingEmail: false
          });
          toggleEmailFile();
        }}
        className="c-emailfile-modal"
      >
        <div className="c-emailfile-header">Email Quote #{quoteNumber}</div>

        <div className="c-emailfile-options-files">
          <div className="c-emailfile-option">
            <div
              className={`c-emailfile-option-checkbox ${
                fileToBeSent === "estimate" ? "selected" : ""
              }`}
              onClick={() => this.handleFileSelect("estimate")}
            />
            <div
              className={`c-emailfile-options-files-opt ${
                fileError ? "invalid" : ""
              }`}
            >
              Estimate
            </div>
          </div>
          <div className="c-emailfile-option">
            <div
              className={`c-emailfile-option-checkbox ${
                fileToBeSent === "shoppinglist" ? "selected" : ""
              }`}
              onClick={() => this.handleFileSelect("shoppinglist")}
            />
            <div
              className={`c-emailfile-options-files-opt ${
                fileError ? "invalid" : ""
              }`}
            >
              Shopping List
            </div>
          </div>
        </div>
        <div className="c-emailfile-options-files-title">Name</div>
        <input
          type="text"
          className={`c-emailfile-options-input ${nameError ? "invalid" : ""}`}
          placeholder="Name of Recipient"
          value={name}
          onChange={e => this.handleNameChange(e.target.value)}
        />
        <div className="c-emailfile-options-files-title">Email</div>
        <input
          type="email"
          className={`c-emailfile-options-input ${emailError ? "invalid" : ""}`}
          placeholder="Email of Recipient"
          value={recipientEmail}
          onChange={e => this.handleEmailChange(e.target.value)}
        />
        {determineSubmitError(name, recipientEmail, fileToBeSent) ? (
          <div className="c-emailfile-error-message">
            {determineSubmitError(name, recipientEmail, fileToBeSent)}
          </div>
        ) : (
          <div className="c-emailfile-options-send" onClick={this.handleSubmit}>
            Send
          </div>
        )}
      </SimpleModal>
    );
  }
}

export default enhance(EmailFile);
