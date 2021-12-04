/**
 * Zt WAMP RPC METHODS
 * This file describes the available RPC methods of the Zt module
 * It serves as documentation and as a mechanism to quickly add new calls
 *
 * Each key of this object is the last subdomain of the entire event:
 *   event = "<method>.zt.dnp.dappnode.eth"
 *   Object key = "addDevice"
 */

export default {
  /**
   * [ping]
   * Default method to check if app is alive
   *
   * @returns {*}
   */
  ping: {},

  /**
   * [addDevice]
   * Adds a node to the Zt network
   *
   * @param {string} id Zt node id
   * @returns {string}
   */
  addDevice: {
    manadatoryKwargs: ["id"]
  },

  /**
   * [removeDevice]
   * Removes the node with the provided id, if exists.
   *
   * @param {string} id Device id name
   */
  removeDevice: {
    manadatoryKwargs: ["id"]
  },

  /**
   * [listDevices]
   * Returns a list of the existing nodes in the network
   *
   * @param {string} id Device id name
   * @returns {object} devices = [{
   *   id: "myDevice", {string}
   *   admin: true {bool}
   * }]
   */
  listDevices: {},

  /**
   * [getParams]
   * Returns the current Zt network information
   *
   * @returns {object} result: {
   * }
   */
  getParams: {},

};
