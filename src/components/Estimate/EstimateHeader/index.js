import React from "react";
import MdMenu from "react-icons/lib/md/menu";
import TiArrowLeftOutline from "react-icons/lib/ti/arrow-left-outline";
import TiArrowRightOutline from "react-icons/lib/ti/arrow-right-outline";
import ToggleButton from "react-toggle";

import logo from "../../../assets/images/ezestimator_logo.png";

const EstimateHeader = props => {
  return (
    <div>
      <div className="c-estimate-sidebar-container">
        <div
          className="c-estimate-action-button c-estimate-sidebar"
          onClick={() => props.toggleShowModal(!props.showSidebar)}
        >
          <MdMenu />
        </div>
      </div>
      <div className="c-estimate-header">
        <div className="c-estimate-next-quote">
          <TiArrowLeftOutline onClick={props.decrementQuoteNumber} />
          <div className="c-estimate-next-quote-page">#{props.quoteNumber}</div>
          <TiArrowRightOutline onClick={props.incrementQuoteNumber} />
        </div>
        <div
          className="c-estimate-remove-quote"
          onClick={() => props.toggleRemoveQuote(!props.removeQuoteModal)}
        >
          Remove Quote
        </div>
        <div className="c-estimate-logo-container">
          <img src={logo} alt="Estimate Logo" className="c-estimate-logo" />
        </div>
        <ToggleButton
          className="c-estimate-show-total"
          checked={props.showTotal}
          icons={{ checked: null, unchecked: null }}
          onChange={() => props.toggleShowTotal(!props.showTotal)}
        />
      </div>
    </div>
  );
};

export default EstimateHeader;
