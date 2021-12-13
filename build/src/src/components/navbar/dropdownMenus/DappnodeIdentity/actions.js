import api from "API/rpcMethods";

export const setName = (name) => () => {
  api.setName({ name });
}
