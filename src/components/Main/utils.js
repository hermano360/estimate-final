export const shouldPropertyUpdate = (accessDate, daysToExpire = 1) => {
  const oneDay = 86400000;
  return (
    new Date().getTime() - accessDate > oneDay * daysToExpire ||
    accessDate === null
  );
};
