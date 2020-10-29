import React, { useState } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
// Own module
import DeviceGrid from "./DeviceGrid";
import * as a from "../actions";
import { title } from "../data";
// Services
import { getDevices } from "services/devices/selectors";
import { getDappnodeParams } from "services/dappnodeStatus/selectors";
// Components
import Input from "components/Input";
import { ButtonLight } from "components/Button";
import Title from "components/Title";

const DevicesHome = ({
  deviceList,
  params,
  addDevice,
  removeDevice,
  resetDevice,
  toggleAdmin,
  getDeviceCredentials
}) => {


    const [id, setId] = useState("");
  return (
    <>
      <Title title="Connect (VPN)" />

      <Input
        placeholder="user login"
        value={id}
        // Ensure id contains only alphanumeric characters
        onValueChange={value => setId((value || "").replace(/\W/g, ""))}
        onEnterPress={() => {
          addDevice(id);
          setId("");
        }}
        append={
          <ButtonLight onClick={() => addDevice(id)}>Add user</ButtonLight>
        }
      />

      <DeviceGrid
        params={params}
        devices={deviceList}
        removeDevice={removeDevice}
        resetDevice={resetDevice}
        toggleAdmin={toggleAdmin}
        getDeviceCredentials={getDeviceCredentials}
      />
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  deviceList: getDevices,
  params: getDappnodeParams
});

const mapDispatchToProps = {
  addDevice: a.addDevice,
  getDeviceCredentials: a.getDeviceCredentials,
  removeDevice: a.removeDevice,
  resetDevice: a.resetDevice,
  toggleAdmin: a.toggleAdmin
};

// withLoading is applied at DevicesRoot
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DevicesHome);
