import React from "react";
import PropTypes from "prop-types";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import BaseDropdown from "./BaseDropdown";
import makeBlockie from "ethereum-blockies-base64";
import { getDappnodeIdentityClean, getDappnodeParams } from "services/dappnodeStatus/selectors";

/**
 * Patch to fix the visual issue of the domain being too long.
 * With the <wbr> (word break opportunity) the domain will be shown as:
 *  12ab34ab12ab23ab
 *  .dyndns.dappnode.io
 * @param {string} key
 * @param {string} value
 */
function parseIdentityKeyValue(key, value) {
    if (key.includes("domain")) {
        const [hex, rootDomain] = value.split(/\.(.+)/);
        return (
            <>
                {hex}
                <wbr />.{rootDomain}
            </>
        );
    } else {
        return value;
    }
}

const DappnodeIdentity = ({ dappnodeParams = {} }) => {
    // if (typeof dappnodeIdentity !== "object") {
    //     console.error("dappnodeIdentity must be an object");
    //     return null;
    //   }
    if (typeof dappnodeParams !== "object") {
        console.error("dappnodeParams must be an object");
        return null;
    }

    const fullIdentity = {
        // ...dappnodeParams,
        "External IP": dappnodeParams.ip,
        "Internal IP": dappnodeParams.internalIp,
        "name" : dappnodeParams.name,
        "External host name" : dappnodeParams.domain,
        "NAT Loopback available" : dappnodeParams.noNatLoopback ? "No" : "Yes",
        "Upnp available" : dappnodeParams.upnpAvailable ? "Yes" : "No",
    }
    
    // Show a 24x24px blockie icon from the DAppNode's domain or ip+name
    const { name = "", ip = "", domain = "" } = fullIdentity;
    const seed =
        domain && domain.includes(".") ? domain.split(".")[0] : `${name}${ip}`;

    const Icon = () => (
        <React.Fragment>
            <span className="dappnode-name svg-text mr-2">{name}</span>
            {seed ? (
                <img src={makeBlockie(seed)} className="blockies-icon" alt="icon" />
            ) : (
                    "?"
                )}
        </React.Fragment>
    );

    return (
        <BaseDropdown
            name="My AVADO box"
            messages={Object.entries(fullIdentity)
                .filter(([_, value]) => value)
                .map(([key, value]) => {
                    return { title: key, body: value }; //parseIdentityKeyValue(key, value) };
                })}
            Icon={Icon}
            className={"dappnodeidentity"}
            placeholder="No identity available, click the report icon"
        />
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

export default connect(
    mapStateToProps,
    null
)(DappnodeIdentity);
