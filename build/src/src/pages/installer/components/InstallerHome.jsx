import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import withTitle from "components/hoc/withTitle";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
// This page
import * as a from "../actions";
import * as s from "../selectors";
import isIpfsHash from "utils/isIpfsHash";
import isDnpDomain from "utils/isDnpDomain";
import { correctPackageName } from "../utils";
import filterDirectory from "../helpers/filterDirectory";
import { rootPath } from "../data";
import NoPackageFound from "./NoPackageFound";
import TypeFilter from "./TypeFilter";
import ManifestStore from "./ManifestStore";
import PackageStore from "./PackageStore";
// Components
import Input from "components/Input";
import { ButtonLight } from "components/Button";
import Loading from "components/generic/Loading";
import Error from "components/generic/Error";
// Selectors
import { getMainnet } from "services/chainData/selectors";
import {
    getIsLoading,
    getLoadingError
} from "services/loadingStatus/selectors";
import { rootPath as packagesRootPath } from "pages/packages/data";
// Styles
import "./installer.css";
import IsSyncing from "./IsSyncing";
import axios from "axios";
import SubTitle from "components/SubTitle";

function InstallerHome({
    // variables
    id,
    directory,
    mainnet,
    loading,
    error,
    history,
    // Actions
    fetchPackageData,
    fetchPackageDataFromQuery,
    packages,
    match
}) {
    const [query, setQuery] = useState("");
    const [selectedTypes, setSelectedTypes] = useState({});
    const [storeManifest, setStoreManifest] = useState();
    const [displayManifest, setDisplayManifest] = useState();

    const peerConnect = (peer) => {
        console.log(`connecting to ${peer}`);
        const apiLink = `http://ipfs.my.ava.do:5001/api/v0/swarm/connect?arg=${peer}`;
        axios
            .post(
                apiLink
            )
            .then(res => {
                if (res && res.status === 200){
                    console.log("Connected.");
                }
                // debugger;
                // console.log("");
            })
            .catch(error => {
                // debugger;
                console.log(`Failed to connect to ${apiLink}`, error.message);
            });
    };

    useEffect(() => {
        if (packages && storeManifest && packages.length > 0) {
            storeManifest.packages = storeManifest.packages.map((p) => {
                // console.log(p);
                const installedPackage = packages.find((installedpackage) => {
                    // console.log(`check package ${installedpackage.name}`);
                    return installedpackage.name === p.manifest.name
                });
                if (installedPackage) {
                    p.installed = true;
                    p.installedVersion = installedPackage.version;
                    // debugger;
                }
                return p;
            });
            setDisplayManifest(storeManifest);
        }
    }, [packages, storeManifest]);


    useEffect(() => {
        axios
            .get(
                `https://bo.ava.do/value/store`
            )
            .then(res => {
                const storeRes = JSON.parse(res.data);
                const storeHash = (id && id !== "undefined") ? id : storeRes.hash;
                if (storeRes && storeRes.ipfsHostNodes) {
                    storeRes.ipfsHostNodes.map(peerConnect);
                }
                //  const storeHash = "QmekF1EwLrfSwm4mjRHaBGrHmRafYBLTTz2Ymx5nszdaan";
                axios
                    .get(
                        `http://ipfs.my.ava.do:8080/ipfs/${storeHash}`
                    )
                    .then(res => {
                        const storeManifest = res.data;
                        if (storeManifest && storeManifest.ipfsHostNodes) {
                            storeManifest.ipfsHostNodes.map(peerConnect);
                        }
                        setStoreManifest(res.data);
                    })
                    .catch(error => {
                        //debugger;
                    });
            }).catch(error => {
                //debugger;
            });
        ;

    }, []);

    useEffect(() => {
        // If the packageLink is a valid IPFS hash preload it's info
        if (isIpfsHash(query) || isDnpDomain(query))
            fetchPackageDataFromQuery(query);
    }, [query]);

    function openDnp(id) {
        // debugger;
        const dnp = directory.find(({ name }) => name === id);
        // debugger;
        if ((dnp || {}).tag === "UPDATED") {

            history.push(packagesRootPath + "/" + dnp.name);
        } else {
            fetchPackageData(id);
            history.push(rootPath + "/" + encodeURIComponent(id));
        }
    }

    function onTypeChange(type) {
        setSelectedTypes(ts => ({ ...ts, [type]: !ts[type] }));
    }

    const directoryFiltered = filterDirectory({
        directory,
        query,
        selectedTypes
    });

    /**
     * 1. If the query is a valid IPFS hash, open it
     * 2. If the query matches exactly one DNP, open it
     * 0. Else open the query
     */
    function runQuery() {
        if (isIpfsHash(query)) return openDnp(query);
        if (directoryFiltered.length === 1)
            return openDnp(directoryFiltered[0].name);
        else openDnp(query);
    }

    const types = {
        ...directory.reduce((obj, { manifest = {} }) => {
            if (manifest.type) obj[manifest.type] = false;
            return obj;
        }, {}),
        ...selectedTypes
    };

    /**
     * Isolate the switching logic:
     * 1. If there is a search and it's empty show "NoDnp"
     * 2. If it is still syncing, show "IsSyncing"
     * 3. If it is loading, show "Loading"
     * 0. Else show the DnpStore
     */
    function Body() {

        if (!displayManifest || !displayManifest.packages || !displayManifest.packages.length) return <Loading msg="Loading DNPs..." />;
        // if (displayManifest && displayManifest.length) {
        const categories = displayManifest.categories.sort((a, b) => { return a.weight - b.weight });

        const store = categories.map((cat, i) => {
            let subdir = displayManifest.packages.filter((p) => {
                return p.manifest.avadocategory === cat.tag
            });
            return (<div key={i}>
                <SubTitle>{cat.description}</SubTitle>
                <ManifestStore directory={subdir} openDnp={openDnp} />
            </div>);
        })

        return store;

        // return <ManifestStore directory={displayManifest} openDnp={openDnp} />;


        // }
        // return null;

    }

    return (
        <>
            <Input
                placeholder="DNP's name or IPFS hash"
                value={query}
                onValueChange={value => setQuery(correctPackageName(value))}
                onEnterPress={runQuery}
                append={<ButtonLight onClick={runQuery}>Search</ButtonLight>}
            />

            {/* <TypeFilter types={types} onTypeChange={onTypeChange} /> */}

            {/* <PackageStore directory={directoryFiltered} openDnp={openDnp} /> */}

            <h1>AVADO's DAPP DIRECTORY</h1>
            {/* <ul>
                <li><a href="http://localhost:3000/#/installer/%2Fipfs%2FQmebCzywYDtXvpeLFDBPW8LTGWk7RZqjnDBXRWpCbV5t22">ethchain</a></li>
            </ul> */}

            <Body />
        </>
    );
}

InstallerHome.propTypes = {
    // State -> props
    id: PropTypes.string,
    directory: PropTypes.array.isRequired,
    selectedTypes: PropTypes.object.isRequired,
    inputValue: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
    mainnet: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired,
    // Dispatch -> props
    fetchPackageData: PropTypes.func.isRequired,
    fetchPackageDataFromQuery: PropTypes.func.isRequired,
    packages: PropTypes.array.isRequired,
};

const mapStateToProps = createStructuredSelector({
    id: s.getQueryId,
    directory: s.getDnpDirectoryWithTagsNonCores,
    directoryLoaded: s.directoryLoaded,
    selectedTypes: s.getSelectedTypes,
    inputValue: s.getInputValue,
    mainnet: getMainnet,
    loading: getIsLoading.dnpDirectory,
    error: getLoadingError.dnpDirectory,
    packages: s.getInstalled
});

const mapDispatchToProps = {
    fetchPackageData: a.fetchPackageData,
    fetchPackageDataFromQuery: a.fetchPackageDataFromQuery
};

export default compose(
    withRouter,
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    withTitle("Dappstore")
)(InstallerHome);
