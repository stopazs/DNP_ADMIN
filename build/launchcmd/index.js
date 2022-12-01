const connection = require("./connection");
const calls = require("./calls");

const waitForPackageVersion = async (v, onFound) => {
    console.log(`Waiting for dappmamanger version ${v}`);
    try {
        const _packages = await calls.getPackages();
        if (_packages) {
            console.log(`packages found! Looking for dappmanager`);
            const dappmanager = _packages.find((p) => { return p.name === "dappmanager.dnp.dappnode.eth" });
            if (dappmanager) {
                console.log(`Dappmanager found!`);
                if (dappmanager.manifest.version === v) {
                    console.log(`correct version found`);
                    onFound();
                } else {
                    console.log(`wrong version found ${dappmanager.manifest.version}`);
                    setTimeout(() => {
                        waitForPackageVersion(v);
                    }, 5000);
                }
            } else {
                console.log(`no dappmanager found`);
                setTimeout(() => {
                    waitForPackageVersion(v);
                }, 5000);
            }
        } else {
            console.log(`no packages found`);
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

connection.open(async (session) => {
    calls.setSession(session);
    const _packages = await calls.getPackages();
    // look for dappmanager version
    const dappmanager = _packages.find((p) => { return p.name === "dappmanager.dnp.dappnode.eth" });
    if (dappmanager) {
        console.log(`according to docker, dappmamanger version = ${dappmanager.version}`);
        console.log(`according to manifest, dappmamanger version = ${dappmanager.manifest.version}`);
        // check if combo needs to be replaced
        if (true ||
            ["10.0.33"].includes(dappmanager.version)
            &&
            ["10.0.40"].includes(dappmanager.manifest.version)
        ) {
            console.log(`faulty version.. patching`);
            // 10.0.41 patched : QmT6YXQ8Pdk2YqTyd7am8CdeG7wdrbNys5VJLRnAxnnpRp

            // start the installation - but do not await it, since dappmanager will be restarted
            // this will never return... instead wait for the correct packages to appear.
            calls.installPackage("dappmanager.dnp.dappnode.eth@QmT6YXQ8Pdk2YqTyd7am8CdeG7wdrbNys5VJLRnAxnnpRp");

            waitForPackageVersion("10.0.43", () => {
                console.log("found!!!")
            })

        } else {
            console.log(`unknown version - bailing out`);
        }
    }
    // connection.close(() => {
    //     console.log(`connection closed`);
    // })
})