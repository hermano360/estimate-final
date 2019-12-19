import React from "react";
import DateTimeField from "react-bootstrap-datetimepicker";
import Loadable from "react-loading-overlay";
import * as R from "ramda";
import EstimateWorksheet from "../../components/Estimate/EstimateWorksheet";
import EmailFile from "../../components/Estimate/EmailFile/EmailFile";
import AddProduct from "../../components/Estimate/AddProduct/AddProduct";
import AddTemplate from "../../components/Estimate/AddTemplate/AddTemplate";
import RemoveQuote from "../../components/Estimate/RemoveQuote/RemoveQuote";
import Sidebar from "../../components/Estimate/Sidebar/Sidebar";
import EstimateHeader from "../../components/Estimate/EstimateHeader";
// import SignatureBox from "../../components/Estimate/SignatureBox/SignatureBox";

import enhance from "./enhance";
import {
  findAvailableQuoteNumbers,
  chooseEstimator,
  getCurrentDate
} from "./utils";

import "react-toggle/style.css";
import "react-datepicker/dist/react-datepicker.css";
import "./Estimate.scss";

const Estimate = props => {
  const {
    quotes,
    shoppingCartDOMNodes,
    editQuoteAttribute,
    setShoppingCartNode,
    toggleEmailFile,
    showEmailFile,
    showSidebar,
    showTotal,
    removeQuoteModal,
    showMaterialInfo,
    loadingSave,
    showAddProduct,
    showAddTemplate,
    generateTotal,
    toggleShowModal,
    toggleAddProduct,
    toggleRemoveQuote,
    toggleLoading,
    toggleAddTemplate,
    getProducts,
    getCategories,
    baseURL,
    authToken
  } = props;
  const availableQuoteNumbers = findAvailableQuoteNumbers(quotes);
  const quoteNumber = props.quoteNumber || availableQuoteNumbers[0];
  const currentQuote = R.pathOr({}, [quoteNumber], quotes);

  let loading = props.loading || loadingSave;
  const estimator = chooseEstimator(
    currentQuote.estimator,
    localStorage.getItem("estimator")
  );
  const currentDate = getCurrentDate(props.currentDate, currentQuote.date);
  const grandTotal = generateTotal(currentQuote);

  return (
    <Loadable active={loading} spinner text={`Loading`}>
      <div className="c-estimate-body">
        <EstimateHeader {...props} />

        <div className="c-estimate-input-body">
          <input
            type="text"
            className="c-estimate-input c-estimate-input-half"
            placeholder="First Name"
            value={currentQuote.customerFirstName}
            onChange={e =>
              editQuoteAttribute(
                quoteNumber,
                "customerFirstName",
                e.target.value
              )
            }
            ref={input => {
              if (
                shoppingCartDOMNodes["firstName"] === undefined &&
                input !== null
              ) {
                setShoppingCartNode("firstName", input);
              }
            }}
            onKeyPress={e => {
              if (e.charCode === 13) {
                shoppingCartDOMNodes["lastName"].focus();
              }
            }}
          />
          <input
            type="text"
            className="c-estimate-input c-estimate-input-half"
            placeholder="Last Name"
            value={currentQuote.customerLastName}
            onChange={e =>
              editQuoteAttribute(
                quoteNumber,
                "customerLastName",
                e.target.value
              )
            }
            ref={input => {
              if (
                shoppingCartDOMNodes["lastName"] === undefined &&
                input !== null
              ) {
                setShoppingCartNode("lastName", input);
              }
            }}
            onKeyPress={e => {
              if (e.charCode === 13) {
                shoppingCartDOMNodes["address"].focus();
              }
            }}
          />
          <input
            type="text"
            className="c-estimate-input c-estimate-input-full"
            placeholder="Street Address"
            value={currentQuote.address}
            onChange={e =>
              editQuoteAttribute(quoteNumber, "address", e.target.value)
            }
            ref={input => {
              if (
                shoppingCartDOMNodes["address"] === undefined &&
                input !== null
              ) {
                setShoppingCartNode("address", input);
              }
            }}
            onKeyPress={e => {
              if (e.charCode === 13) {
                shoppingCartDOMNodes["city"].focus();
              }
            }}
          />
          <input
            type="text"
            className="c-estimate-input c-estimate-input-third"
            placeholder="City"
            value={currentQuote.city}
            onChange={e =>
              editQuoteAttribute(quoteNumber, "city", e.target.value)
            }
            ref={input => {
              if (
                shoppingCartDOMNodes["city"] === undefined &&
                input !== null
              ) {
                setShoppingCartNode("city", input);
              }
            }}
            onKeyPress={e => {
              if (e.charCode === 13) {
                shoppingCartDOMNodes["state"].focus();
              }
            }}
          />
          <input
            type="text"
            className="c-estimate-input c-estimate-input-third"
            placeholder="State"
            value={currentQuote.state}
            onChange={e =>
              editQuoteAttribute(quoteNumber, "state", e.target.value)
            }
            ref={input => {
              if (
                shoppingCartDOMNodes["state"] === undefined &&
                input !== null
              ) {
                setShoppingCartNode("state", input);
              }
            }}
            onKeyPress={e => {
              if (e.charCode === 13) {
                shoppingCartDOMNodes["zipcode"].focus();
              }
            }}
          />
          <input
            type="text"
            className="c-estimate-input c-estimate-input-third"
            placeholder="ZIP"
            value={currentQuote.zipcode}
            onChange={e =>
              editQuoteAttribute(quoteNumber, "zipcode", e.target.value)
            }
            ref={input => {
              if (
                shoppingCartDOMNodes["zipcode"] === undefined &&
                input !== null
              ) {
                setShoppingCartNode("zipcode", input);
              }
            }}
            onKeyPress={e => {
              if (e.charCode === 13) {
                shoppingCartDOMNodes["phone"].focus();
              }
            }}
          />
          <input
            type="text"
            className="c-estimate-input c-estimate-input-half"
            placeholder="Phone"
            value={currentQuote.phone}
            onChange={e =>
              editQuoteAttribute(quoteNumber, "phone", e.target.value)
            }
            ref={input => {
              if (
                shoppingCartDOMNodes["phone"] === undefined &&
                input !== null
              ) {
                setShoppingCartNode("phone", input);
              }
            }}
            onKeyPress={e => {
              if (e.charCode === 13) {
                shoppingCartDOMNodes["email"].focus();
              }
            }}
          />
          <input
            type="text"
            className="c-estimate-input c-estimate-input-half"
            placeholder="Email"
            value={currentQuote.email}
            onChange={e =>
              editQuoteAttribute(quoteNumber, "email", e.target.value)
            }
            ref={input => {
              if (
                shoppingCartDOMNodes["email"] === undefined &&
                input !== null
              ) {
                setShoppingCartNode("email", input);
              }
            }}
            onKeyPress={e => {
              if (e.charCode === 13) {
                shoppingCartDOMNodes["scopeOfWork"].focus();
              }
            }}
          />
          <select
            className="c-estimate-estimator c-estimate-input c-estimate-input-half"
            value={estimator}
            onChange={e => {
              editQuoteAttribute(quoteNumber, "estimator", e.target.value);
            }}
          >
            <option value="">-Estimator-</option>
            <option value="Arnold Corona">Arnold Corona</option>
            <option value="Gary Banks">Gary Banks</option>
            <option value="John Chavez">John Chavez</option>
            <option value="John Gutierrez">John Gutierrez</option>
            <option value="Bob Leon">Bob Leon</option>
            <option value="Ricardo Rivera">Ricardo Rivera</option>
            <option value="Mike Rogers">Mike Rogers</option>
            <option value="Cameron Sterling">Cameron Sterling</option>
          </select>
          <div className="c-estimate-input-half dateDiv">
            <DateTimeField
              mode="date"
              dateTime={currentDate}
              format="MM-DD-YYYY"
              inputFormat="MM/DD/YYYY"
              onChange={props.handleChangeDate}
            />
          </div>
          <textarea
            className="c-estimate-input c-estimate-input-textarea"
            placeholder="Scope of Work"
            value={currentQuote.scopeOfWork}
            onChange={e =>
              editQuoteAttribute(quoteNumber, "scopeOfWork", e.target.value)
            }
            ref={input => {
              if (
                shoppingCartDOMNodes["scopeOfWork"] === undefined &&
                input !== null
              ) {
                setShoppingCartNode("scopeOfWork", input);
              }
            }}
            onKeyPress={e => {
              if (e.charCode === 13) {
                shoppingCartDOMNodes["products"][1] === undefined
                  ? shoppingCartDOMNodes["firstName"].focus()
                  : shoppingCartDOMNodes["products"][1].focus();
              }
            }}
          />
        </div>
        <EstimateWorksheet
          retrieveProducts={() => console.log("idk")}
          showMaterialInfo={showMaterialInfo}
          toggleShowMaterial={() => props.toggleShowMaterial(!showMaterialInfo)}
          shoppingCart={currentQuote.shoppingCart}
        />

        <div className="c-estimate-action-button-container">
          <div
            className="c-estimate-action-button c-estimate-back"
            onClick={() => props.changePage("home")}
          >
            Back
          </div>
          <div
            className="c-estimate-action-button c-estimate-save"
            onClick={() => props.saveQuoteToDatabase(currentDate, estimator)}
          >
            Save
          </div>
          <div
            className={`c-estimate-action-button c-estimate-total ${
              showTotal ? "" : "hidden"
            }`}
          >
            Total
            <br />${grandTotal}
          </div>
        </div>
        <Sidebar
          grandTotal={grandTotal}
          show={showSidebar}
          toggleShowModal={() => toggleShowModal(!showSidebar)}
          availableQuoteNumbers={availableQuoteNumbers}
          toggleEmailFile={toggleEmailFile}
          toggleAddProduct={toggleAddProduct}
          toggleAddTemplate={toggleAddTemplate}
          baseURL={baseURL}
          authToken={authToken}
        />
        <RemoveQuote
          show={removeQuoteModal}
          toggleRemoveQuote={() => toggleRemoveQuote(!removeQuoteModal)}
        />

        <EmailFile
          show={showEmailFile}
          toggleEmailFile={toggleEmailFile}
          name={`${currentQuote.customerFirstName} ${currentQuote.customerLastName}`}
          baseURL={baseURL}
          toggleLoading={toggleLoading}
        />

        <AddProduct
          show={showAddProduct}
          toggleAddProduct={() => toggleAddProduct(!showAddProduct)}
          getProducts={getProducts}
          baseURL={baseURL}
          authToken={authToken}
        />
        <AddTemplate
          show={showAddTemplate}
          toggleAddTemplate={() => toggleAddTemplate(!showAddTemplate)}
          getCategories={getCategories}
          baseURL={baseURL}
          authToken={authToken}
        />
      </div>
    </Loadable>
  );
};

export default enhance(Estimate);
