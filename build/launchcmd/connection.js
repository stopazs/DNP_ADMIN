const config = {
    autobahnURL: "ws://wamp.my.ava.do:8080/ws",
    autobahnRealm: "dappnode_admin",
}

const autobahn = require("autobahn");
const connection = new autobahn.Connection({ url: config.autobahnURL, realm: config.autobahnRealm });

const open = (onOpen) => {
    connection.onopen = session => {
        console.log("CONNECTED to \nconfig.autobahnURL: " + config.autobahnURL + " \nconfig.autobahnRealm: " + config.autobahnRealm);
        onOpen(session);
    };

    connection.open();
}

const close = (onClose) => {
    // connection closed, lost or unable to connect
    connection.onclose = (reason, details) => {
        console.error("CONNECTION_CLOSE", { reason, details });
        onClose();
    };
    connection.close();

}

module.exports = { open, close };

