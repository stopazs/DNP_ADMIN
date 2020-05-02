import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { fetchDappnodeStats } from "services/dappnodeStatus/actions";
// Selectors
import { getDappnodeVolumes } from "services/dnpInstalled/selectors";
import { getChainData } from "services/chainData/selectors";
import { getDappnodeStats } from "services/dappnodeStatus/selectors";
// Own module
import { title } from "../data";
import ChainCard from "./ChainCard";
import StatsCard from "./StatsCard";
import VolumeCard from "./VolumeCard";
import "./dashboard.css";
// Components
import SubTitle from "components/SubTitle";
import Title from "components/Title";
import * as s from "../../packages/selectors.js";

import "../../installer/components/installer.css";
import errorAvatar from "img/errorAvatar.png";
import ipfsLogo from "img/IPFS-badge-small.png";
import defaultAvatar from "img/defaultAvatar.png";
// Utility components
import Card from "components/Card";
import Button from "components/Button";
import { stringIncludes } from "utils/strings";



/**
 * @param {array} chainData = [{
 *   name: "Mainnet",
 *   message: "Syncing 4785835/3748523",
 *   progress: 0.647234,
 *   syncing: true
 * }, ... ]
 * @param {object} dappnodeStats = {
 *   cpu: 35%,
 *   disk: 86%,
 *   memory: 56%
 * }
 * @param {array} dappnodeVolumes = [{
 *   name: "Ethchain size",
 *   size: "53.45 GB"
 * }, ... ]
 */

function Dashboard({
    chainData,
    dappnodeStats,
    dappnodeVolumes,
    fetchDappnodeStats,
    installedpackages,
    history
}) {
    useEffect(() => {
        const interval = setInterval(fetchDappnodeStats, 5 * 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    const hashToUrl = (hash) => {
        if (!hash) {
            return null;
        }
        return `http://my.ipfs.dnp.dappnode.eth:8080/ipfs/${hash.replace("/ipfs/", "")}`
    };

    const openDnp = (name) => {
        history.push(`/Packages/${name}`);
    }


    return (
        <>
            <Title title={"Home"} />

            <SubTitle>Health</SubTitle>
            <div className="dashboard-cards">
                {Object.entries(dappnodeStats).map(([id, percent], i) => (
                    <StatsCard key={i} id={id} percent={percent} />
                ))}
            </div>

            {chainData && chainData.length > 0 && (
                <>
                    <SubTitle>Chains</SubTitle>
                    <div className="dashboard-cards">
                        {chainData.map((chain, i) => (
                            <div key={i}>
                                <ChainCard {...chain} />
                            </div>
                        ))}
                    </div>
                </>
            )}

            <SubTitle>Active Packages</SubTitle>

            <div className="dnp-cards">
                {installedpackages.filter((dnp) => { return dnp.isCore === false; }).map((dnp, i) => {
                    if (!dnp || !dnp.manifest) return;
                    const { manifest, origin, tag } =
                        dnp || {};
                    const { name, description, keywords = [] } = manifest || {};
                    /* Show the button as disabled (gray) if it's updated */
                    const disabled = stringIncludes(tag, "updated");
                    /* Rename tag from "install" to "get" because there were too many "install" tags 
                       Cannot change the actual tag because it is used for logic around the installer */
                    // const tagDisplay = tag === "OPEN" ? "GET" : tag;
                    return (
                        <Card
                            key={`${name}_${origin}_${i}`}
                            className="dnp-card"
                            shadow
                            onClick={() => openDnp(dnp.name)}
                        >
                            <img src={hashToUrl(manifest.avatar)} alt="avatar" />
                            <div className="info">
                                <h5 className="title">{name}</h5>
                                <div>{description}</div>
                                <div className="keywords">
                                    {origin && typeof origin === "string" ? (
                                        <div className="ipfs">
                                            <img src={ipfsLogo} alt="ipfs" />
                                            <span>{origin.replace("/ipfs/", "")}</span>
                                        </div>
                                    ) : (
                                            keywords.join(", ") || "DAppNode package"
                                        )}
                                </div>
                                <Button variant="dappnode" pill disabled={disabled}>
                                    OPEN
                                </Button>
                            </div>
                        </Card>
                    )
                })
                }
            </div>

            {/* {installedpackages.map((i) => (
                <pre>{JSON.stringify(i, null, 2)}</pre>
            ))} */}

            {/* <SubTitle>Volumes</SubTitle>
      <div className="dashboard-cards">
        {dappnodeVolumes.map(vol => (
          <VolumeCard key={vol.name} {...vol} />
        ))}
      </div> */}
        </>
    );
}

Dashboard.propTypes = {
    installedpackages: PropTypes.array.isRequired,
    chainData: PropTypes.array.isRequired,
    dappnodeStats: PropTypes.object.isRequired,
    dappnodeVolumes: PropTypes.array.isRequired
};

const mapStateToProps = createStructuredSelector({
    chainData: getChainData,
    dappnodeStats: getDappnodeStats,
    dappnodeVolumes: getDappnodeVolumes,
    installedpackages: s.getFilteredPackages,
});

// Uses bindActionCreators to wrap action creators with dispatch
const mapDispatchToProps = {
    fetchDappnodeStats
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Dashboard);
