import React, { useState } from "react";
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

    const [buttonState, setButtonState] = useState({});

    // we wrap these changes in a local state - so the button presses are instantanious
    const setAutoUpdateWrapper = (name,autoupdate)=>{
        const state = Object.assign({},buttonState);
        state[name] = autoupdate;
        setButtonState(state);
        setAutoUpdate(name,autoupdate);
    }

    // if a local cached state exists - use that.
    // when a package reload is done - this will be overwritten
    const getAutoUpdateState = (dnp) => {
        return buttonState[dnp.name] === undefined ? dnp.autoupdate : buttonState[dnp.name]
    }

    if (loading) return <Loading msg="Loading installed DNPs..." />;
    if (error) return <Error msg={`Error loading installed DNPs: ${error}`} />;

    //   const filteredDnps = dnps; //.filter(dnp => xnor(coreDnps, dnp.isCore));
    const filteredDnps = dnps.filter(dnp => xnor(coreDnps, dnp.isCore));

    if (!filteredDnps.length) return <NoPackagesYet />;

    return (
        <Card className="list-grid dnps no-a-style">
            <header className="center">Status</header>
            <header>Name</header>
            <header>Open</header>
            <header>Manage</header>
            <header>Restart</header>
            <header>Auto-update</header>
            {filteredDnps.map(({ id, name, state,manifest }) => (
                <React.Fragment key={name}>
                    <StateBadge state={state} />
                    <NavLink className="name" to={`/${moduleName}/${name}`}>
                        {name}
                    </NavLink>
                    <NavLink className="open" to={`/${moduleName}/${name}`}>
                        <MdOpenInNew />
                    </NavLink>
                    <NavLink className="open" to={`/${moduleName}/${name}/detail`}>
                        <MdTune />
                    </NavLink>
                    <MdRefresh
                        onClick={() => confirmRestartPackage(name, restartPackage)}
                    />
                    <Switch
                        checked={getAutoUpdateState(manifest)}
                        onToggle={() => {setAutoUpdateWrapper(name,!manifest.autoupdate)}}
                    />
                    <hr />
                </React.Fragment>
            ))}
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
