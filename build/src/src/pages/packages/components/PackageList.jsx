import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { createStructuredSelector } from "reselect";
import * as s from "../selectors";
import * as a from "../actions";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
// Components
import NoPackagesYet from "./NoPackagesYet";
import StateBadge from "./PackageViews/StateBadge";
import Card from "components/Card";
import Loading from "components/generic/Loading";
import Error from "components/generic/Error";
import Switch from "components/Switch";
import axios from "axios";
// Selectors
import {
    getIsLoading,
    getLoadingError
} from "services/loadingStatus/selectors";
// Utils
import confirmRestartPackage from "./confirmRestartPackage";
// Icons
import { MdRefresh, MdOpenInNew, MdTune } from "react-icons/md";
// Styles
import "./packages.css";

const xnor = (a, b) => Boolean(a) === Boolean(b);

const PackagesList = ({
    dnps = [],
    moduleName,
    coreDnps,
    loading,
    error,
    restartPackage,
    setAutoUpdate,
}) => {

    const [storeManifest, setStoreManifest] = useState();
    const [buttonState, setButtonState] = useState({});

    useEffect(() => {
        axios
            .get(
                `https://bo.ava.do/value/store`
            )
            .then(res => {
                const storeRes = JSON.parse(res.data);
                const storeHash = storeRes.hash;
                axios
                    .get(
                        `http://ipfs.my.ava.do:8080/ipfs/${storeHash}`
                    )
                    .then(res => {
                        const storeManifest = res.data;
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


    // we wrap these changes in a local state - so the button presses are instantanious
    const setAutoUpdateWrapper = (name, autoupdate) => {
        const state = Object.assign({}, buttonState);
        state[name] = autoupdate;
        setButtonState(state);
        setAutoUpdate(name, autoupdate);
    }

    // if a local cached state exists - use that.
    // when a package reload is done - this will be overwritten
    const getAutoUpdateState = (dnp) => {
        // if (!dnp) return false;
        return buttonState[dnp.name] === undefined ? dnp.autoupdate : buttonState[dnp.name]
    }

    if (loading) return <Loading msg="Loading installed DNPs..." />;
    if (error) return <Error msg={`Error loading installed DNPs: ${error}`} />;

    //   const filteredDnps = dnps; //.filter(dnp => xnor(coreDnps, dnp.isCore));
    const filteredDnps = dnps.filter(dnp => xnor(coreDnps, dnp.isCore)).map((p) => {
        p.title = p.manifest && p.manifest.title ? p.manifest.title : p.name;
        if (!storeManifest) return p;
        const manifestPackage = storeManifest.packages.find((mp) => {
            return mp.manifest.name === p.name
        })
        if (manifestPackage) p.title = manifestPackage.manifest.title || p.name;
        return p;
    }).sort((a, b) => a.title.localeCompare(b.title));

    if (!filteredDnps.length) return <NoPackagesYet />;

    return (
        <Card className="list-grid dnps no-a-style">
            <header className="center">Status</header>
            <header>Name</header>
            {/* <header>Version</header> */}
            <header>Open</header>
            <header>Manage</header>
            <header>Restart</header>
            <header>Auto-update</header>
            {filteredDnps.map(({ version, id, name, title, state, manifest }) => {
                let navLinkTitle, navLinkIcon;
                // If the manifest file tells the UI to open its wizard in a seperate window, then display an a href
                // otherwise display a NavLink
                if (manifest && manifest.ui && manifest.ui.OnboardingWizard && manifest.ui.OnboardingWizard.external) {
                    navLinkTitle = (<a className="name" href={manifest.ui.OnboardingWizard.url} target="_blank">{title || name} ({version})</a>);
                    navLinkIcon = (<a className="open" href={manifest.ui.OnboardingWizard.url} target="_blank"><MdOpenInNew /></a>);
                } else {
                    navLinkTitle = (
                        <NavLink className="name" to={`/${moduleName}/${name}`}>
                            {title || name} ({version})
                        </NavLink>
                    );
                    navLinkIcon = (
                        <NavLink className="open" to={`/${moduleName}/${name}`}>
                            <MdOpenInNew />
                        </NavLink>
                    );
                }
                return (
                    <React.Fragment key={name}>
                        <StateBadge state={state} />
                        {navLinkTitle}
                        {navLinkIcon}
                        {/* <NavLink className="name" to={`/${moduleName}/${name}`}>
                            {title || name} ({version})
                        </NavLink>
                        <NavLink className="open" to={`/${moduleName}/${name}`}>
                            <MdOpenInNew />
                        </NavLink> */}
                        <NavLink className="open" to={`/${moduleName}/${name}/detail`}>
                            <MdTune />
                        </NavLink>
                        <MdRefresh
                            onClick={() => confirmRestartPackage(name, restartPackage)}
                        />
                        <Switch
                            checked={getAutoUpdateState(manifest)}
                            onToggle={() => { setAutoUpdateWrapper(name, !getAutoUpdateState(manifest)) }}
                        />
                        <hr />
                    </React.Fragment>
                )
            })}
        </Card>
    );
};

PackagesList.propTypes = {
    dnps: PropTypes.array.isRequired,
    moduleName: PropTypes.string.isRequired,
    coreDnps: PropTypes.bool,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired
};

// Container

const mapStateToProps = createStructuredSelector({
    dnps: s.getFilteredPackages,
    loading: getIsLoading.dnpInstalled,
    error: getLoadingError.dnpInstalled
});

const mapDispatchToProps = {
    restartPackage: a.restartPackage,
    setAutoUpdate: a.setAutoUpdate
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PackagesList);
