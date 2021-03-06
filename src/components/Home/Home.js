import React, { Component } from "react";
import { connect } from "react-redux";
import logo from "../../assets/images/ezestimator_logo.png";
import Loadable from "react-loading-overlay";
import GoGear from "react-icons/lib/go/gear";
import Settings from "./Settings/Settings";

import { Button } from "react-bootstrap";
import { changePage } from "../../store/Page";

import "./Home.scss";

class Home extends Component {
  state = { showModal: false };

  toggleSettingsModal = showModal => {
    this.setState({ showModal });
  };

  redirectToComponent(component) {
    this.props.dispatch(changePage(component));
  }

  render() {
    const { showModal } = this.state;
    const { loading } = this.props.data;
    return (
      <Loadable active={loading} spinner text={`Loading`}>
        <div className="c-home-body">
          <Settings
            showModal={showModal}
            toggleSettingsModal={() => this.toggleSettingsModal(!showModal)}
          />
          <div
            className="c-home-gear"
            onClick={() => this.toggleSettingsModal(!showModal)}
          >
            <div className="c-home-gear-icon">
              <GoGear />
            </div>
            <div className="c-home-gear-text">Settings</div>
          </div>
          <img src={logo} alt="Estimate Logo" className="c-home-logo" />
          <div className="c-home-button-group">
            <Button
              bsSize="large"
              className="c-home-button c-home-button-top"
              onClick={() => this.redirectToComponent("estimate")}
            >
              Estimates
            </Button>
            <Button
              bsSize="large"
              className="c-home-button c-home-button-bottom"
              onClick={() => this.redirectToComponent("products")}
            >
              Products
            </Button>
            <Button
              bsSize="large"
              className="c-home-button c-home-button-bottom"
              onClick={() => this.redirectToComponent("phonelist")}
            >
              Phone List
            </Button>
          </div>
        </div>
      </Loadable>
    );
  }
}

export default connect(state => {
  return {
    page: state.page
  };
})(Home);
