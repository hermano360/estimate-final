import baseURL from "../pages/baseURL";

export function makeApiTypes(action, namespace) {
  action = action.toUpperCase();
  const types = {};
  ["REQUEST", "SUCCESS", "ERROR"].forEach(
    t => (types[`${action}_${t}`] = `${namespace}/${action}_${t}`)
  );
  return { ...types };
}

export const getApiPath = endpoint => `${baseURL}/${endpoint}`;
