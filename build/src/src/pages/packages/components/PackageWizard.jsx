import React from "react";
import { connect } from "react-redux";
import * as s from "../selectors";
import { createStructuredSelector } from "reselect";
import PropTypes from "prop-types";
// Components
import Wizard from "./PackageViews/Details/Wizard";
import "./PackageViews/Details/Wizard.css";
import Details from "./PackageViews/Details";
import Logs from "./PackageViews/Logs";
import Envs from "./PackageViews/Envs";
import FileManager from "./PackageViews/FileManager";
import Controls from "./PackageViews/Controls";
import NoDnpInstalled from "./NoDnpInstalled";
// Components
import Title from "components/Title";
import Loading from "components/generic/Loading";
import Error from "components/generic/Error";
// Selectors
import {
    getIsLoading,
    getLoadingError
} from "services/loadingStatus/selectors";

const filler = () => {
    let r = "";
    for (let c = 0; c < 1000; c++) {
        r += ` ${c}`;
    }
    return (<>{r}</>);
}

const PackageInterface = ({
    dnp,
    id,
    moduleName,
    areThereDnps,
    loading,
    error
}) => {

    return (
        <>
            {dnp ? (
                <>
                    {dnp.manifest && dnp.manifest.links && dnp.manifest.links.OnboardingWizard ? (
                        <>
                            <div className="fullheight">
                                <Wizard dnp={dnp} />
                            </div>
                        </>
                    ) :
                        (dnp.name === "remoteconnect.avado.dnp.dappnode.eth" ? (

                            <>
                                <div className="fullheight">
                                    <Wizard dnp={{ manifest: { links: { OnboardingWizard: "http://remoteconnect.my.ava.do" } } }} />
                                </div>
                            </>

                        ) :

                            (
                                <>
                                    <Title title="Package" subtitle={dnp.manifest && dnp.manifest.title ? dnp.manifest.title : id} />
                                    <Details dnp={dnp} />
                                    <Controls dnp={dnp} />
                                    <Envs dnp={dnp} />
                                    <FileManager dnp={dnp} />
                                    <Logs id={dnp.name} />
                                </>
                            )
                        )
                    }
                </>
            ) : loading ? (
                <Loading msg="Loading installed Package..." />
            ) : error ? (
                <Error msg={`Error loading installed Package: ${error}`} />
            ) : areThereDnps ? (
                <NoDnpInstalled id={id} moduleName={moduleName} />
            ) : null}
        </>
    )
};

PackageInterface.propTypes = {
    dnp: PropTypes.object,
    id: PropTypes.string,
    moduleName: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired
};

// Container

const mapStateToProps = createStructuredSelector({
    dnp: s.getDnp,
    // id and moduleName are parsed from the url at the selector (with the router state)
    id: s.getUrlId,
    moduleName: s.getModuleName,
    areThereDnps: s.areThereDnps,
    loadingDnps: getIsLoading.dnpInstalled,
    loading: getIsLoading.dnpInstalled,
    error: getLoadingError.dnpInstalled
});

const mapDispatchToProps = null;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PackageInterface);
