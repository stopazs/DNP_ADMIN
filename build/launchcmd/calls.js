
let session;

const setSession = (s) => {
    session = s;
}

const getPackages = async () => {
    return session.call("listPackages.dappmanager.dnp.dappnode.eth")
        .then(res => {
            res = JSON.parse(res);
            if (!res || !res.result) {
                throw new Error(`cannot find any packages on your AVADO`);
            }
            // onPackages && onPackages(res.result);
            return (res.result);
        })
        .catch((e) => {
            console.log(`${e.messsage}`);
            return null;
        });
};

const installPackage = async (id) => {
    console.log(`Installing ${id}`);
    return await session.call("installPackage.dappmanager.dnp.dappnode.eth", [], {
        id: id,
        options: { BYPASS_CORE_RESTRICTION: true },
        userSetEnvs: {},
        userSetPorts: {},
        userSetVols: {}
    }).then(res => {
        console.log(res);
    }).catch((e) => {
        console.log("Error", e);
    });
}

module.exports = { setSession, getPackages, installPackage }
