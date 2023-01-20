const config = {
    autobahnURL: "ws://wamp.my.ava.do:8080/ws",
    autobahnRealm: "dappnode_admin",
}

let openCount=0, closeCount=0;

const autobahn = require("autobahn");

const stats = (reason) =>{
//    console.log(`${reason} : openCount=${openCount} - closeCount=${closeCount}`);
}

const open = () => {
    const connection = new autobahn.Connection({ url: config.autobahnURL, realm: config.autobahnRealm });
    return new Promise((resolve, reject) => {
        connection.onopen = session => {
            // console.log(`WAMP: connected to ${config.autobahnURL}`);
            openCount++;
            stats("opening");
            resolve({ connection, session });
        };
        connection.open();
    });
}

const close = (connection) => {
    return new Promise((resolve, reject) => {
        connection.onclose = (reason, details) => {
            // console.log("WAMP: connection closed (CONNECTION_CLOSE)", { reason });
            closeCount++;
            stats("closing");
            return resolve();
        };
        connection.close();
    });
}

module.exports = { open, close };