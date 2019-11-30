import React, { Component } from "react";
import { connect } from "react-redux";
import { LargeModal } from "../../Common/SimpleModal";
import actions from "../../../redux/actions/actions";
import Loadable from "react-loading-overlay";
import request from "superagent";

import baseURL from "../../baseURL";

import "./AddProduct.scss";

export class AddProduct extends Component {
  state = {
    loadingProduct: false,
    group: "",
    supplier: "",
    keycode: "",
    specifications: "",
    sku: "",
    totalMaterial: "",
    labor: "",
    sortOrder: "",
    uom: "",
    keycodeError: false,
    specificationsError: false,
    totalMaterialError: false,
    laborError: false,
    photo: null
  };

  cleanState = {
    group: "",
    supplier: "",
    keycode: "",
    specifications: "",
    sku: "",
    totalMaterial: "",
    labor: "",
    sortOrder: "",
    uom: "",
    keycodeError: false,
    specificationsError: false,
    totalMaterialError: false,
    laborError: false,
    photo: null
  };

  updateProductProperty = (property, e) => {
    const newState = { [property]: e.target.value };

    if (
      ["keycode", "specifications", "totalMaterial", "labor"].includes(property)
    ) {
      newState[`${property}Error`] = false;
    }
    this.setState(newState);
  };

