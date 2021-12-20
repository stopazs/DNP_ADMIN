import React, { useEffect } from "react";
import ClipboardJS from "clipboard";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { superAdminId } from "services/devices/data";
// Components
import Card from "components/Card";
import Switch from "components/Switch";
import { confirm } from "components/ConfirmDialog";
// Helpers
// import downloadVpnCredentials from "../helpers/downloadVpnCredentials";
// Utils
import newTabProps from "utils/newTabProps";
// Icons
import { MdDelete, MdRefresh, MdShare } from "react-icons/md";
import { FaQrcode, FaDownload } from "react-icons/fa";
import { GoClippy } from "react-icons/go";
import "./devices.css";
import { connect } from "react-redux";
import { getDappnodeParams } from "services/dappnodeStatus/selectors";
import { createStructuredSelector } from "reselect";

function DeviceGrid({
    devices,
    params,
    removeDevice,
    resetDevice,
    toggleAdmin,
    getDeviceCredentials,
    dappnodeParams
}) {

    console.log("params", params)
    console.log("dappnodeParams", dappnodeParams)

    // Activate the copy functionality
    useEffect(() => {
        new ClipboardJS(".copy");
    }, []);

    function removeDeviceConfirm(id) {
        confirm({
            title: `Removing ${id} device`,
            text: "The user using this device will lose access to this DAppNode ",
            label: "Remove",
            onClick: () => removeDevice(id)
        });
    }

    function resetDeviceConfirm(id) {
        const numOfAdmins = devices.filter(({ admin }) => admin).length;
        if (id === superAdminId || numOfAdmins === 1) {
            confirm({
                title: `WARNING! Reseting super admin`,
                text:
                    "You should only reset the credentials of the super admin if you suspect an unwanted party gained access to this credentials. If that is the case, reset the credentials, BUT download and install the new credentials IMMEDIATELY. Otherwise, you will lose access to your DAppNode when this connection stops",
                label: `Reset ${id}`,
                onClick: () => resetDevice(id)
            });
        } else {
            confirm({
                title: `Reseting ${id} device`,
                text:
                    "All profiles and links pointing to this device will no longer be valid",
                label: "Reset",
                onClick: () => resetDevice(id)
            });
        }
    }

    // function download(id) {
    //   const device = devices.find(d => d.id === id);
    //   if (device) downloadVpnCredentials(device);
    // }

    return (
        <Card className="list-grid devices">
            <header>Name</header>
            <header className="center">Share</header>
            <header>Admin</header>
            <header>Reset</header>
            <header>Remove</header>
            {devices.map(({ id, admin, url }) => {
                let url2;
                if (url && params) {
                    //                    url2 = `${url.replace(params.domain,params.internalIp).replace("?",`?domain=${params.domain}&ip=${params.internalIp}&`)}`;
                    // url2 = `http://my.ava.do${url2.split(":")[1]}`;
                    url2 = `http://my.ava.do:8090/?localip=${params.internalip}&ip=${params.ip}&${url.split("?")[1]}`;
                }

                return ({ id: id, admin: admin, url: url, url2: url2 })
            }).map(({ id, admin, url, url2 }) => {
                return (
                    <React.Fragment key={id}>
                        <div className="name">{id}</div>
                        {url ? (
                            <div className="group no-a-style">
                                <NavLink to={"/devices/" + id}>
                                    <FaQrcode className="bigger" />
                                </NavLink>
                                <GoClippy className="copy" data-clipboard-text={url} />
                                {/* <a href={url} {...newTabProps}>
                                    <FaDownload className="smaller" />
                                </a> */}
                                {url2 && (
                                    <a href={url2} {...newTabProps}>
                                        <FaDownload className="smaller" />
                                    </a>
                                )}
                            </div>
                        ) : (
                            <MdShare onClick={() => getDeviceCredentials(id)} />
                        )}
                        <Switch checked={admin} onToggle={() => toggleAdmin(id)} />
                        <MdRefresh onClick={() => resetDeviceConfirm(id)} />
                        <MdDelete
                            className={admin ? "disabled" : ""}
                            onClick={() => (admin ? null : removeDeviceConfirm(id))}
                        />
                        <hr />
                    </React.Fragment>
                )
            })}
        </Card>
    );
}

DeviceGrid.propTypes = {
    devices: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            admin: PropTypes.bool.isRequired,
            url: PropTypes.string
        })
    ).isRequired,
    removeDevice: PropTypes.func.isRequired,
    resetDevice: PropTypes.func.isRequired,
    toggleAdmin: PropTypes.func.isRequired,
    getDeviceCredentials: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
    dappnodeParams: getDappnodeParams
});

const mapDispatchToProps = {
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DeviceGrid);

