import React from "react";
import logo from "img/dappnode-logo-wide-min.png";
import WifiOff from "Icons/WifiOff";
import "./nonAdmin.css";

const NoConnection = () => (
  <div className="standalone-container">
    <div className="toplogo">
      <WifiOff scale={3} />
    </div>
    <div className="title">Could not connect to AVADO</div>
    <div className="text">
      Please make sure your WiFi or VPN connection is still active. Otherwise, stop the
      connection and reconnect and try accessing this page again. If the
      problems persist, please reach us via{" "}
      <a href="https://t.me/joinchat/F_LlkBLEoDrFioPNviEpsQ">Telegram</a> 
      .
    </div>
    {/* <div className="separator" /> */}
    {/* <img className="logo" src={logo} alt="logo" /> */}
  </div>
);

export default NoConnection;
