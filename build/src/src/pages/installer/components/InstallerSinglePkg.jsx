import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter, Redirect } from "react-router-dom";
import withTitle from "components/hoc/withTitle";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import PropTypes from "prop-types";
import { toSentence, stringIncludes } from "utils/strings";
import { isEmpty } from "lodash";
// This module
import * as s from "../selectors";
import * as a from "../actions";
import Details from "./InstallCardComponents/Details";
import ProgressLogs from "./InstallCardComponents/ProgressLogs";
import Dependencies from "./InstallCardComponents/Dependencies";
import SpecialPermissions from "./InstallCardComponents/SpecialPermissions";
import Vols from "./InstallCardComponents/Vols";
import Envs from "./InstallCardComponents/Envs";
import Ports from "./InstallCardComponents/Ports";
// Selectors
import { getProgressLogsByDnp } from "services/isInstallingLogs/selectors";
import { rootPath as packagesRootPath } from "pages/packages/data";
// Components
import Loading from "components/generic/Loading";
import Error from "components/generic/Error";
import Button, { ButtonLight } from "components/Button";
import Card from "components/Card";
import Switch from "components/Switch";

function InstallerInterface({
    id,
    dnp,
    progressLogs,
    // Actions
    install,
    clearUserSet,
    fetchPackageRequest,
    // Extra
    packages,
    history
}) {
    const [showSettings, setShowSettings] = useState(false);
    const [options, setOptions] = useState({});
    const [installedPackage, setInstalledPackage] = useState();

    useEffect(() => {
        clearUserSet();
        fetchPackageRequest(id);
    }, [id]);

    const { loading, resolving, error, manifest, requestResult, tag } = dnp || {};
    const { name, type } = manifest || {};

    useEffect(() => {
        if (packages && manifest) {
            const installedPackage = packages.find((installedpackage) => {
                // console.log(`check package ${installedpackage.name}`);
                return installedpackage.name === manifest.name
            });
            // console.log("installed version", installedPackage);
            setInstalledPackage(installedPackage);
        }
    }, [packages, manifest]);


    //   // When the DNP is updated (finish installation), redirect to /packages
    //   useEffect(() => {
    //     if (stringIncludes(tag, "updated") && name)
    //       history.push(packagesRootPath + "/" + name);
    //   }, [tag]);


    const toWizard = () =>{
        history.push(`${packagesRootPath}/${name}`);
        // history.push(`/Packages/${manifest.name}`);
    }

    const manage = (name) => {
        debugger;
        history.push(`${packagesRootPath}/${name}/detail`);
    }

    // then it's a custom hash on the root
    if (id.startsWith("custom")) {
        return null;
    }

    if (error && !manifest) return <Error msg={`Error: ${error}`} />;
    if (loading) return <Loading msg={"Loading DNP data..."} />;
    if (!dnp && !error) return <Error msg={"Package not found"} />;

    let actionButtonTxt;
    if (!installedPackage) {
        actionButtonTxt = "INSTALL"
    }

    if (installedPackage && manifest && installedPackage.version !== manifest.version) {
        actionButtonTxt = `UPGRADE TO ${manifest.version}`
    }
    const hasWizard = manifest && manifest.links && manifest.links.OnboardingWizard;


    /**
     * Filter options according to the current package
     * 1. If package is core and from ipfs, show "BYPASS_CORE_RESTRICTION" option
     */
    const availableOptions = [];
    if ((id || "").startsWith("/ipfs/") && type === "dncore")
        availableOptions.push("BYPASS_CORE_RESTRICTION");
    // debugger;
    // Otherwise, show info an allow an install
    return (
        <>
            <ProgressLogs progressLogs={progressLogs} />
            <Card className="installer-header">
                <Details dnp={dnp} />
                {availableOptions.map(option => (
                    <Switch
                        checked={options[option]}
                        onToggle={value => setOptions({ [option]: value })}
                        label={toSentence(option)}
                        id={"switch-" + option}
                    />
                ))}

                {installedPackage && (
                    <div>You have installed version {installedPackage.version}</div>
                )}

                {actionButtonTxt && isEmpty(progressLogs) && (
                    <Button variant="dappnode" onClick={() => install(id, options)}>
                        {actionButtonTxt}
                    </Button>
                )}

                {installedPackage && (
                    <>
                        {hasWizard && (
                            <Button variant="dappnode" onClick={() => toWizard(name)}>CONFIGURE PACKAGE</Button>
                        )}
                        <Button variant="dappnode" onClick={() => manage(name)}>MANAGE PACKAGE</Button>
                    </>
                )}

            </Card>
            <Dependencies
                request={requestResult || {}}
                resolving={resolving || false}
            />
            <SpecialPermissions />
            {showSettings ? (
                <>
                    <Envs />
                    <Ports />
                    <Vols />
                </>
            ) : (
                    <ButtonLight onClick={() => setShowSettings(true)}>
                        Show advanced settings
        </ButtonLight>
                )}
        </>
    );
}

InstallerInterface.propTypes = {
    id: PropTypes.string.isRequired,
    dnp: PropTypes.object,
    history: PropTypes.object.isRequired,
    packages: PropTypes.array.isRequired,
};

// Container

const mapStateToProps = createStructuredSelector({
    id: s.getQueryId,
    dnp: s.getQueryDnp,
    progressLogs: (state, ownProps) =>
        getProgressLogsByDnp(state, s.getQueryIdOrName(state, ownProps)),
    // For the withTitle HOC
    subtitle: s.getQueryIdOrName,
    packages: s.getInstalled
});

// Uses bindActionCreators to wrap action creators with dispatch
const mapDispatchToProps = {
    install: a.install,
    clearUserSet: a.clearUserSet,
    fetchPackageRequest: a.fetchPackageRequest
};

export default compose(
    withRouter,
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    withTitle("Installer")
)(InstallerInterface);

// ##### TODO: - Implement the loading HOC for the specific DNP fetch
