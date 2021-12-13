import React from "react";
import PropTypes from "prop-types";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import BaseDropdown from "../BaseDropdown";
import makeBlockie from "ethereum-blockies-base64";
import { getDappnodeIdentityClean, getDappnodeParams } from "services/dappnodeStatus/selectors";
import CTE from "react-click-to-edit";
import "./DappnodeIdentity.css"
import * as a from "./actions";

const DappnodeIdentity = ({ dappnodeParams = {}, setName }) => {

    if (typeof dappnodeParams !== "object") {
        console.error("dappnodeParams must be an object");
        return null;
    }

    const fullIdentity = {
        // ...dappnodeParams,
        "External IP": dappnodeParams.ip,
        "Internal IP": dappnodeParams.internalip || dappnodeParams.internalIp,
        // "Name": dappnodeParams.name,
        // "External host name" : dappnodeParams.domain,
        // "NAT Loopback available" : dappnodeParams.noNatLoopback ? "No" : "Yes",
        // "Upnp available" : dappnodeParams.upnpAvailable ? "Yes" : "No",
    }

    const name = dappnodeParams.name;

    // Show a 24x24px blockie icon from the DAppNode's domain or ip+name
    // const { name = "", ip = "", domain = "" } = fullIdentity;
    const seed = `${dappnodeParams.nodeid}${name}` || `${name}`;

    const Icon = () => (
        <React.Fragment>
            {seed ? (
                <img src={makeBlockie(seed)} className="blockies-icon" alt="icon" />
            ) : (
                "?"
            )}
        </React.Fragment>
    );

    return (
        <>{name && (
            <>
                <CTE
                    wrapperClass="dappnode-name svg-text mr-2"
                    textClass="text"
                    inputClass="text white"
                    initialValue={`${name}`}
                    endEditing={(value) => {
                        console.log(`Set name to ${value}`);
                        setName(value);
                    }}
                />
            </>)
        }
            <BaseDropdown
                name="My AVADO"
                messages={Object.entries(fullIdentity)
                    .filter(([_, value]) => value)
                    .map(([key, value]) => {
                        return { title: key, body: value }; //parseIdentityKeyValue(key, value) };
                    })}
                Icon={Icon}
                className={"dappnodeidentity"}
                placeholder="No identity available, click the report icon"
            />
        </>
    );
};

DappnodeIdentity.propTypes = {
    // dappnodeIdentity: PropTypes.object.isRequired,
    dappnodeParams: PropTypes.object.isRequired
};

const mapStateToProps = createStructuredSelector({
    //   dappnodeIdentity: getDappnodeIdentityClean,
    dappnodeParams: getDappnodeParams
});

const mapDispatchToProps = {
    setName: a.setName,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DappnodeIdentity);
