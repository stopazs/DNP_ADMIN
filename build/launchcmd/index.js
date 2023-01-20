const calls = require("./calls");
const axios = require('axios').default;

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

const peerConnect = (peer) => {
    console.log(`connecting to ${peer}`);
    const apiLink = `http://ipfs.my.ava.do:5001/api/v0/swarm/connect?arg=${peer}`;
    axios
        .post(
            apiLink
        )
        .then(res => {
            if (res && res.status === 200) {
                console.log(`Connected to ${apiLink}`);
            }
        })
        .catch(error => {
            console.log(`Failed to connect to ${apiLink}`, error.message);
        });
};

const run = async () => {
    const _nodeID = await calls.getNodeId();
    console.log(_nodeID);
    console.log(`DAPPMANAGER_VERSION`,process.env.DAPPMANAGER_VERSION);
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
            ["10.0.33","10.0.40"].includes(dappmanager.manifest.version) ||
            ["10.0.33","10.0.40"].includes(process.env.DAPPMANAGER_VERSION)
        ) {
            console.log(`faulty version.. installing new version`);

            // Make sure the Avado IPFS nodes are connected
            peerConnect("/ip4/38.242.212.220/tcp/4001/p2p/12D3KooWLjrbkVPEtL2FwQEb1nCns7CiMez6gufggUjKZGoHH5sk")
            peerConnect("/ip4/80.208.229.228/tcp/4001/ipfs/QmdCwmHn59PtBraBEsuJWymSgbjC9VGLuZXxendPHSMZFr")

            // target 10.0.45: QmXFqzk96k2uqHSyFkEj8qwbF36XM8pEuJr1ZnFcJanS3s

            // start the installation - but do not await it, since dappmanager will be restarted
            // this will never return... instead wait for the correct packages to appear.
            await calls.installPackage("dappmanager.dnp.dappnode.eth@QmXFqzk96k2uqHSyFkEj8qwbF36XM8pEuJr1ZnFcJanS3s");

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

