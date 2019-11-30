import React from "react";

import enhance from "./enhance";
import "./Main.scss";

const Main = ({
  loading,
  authToken,
  baseURL,
  getCategories,
  getQuotes,
  getProducts,
  getCompleteData,
  Component,
  quoteBusy
}) => {
  const data = { loading, baseURL, authToken, quoteBusy };
  const functions = {
    getCategories,
    getQuotes,
    getProducts,
    getCompleteData
  };
  return (
    <Component
      {...data}
      {...functions}
      data={data}
      functions={functions}
      getCompleteData={getCompleteData}
    />
  );
};

export default enhance(Main);
