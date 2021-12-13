import React from "react";
import { title } from "../data";
// Modules
import packages from "pages/packages";
import Card from "components/Card";
// Components
// import StaticIp from "./StaticIp";
import Title from "components/Title";
import { connect } from "react-redux";
import * as a from "../actions";
import { createStructuredSelector } from "reselect";
import { confirmAlert } from 'react-confirm-alert'; // Import
import "./system.css";

const PackageList = packages.components.PackageList;


const SystemHome = ({ rebootHost, runSignedCmd }) => {

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


    const confirmSignedCmd = (cmd, desc) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className="confirm-dialog-root">
                        <div className="dialog">
                            <h3 className="title">{desc.title}</h3>
                            <div className="text">{desc.text}</div>
                            <div className="buttons">
                                <button className="btn btn-outline-secondary" onClick={onClose} type="button">Cancel</button>
                                <button className="btn btn-outline-danger" onClick={() => {
                                    runSignedCmd(cmd);
                                    onClose();
                                }} type="button">Start!</button>
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

            <Title title="Maintenance" />



            <Card className="list-grid maintenance">
                <table>
                    <tbody>
                    <tr>
                        <td>
                            <button className="btn fullwidth btn-outline-secondary" type="button" onClick={rebootConfirm}>REBOOT MY AVADO</button>
                        </td>
                        <td>
                            <div>Reboot your AVADO. Useful if a package is misbehaving or CPU is at 100%</div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button className="btn fullwidth btn-outline-secondary" type="button" onClick={() => {
                                confirmSignedCmd(
                                    {
                                        "command": "docker image prune -a -f",
                                        "sig": "0x1d12a4062ccf7d95d2dc82776bd56558d195993b4a3ebc0f0b89476134e393cc1ac5fa627139dddb97568a7ac5feab3225ad0ceba27872501fa1baa8a5ec618d1b"
                                    }   
                                    , {
                                        title: "Clean up disk",
                                        text: "Are you sure you want to perform a disk cleanup ?"
                                    })
                            }}>DISK CLEANUP</button>
                        </td>
                        <td>
                            <div>Clean your SSD from left-over package data. (This will not remove any package data that is in use.)</div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button className="btn fullwidth btn-outline-secondary" type="button" onClick={() => {
                                confirmSignedCmd(
                                    {
                                        "command": "shutdown",
                                        "sig": "0x8d40739e777533e8c85eed161640dc3307277a0c4a827abe13139cf2b777b52006af67e7c65bd4273fd2b2c5a60d907b38f5420c4eaff5f4eccc0c05cb6918e41b"
                                      }   
                                    , {
                                        title: "Shut down your AVADO",
                                        text: "Are you sure you want to shut down your AVADO ?"
                                    })
                            }}>SHUTDOWN</button>
                        </td>
                        <td>
                            <div>Stop all packages and shut down your AVADO. Press the power button to power on again.</div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </Card>






        </>
    )
};




const mapStateToProps = createStructuredSelector({
    // coreProgressLogs: state => getProgressLogsByDnp(state, coreName)
});

// Uses bindActionCreators to wrap action creators with dispatch
const mapDispatchToProps = {
    rebootHost: a.rebootHost,
    runSignedCmd: a.runSignedCmd,
};
export default connect(

    mapStateToProps,
    mapDispatchToProps
)(SystemHome);


