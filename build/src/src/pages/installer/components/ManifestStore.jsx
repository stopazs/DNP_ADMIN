import React from "react";
import PropTypes from "prop-types";
// Imgs
// import errorAvatar from "img/errorAvatar.png";
// import ipfsLogo from "img/IPFS-badge-small.png";
// import defaultAvatar from "img/defaultAvatar.png";
// Utility components
import Card from "components/Card";
import Button from "components/Button";
// import { stringIncludes } from "utils/strings";

function DnpStore({ directory, openDnp }) {

    const hashToUrl = (hash) => {
        return `http://my.ipfs.dnp.dappnode.eth:8080/ipfs/${hash.replace("/ipfs/", "")}`
    };
// debugger;
    directory = directory.filter((item)=>{
        if (!item || !item.manifest || !item.manifest.hidden === true) return true;
        return false;
    })


    return (
        <div className="dnp-cards">
            {directory.map(p => {
                // console.log(p);
                // const { manifest, error, avatar = defaultAvatar, origin, tag } =
                //   dnp || {};
                const { title, name, version, description, avatar, avadocategory } = p.manifest || {};
                // console.log(p.manifest);
                /* Show the button as disabled (gray) if it's updated */
                // const disabled = stringIncludes(tag, "updated");
                /* Rename tag from "install" to "get" because there were too many "install" tags 
                   Cannot change the actual tag because it is used for logic around the installer */

                const tagDisplay = p.installed ? "DETAILS" : "INSTALL";
                const hasUpdate = p.installed && p.installedVersion && version !== p.installedVersion;
                return (
                    <Card
                        key={name + origin}
                        className="dnp-card"
                        shadow
                        onClick={() => openDnp(p.manifesthash)}
                    >
                        <img src={hashToUrl(avatar)} alt="avatar" />
                        <div className="info">
                            <h5 className="title">{title || name}</h5>
                            <div>{version}</div>
                            {p.installed && (
                                <div className="keywords">
                                    <div className="ipfs">
                                        <span>installed {p.installedVersion}</span>
                                    </div>
                                </div>)}
                            {hasUpdate ? (
                                <Button variant="dappnode attention" pill>UPDATE</Button>
                            ) : (
                                <Button variant="dappnode" pill>{tagDisplay}</Button>
                                )}
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}

DnpStore.propTypes = {
    directory: PropTypes.array.isRequired,
    openDnp: PropTypes.func.isRequired
};

// Use `compose` from "redux" if you need multiple HOC
export default DnpStore;
