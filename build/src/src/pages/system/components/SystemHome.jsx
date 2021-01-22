import React from "react";
import { title } from "../data";
// Modules
import packages from "pages/packages";
// Components
// import StaticIp from "./StaticIp";
import Title from "components/Title";
import { connect } from "react-redux";
import * as a from "../actions";
import { createStructuredSelector } from "reselect";
import { confirmAlert } from 'react-confirm-alert'; // Import

const PackageList = packages.components.PackageList;


const SystemHome = ({ rebootHost }) => {

    const rebooting = () => {



        confirmAlert({
            customUI: ({ onClose }) => {
                rebootHost();
                return (
                    <div className="confirm-dialog-root">
                        <div className="dialog">
                            <h3 className="title">Rebooting</h3>
                            <div className="text">Your AVADO is now rebooting.<br />You will be disconnected from the VPN or Wifi.<br />Please wait a few minutes and re-connect to the WiFi or VPN and refresh this page.</div>
                            <div className="buttons">
                                <button className="btn btn-outline-secondary" onClick={() => {
                                    onClose()
                                }} type="button">Dismiss</button>
                            </div>
                        </div>
                    </div>
                );
            }
        });
    }

    const rebootConfirm = () => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className="confirm-dialog-root">
                        <div className="dialog">
                            <h3 className="title">Reboot my AVADO box</h3>
                            <div className="text">Are you sure you want to reboot your AVADO?<br />Your settings will be saved and your packages will restart after the reboot.</div>
                            <div className="buttons">
                                <button className="btn btn-outline-secondary" onClick={onClose} type="button">Cancel</button>
                                <button className="btn btn-outline-danger" onClick={() => {
                                    onClose();
                                    rebooting();
                                }} type="button">Reboot</button>
                            </div>
                        </div>
                    </div>
                );
            }
        });

    }

    return (
        <>
            <Title title={title} />

            {/* <StaticIp /> */}

            <div className="section-subtitle">Packages</div>
            <PackageList moduleName={title} coreDnps={true} />

            <button className="btn btn-outline-secondary" type="button" onClick={rebootConfirm}>REBOOT MY AVADO</button>


        </>
    )
};




const mapStateToProps = createStructuredSelector({
    // coreProgressLogs: state => getProgressLogsByDnp(state, coreName)
});

// Uses bindActionCreators to wrap action creators with dispatch
const mapDispatchToProps = {
    rebootHost: a.rebootHost,

};
export default connect(

    mapStateToProps,
    mapDispatchToProps
)(SystemHome);


