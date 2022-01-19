import React from "react";
import PropTypes from "prop-types";
import "./Wizard.css";
// import DataList from "./DataList";
// import Soft from "./Soft";
// // Utils
// import newTabProps from "utils/newTabProps";

function Wizard({ dnp }) {

    const { manifest = {} } = dnp;

    if (!manifest || !manifest.links || !manifest.links.OnboardingWizard) {
        return null;
    }

    return (
        <iframe
            className="onboardinwizard"
            frameBorder="0"
            title="Onboarding Wizard"
            src={manifest.links.OnboardingWizard}
        />
    );
}

Wizard.propTypes = {
    dnp: PropTypes.object.isRequired
};

export default Wizard;
