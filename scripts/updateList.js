/**
 * update the Status List
 */
function updateList() {
    runGenerator(function* generator() {
        const listAddresses = ["localhost:7003", "localhost:7005", "localhost:7007",
            "localhost:7009", "localhost:7011", "localhost:7013"];

        window.listNodes = [];
        for (let address of listAddresses) {
            let message = yield websocket_status(address);
            window.listNodes.push(nodeCreation(message));
        }

        update(window.listNodes);
    });
}

/**
 * Create a node from the information received from the Cothority
 *
 * @param message status information received from the Cothority
 * @returns {node}
 */
function nodeCreation(message) {
    // must put the constructor inside runGenerator(g) because of overshadowing
    function node(available_services, connType, description, host, port, rx_bytes,
                  system, tx_bytes, uptime, version, server) {
        this.available_services = available_services;
        this.connType = connType;
        this.description = description;
        this.host = host;
        this.port = port;
        this.rx_bytes = rx_bytes; // received
        this.system = system;
        this.tx_bytes = tx_bytes; // sent
        this.uptime = uptime;
        this.version = version;
        this.server = server;
    }

    const currentNode = new node(
        message.system.map.Status.value.field.map.Available_Services.value,
        message.system.map.Status.value.field.map.ConnType.value,
        message.system.map.Status.value.field.map.Description.value,
        message.system.map.Status.value.field.map.Host.value,
        message.system.map.Status.value.field.map.Port.value,
        message.system.map.Status.value.field.map.RX_bytes.value,
        message.system.map.Status.value.field.map.System.value,
        message.system.map.Status.value.field.map.TX_bytes.value,
        message.system.map.Status.value.field.map.Uptime.value,
        message.system.map.Status.value.field.map.Version.value,
        message.server
    );

    return currentNode;
}