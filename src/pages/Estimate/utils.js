export const findAvailableQuoteNumbers = quotes => {
  return quotes
    ? Object.keys(quotes)
        .map(quote => Number(quote))
        .sort((a, b) => a - b)
    : [];
};

export const chooseEstimator = (quotesEstimator, localEstimator) => {
  return quotesEstimator === ""
    ? localEstimator === null || localEstimator === ""
      ? ""
      : localEstimator
    : quotesEstimator;
};

export const getCurrentDate = (stateDate, quotesDate) => {
  return stateDate === ""
    ? quotesDate === ""
      ? formatDate(new Date())
      : quotesDate
    : stateDate;
};

export const formatDate = date => {
  const month = date.getMonth();
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month < 10 ? 0 : ""}${month + 1}-${
    day < 10 ? 0 : ""
  }${day}-${year}`;
};