  formateDate = date => {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  handleToggle = () => {
    const { toggleAddProduct } = this.props;
    this.setState(prevState => {
      return {
        ...prevState,
        ...this.cleanState
      };
    });
    toggleAddProduct();
  };
  validateSubmissionValues = (
    keycode,
    specifications,
    sku,
    uom,
    totalMaterial,
    labor
  ) => {
    let errorObject = [];
    if (keycode === "") errorObject["keycodeError"] = true;
    if (specifications === "") errorObject["specificationsError"] = true;
    if (totalMaterial === "") errorObject["totalMaterialError"] = true;
    if (labor === "") errorObject["laborError"] = true;

    return errorObject;
  };
  handleSubmit = () => {
    const { baseURL, authToken, getProducts } = this.props;
    const {
      group,
      supplier,
      keycode,
      specifications,
      sku,
      uom,
      totalMaterial,
      labor,
      sortOrder
    } = this.state;
    const validationErrors = this.validateSubmissionValues(
      keycode,
      specifications,
      sku,
      uom,
      totalMaterial,
      labor
    );
    if (Object.keys(validationErrors).length === 0) {
      this.setState({ loadingProduct: true });
      request
        .post(`${baseURL}/products/add`)
        .send({
          authToken,
          product: {
            updated: this.formateDate(new Date()),
            misc: "$0.00",
            group,
            supplier,
            keycode,
            specifications,
            sku,
            uom: uom === "" ? "each" : uom,
            materialCost: `$${Number(totalMaterial).toFixed(2)}`,
            totalMaterial: `$${Number(totalMaterial).toFixed(2)}`,
            labor: `$${Number(labor).toFixed(2)}`,
            sortOrder
          }
        })
        .then(res => {
          this.setState({ loadingProduct: false });
          this.handleToggle();
          getProducts();
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      this.setState({
        ...validationErrors
      });
    }
  };

  renderGroupOptions = () => {
    let groups = [];
    let allProducts = JSON.parse(localStorage.getItem("products"));
    allProducts.forEach(product => {
      if (!groups.includes(product.group)) {
        groups.push(product.group);
      }
    });

    return groups
      .filter(group => group)
      .map(group => {
        return group === "" ? "" : group[0].toUpperCase() + group.slice(1);
      })
      .filter((group, i) => {
        return group !== "" && groups.indexOf(group) === i;
      })
      .sort()
      .map(group => {
        return (
          <option key={group} value={group}>
            {group}
          </option>
        );
      });
  };

  render() {
    const { show, toggleAddProduct, getProducts } = this.props;
    const {
      loadingProduct,
      group,
      supplier,
      keycode,
      specifications,
      sku,
      uom,
      totalMaterial,
      labor,
      sortOrder,
      laborError,
      keycodeError,
      totalMaterialError,
      specificationsError,
      photo
    } = this.state;
    return (
      <LargeModal
        open={show}
        toggle={this.handleToggle}
        className="c-addproduct-modal"
      >
        <Loadable
          active={loadingProduct}
          spinner
          text={`Updating Product Info`}
        >
          <div className="c-addproduct-body">
            <div className="c-addproduct-header">Add Product</div>
            <div className="c-addproduct-group">
              <div className="c-addproduct-prop">Desired Key Code</div>
              <input
                type="text"
                className={`c-addproduct-value ${keycodeError ? "error" : ""}`}
                value={keycode}
                onChange={e => this.updateProductProperty("keycode", e)}
              />
            </div>
            <div className="c-addproduct-group">
              <div className="c-addproduct-prop">Photo</div>
              <label
                htmlFor="product-photo"
                className={`c-addproduct-prop photo-label ${
                  photo ? "uploaded" : ""
                }`}
              >
                {photo ? "Uploaded" : "Upload..."}
              </label>
              <input
                type="file"
                accept="image/*"
                id="product-photo"
                onChange={e => this.setState({ photo: e.target.files[0] })}
              />
            </div>
            <div className="c-addproduct-group">
              <div className="c-addproduct-prop">Specifications</div>
              <textarea
                className={`c-addproduct-value ${
                  specificationsError ? "error" : ""
                }`}
                rows="4"
                value={specifications}
                onChange={e => this.updateProductProperty("specifications", e)}
              ></textarea>
            </div>
            <div className="c-addproduct-group">
              <div className="c-addproduct-prop">SKU</div>
              <input
                type="text"
                className="c-addproduct-value"
                value={sku}
                onChange={e => this.updateProductProperty("sku", e)}
              />
            </div>
            <div className="c-addproduct-group">
              <div className="c-addproduct-prop">Unit of Measure</div>
              <input
                type="text"
                className="c-addproduct-value"
                value={uom}
                onChange={e => this.updateProductProperty("uom", e)}
              />
            </div>
            <div className="c-addproduct-group">
              <div className="c-addproduct-prop">Material Cost</div>
              <input
                type="number"
                className={`c-addproduct-value ${
                  totalMaterialError ? "error" : ""
                }`}
                value={totalMaterial}
                onChange={e => this.updateProductProperty("totalMaterial", e)}
              />
            </div>
            <div className="c-addproduct-group">
              <div className="c-addproduct-prop">Labor Cost</div>
              <input
                type="number"
                className={`c-addproduct-value ${laborError ? "error" : ""}`}
                value={labor}
                onChange={e => this.updateProductProperty("labor", e)}
              />
            </div>
            <div className="c-addproduct-group">
              <div className="c-addproduct-prop">Add to Existing Group?</div>
              <select
                className="c-addproduct-value"
                value={group}
                onChange={e => this.updateProductProperty("group", e)}
              >
                <option value="">-Select-</option>
                {this.renderGroupOptions()}
                <option value="other">Other</option>
              </select>
            </div>
            <div className="c-addproduct-group">
              <div className="c-addproduct-prop">Supplier</div>
              <select
                className="c-addproduct-value"
                value={supplier}
                onChange={e => this.updateProductProperty("supplier", e)}
              >
                <option value="">-Select-</option>
                <option value="Walters Wholesale Electrical">
                  Walters Wholesale Electrical
                </option>
                <option value="Home Depot">Home Depot</option>
                <option value="Lowes">Lowes</option>
                <option value="Ferguson">Ferguson</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="c-addproduct-group">
              <div className="c-addproduct-prop">Sort Order</div>
              <input
                type="number"
                className="c-addproduct-value"
                value={sortOrder}
                onChange={e => this.updateProductProperty("sortOrder", e)}
              />
            </div>
            <div className="c-addproduct-submit" onClick={this.handleSubmit}>
              Submit
            </div>
          </div>
        </Loadable>
      </LargeModal>
    );
  }
}

export default AddProduct;
