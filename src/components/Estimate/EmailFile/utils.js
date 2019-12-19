import * as R from "ramda";
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const determineSubmitError = (name, email, fileSelection) => {
  if (R.either(R.isNil, R.isEmpty)(fileSelection))
    return "Please select document type";
  if (R.either(R.isNil, R.isEmpty)(name))
    return "Please enter recepient's name";
  if (R.either(R.isNil, R.isEmpty)(email))
    return "Please enter recepient's email";
  if (!emailRegex.test(email)) {
    return "Please use correct format for recepient's email";
  }
  return false;
};
