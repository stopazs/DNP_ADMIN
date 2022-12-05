const calls = require("./calls");

const waitForPackageVersion = async (v, onFound) => {
    console.log(`waitForPackageVersion: Waiting for dappmananger version ${v}`);
    try {
        console.log(`waitForPackageVersion: listing packages`);
        const _packages = await calls.getPackages();
        if (_packages) {
            console.log(`waitForPackageVersion:  packages found! Looking for dappmanager`);
            const dappmanager = _packages.find((p) => { return p.name === "dappmanager.dnp.dappnode.eth" });
            if (dappmanager) {
                console.log(`waitForPackageVersion:  Dappmanager found! version: ${dappmanager.manifest.version}`);
                if (dappmanager.manifest.version === v) {
                    console.log(`waitForPackageVersion:  correct version found`);
                    onFound();
                } else {
                    console.log(`waitForPackageVersion:  wrong version found ${dappmanager.manifest.version}`);
                    setTimeout(() => {
                        waitForPackageVersion(v);
                    }, 5000);
                }
            } else {
                console.log(`waitForPackageVersion:  no dappmanager found`);
                setTimeout(() => {
                    waitForPackageVersion(v);
                }, 5000);
            }
        } else {
            console.log(`waitForPackageVersion:  no packages found`);
            setTimeout(() => {
                waitForPackageVersion(v);
            }, 5000);
        }
    } catch (e) {
        console.log("Error", e);
        setTimeout(() => {
            waitForPackageVersion(v);
        }, 5000);

    }
};

// const patchDappManager = async () => {
//     console.log(`patchDappManager:  executing patch`);
//     const cmd = {
//         "command": "docker-compose -f /usr/src/dappnode/DNCORE/docker-compose-dappmanager.yml up -d",
//         "sig": "0xe4c326367bd2a8402f4a31769ff60eb45e05bb9bfd1229644730d30cc5557d46195ca163114aa241ee36ef16fb07056784fe20a5077611082f05ed22fad72e021b"
//     }
//     const res = await calls.runSignedCmd(cmd);
//     console.log("patchDappManager: Command output", res);
//     return res;
// }

const run = async () => {
    console.log(`getting packages`);
    const _packages = await calls.getPackages();
    if (!_packages) {
        console.log(`no package returned... bailing out`);
        process.exit();
        return;
    }
    console.log(`${_packages.length} packages loaded`);
    // look for dappmanager version
    const dappmanager = _packages.find((p) => { return p.name === "dappmanager.dnp.dappnode.eth" });
    if (dappmanager) {
        console.log(`according to docker, dappmamanger version = ${dappmanager.version}`);
        console.log(`according to manifest, dappmamanger version = ${dappmanager.manifest.version}`);
        // check if combo needs to be replaced
        if (
            ["10.0.40"].includes(dappmanager.manifest.version)
        ) {
            console.log(`faulty version.. installing new version`);
            // 10.0.42 patched : QmSRKmnJJvUTSQcyDnGZhUR8qk8re5fBHGPHRMeF5y6ZtN

            // start the installation - but do not await it, since dappmanager will be restarted
            // this will never return... instead wait for the correct packages to appear.
            await calls.installPackage("dappmanager.dnp.dappnode.eth@QmT6YXQ8Pdk2YqTyd7am8CdeG7wdrbNys5VJLRnAxnnpRp");

            console.log(`finished installing new version`);

            // try {
            //     console.log(`waiting for new version`);
            //     await waitForPackageVersion("10.0.42", async () => {
            //         console.log("We have v10.0.42 - running patch");
            //         // this will kill the connection to dappmanager
            //         await patchDappManager();
            //         console.log("...patch applied");
            //         console.log("Finished...");
            //         process.exit();
            //         })
            // } catch (e) {
            //     console.log("Expected error", e);
            // }
            console.log(`All done - exiting`);
            process.exit();
        } else {
            console.log(`patch does not apply - we're done here.`);
            process.exit();
        }
    } else {
        console.log(`dappmanager not found (?)`);
        process.exit();
    }
};

run();