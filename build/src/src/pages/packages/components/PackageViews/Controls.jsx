import React from "react";
import { connect } from "react-redux";
import * as action from "../../actions";
// Components
import CardList from "components/CardList";
import SubTitle from "components/SubTitle";
import Button from "components/Button";
// Confirm UI
import confirmRemovePackage from "../confirmRemovePackage";
import confirmRestartPackage from "../confirmRestartPackage";
import { confirm } from "components/ConfirmDialog";
import { shortNameCapitalized } from "utils/format";
import { toLowercase } from "utils/strings";

function PackageControls({
  dnp,
  togglePackage,
  restartPackage,
  restartPackageVolumes,
  removePackage
}) {
  function confirmRemovePackageVolumes(id) {
    confirm({
      title: `Reset ${shortNameCapitalized(id)}`,
      text: `This will reload this package to its factory settings \n (only this package - all other installed AVADO packages will remain installed and keep their data). This action cannot be undone.`,
      label: "Reset package",
      onClick: () => restartPackageVolumes(id)
    });
  }

  const state = toLowercase(dnp.state); // toLowercase always returns a string

  const actions = [
    {
      name:
        state === "running" ? "Pause" : state === "exited" ? "Start" : "Toggle",
      text: "Toggle the state of the package from running to paused",
      action: () => togglePackage(dnp.name),
      availableForCore: false,
      type: "secondary"
    },
    {
      name: "Restart",
      text:
        "Restarting a package will interrupt the service during 1-10s but preserve its data",
      action: () => confirmRestartPackage(dnp.name, restartPackage),
      availableForCore: true,
      type: "secondary"
    },
    {
      name: "Reset",
      text: `Resets this package to its factory settings (all package data will be lost).`,
      action: () => confirmRemovePackageVolumes(dnp.name),
      availableForCore: true,
      type: "danger"
    },
    {
      name: "Remove ",
      text: "Deletes a package permanently.",
      action: () => confirmRemovePackage(dnp.name, removePackage),
      availableForCore: false,
      type: "danger"
    }
  ];

  // Table style -> Removes the space below the table, only for tables in cards
  return (
    <>
      <SubTitle>Controls</SubTitle>
      <CardList>
        {actions
        //   .filter(action => action.availableForCore || !dnp.isCore)
          .map(({ name, text, type, action }) => (
            <div key={name} className="control-item">
              <div>
                <strong>{name}</strong>
                <div>{text}</div>
              </div>
              <Button
                variant={`outline-${type}`}
                onClick={action}
                style={{ whiteSpace: "normal" }}
              >
                {name}
              </Button>
            </div>
          ))}
      </CardList>
    </>
  );
}

const mapStateToProps = null;

const mapDispatchToProps = {
  togglePackage: action.togglePackage,
  restartPackage: action.restartPackage,
  restartPackageVolumes: action.restartPackageVolumes,
  removePackage: action.removePackage
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PackageControls);
