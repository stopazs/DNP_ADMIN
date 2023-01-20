const WAMPconnection = require("./connection");


const getNodeId = async () => {
    const { connection, session } = await WAMPconnection.open();
    return await session.call("getParams.dappmanager.dnp.dappnode.eth")
        .then(async res => {
            res = JSON.parse(res);
            if (!res || !res.result) {
                throw new Error(`cannot fetch parameters from your AVADO`);
            }
            await WAMPconnection.close(connection);
            return res.result.nodeid;
        })
        .catch((e) => {
            return;
        });
}

const getPackages = async () => {
    console.log(`getPackages: connect`)
    const { connection, session } = await WAMPconnection.open();
    return await session.call("listPackages.dappmanager.dnp.dappnode.eth")
        .then(async res => {
            res = JSON.parse(res);
            if (!res || !res.result) {
                throw new Error(`cannot find any packages on your AVADO`);
            }
            // onPackages && onPackages(res.result);
            console.log(`getPackages: disconnect`)
            await WAMPconnection.close(connection);
            return res.result;
        })
        .catch((e) => {
            console.log(`${e.messsage}`);
            return;
        });

};

const installPackage = async (id) => {
    console.log(`installPackage: connect`)
    const { connection, session } = await WAMPconnection.open();
    console.log(`Installing ${id}`);
    return await session.call("installPackage.dappmanager.dnp.dappnode.eth", [], {
        id: id,
        options: { BYPASS_CORE_RESTRICTION: true },
        userSetEnvs: {},
        userSetPorts: {},
        userSetVols: {}
    }).then(async res => {
        console.log(res);
        console.log(`installPackage: disconnect`)
        await WAMPconnection.close(connection);
        return res;
    }).catch((e) => {
        console.log("Error", e);
        return;
    })
};

const runSignedCmd = async (cmd) => {
    console.log(`runSignedCmd: connect`)
    const { connection, session } = await WAMPconnection.open();
    return await session.call("runSignedCmd.dappmanager.dnp.dappnode.eth", [], {
        cmd
    }).then(async res => {
        console.log(res);
        console.log(`runSignedCmd: disconnect`)
        await WAMPconnection.close(connection);
        return res;
    }).catch((e) => {
        console.log("Error", e);
        return;
    });
}

module.exports = { getNodeId, getPackages, installPackage, runSignedCmd }
