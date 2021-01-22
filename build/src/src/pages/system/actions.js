import * as t from "./actionTypes";
import api from "API/rpcMethods";

// pages > system

export const setStaticIp = staticIp => ({
  type: t.SET_STATIC_IP,
  staticIp
});

export const rebootHost = () => () => {
    api.rebootHost();
}
