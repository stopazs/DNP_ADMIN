import React from "react";
import { Route } from "react-router-dom";
import { rootPath } from "../data";
// Components
import PackagesHome from "./PackagesHome";
import PackageInterface from "./PackageInterface";
import PackageWizard from "./PackageWizard";
// Logic

const PackagesRoot = () => (
  <>
    <Route exact path={rootPath} component={PackagesHome} />
    <Route exact path={rootPath + "/:id"} component={PackageWizard} />
    <Route exact path={rootPath + "/:id/detail"} component={PackageInterface} />
  </>
);

// Use `compose` from "redux" if you need multiple HOC
export default PackagesRoot;
