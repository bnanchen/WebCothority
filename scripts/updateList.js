//========================================================OLD VERSION===================================================
// constructeur pour les noeuds:
function nodeOld(name, ip, portNumber, uptime, bandwidth_used, number_services) {
    this.name = name;
    this.ip = ip;
    this.portNumber = portNumber;
    this.uptime = uptime;
    this.bandwidth_used = bandwidth_used;
    this.number_services = number_services;
}

// listes des noeuds:
var node_1 = new nodeOld("Paul", "69.89.31.226", 14, 234, 34, 2);
var node_2 = new nodeOld("Sarah", "69.89.31.226", 2, 235, 23, 3);
var node_3 = new nodeOld("Xavier", "69.89.31.226", 4, 534, 12, 4);
var node_4 = new nodeOld("Bubba", "69.89.31.226", 45, 234, 5, 5);
var node_5 = new nodeOld("Stanley", "69.89.31.226", 23, 345, 32, 6);
var node_6 = new nodeOld("Billy", "69.89.31.226", 22, 235, 23, 7);

// 3 arrays de noeuds:
var set_1 = [node_1, node_3, node_4, node_5];
var set_2 = [node_2, node_4, node_6];
var set_3 = [node_3, node_4, node_5, node_6];

/**
 * fonction de mise à jour de la liste des noeuds actifs
 */
function updateListOld() {
    var chosenSetNumber = Math.floor(Math.random() * 3);
    var chosenSet;
    switch (chosenSetNumber) {
        case 0: chosenSet = set_1;
            break;
        case 1: chosenSet = set_2;
            break;
        case 2: chosenSet = set_3;
            break;
        default: alert("Problème dans la fonction updateList: nombre non-compris entre 0 et 2");
    }
    return chosenSet;
}

//======================================================================================================================

function node(available_services, connType, description, host, port, rx_bytes, system, tx_bytes, uptime, version) {
    this.available_services = available_services;
    this.connType = connType;
    this.description = description;
    this.host = host;
    this.port = port;
    this.rx_bytes = rx_bytes; // reception
    this.system = system;
    this.tx_bytes = tx_bytes; // envoi
    this.uptime = uptime;
    this.version = version;
}

/**
 * Generator
 */
function updateList() { // mettre en async si dispo: chrome 55
    //var a = websocket(7101);
    //console.log(a);
    runGenerator(function* bonjour() {
        var listNodes = [];
        var message = yield websocket(7003);
        listNodes.push(nodeCreation(message));
        message = yield websocket(7005);
        listNodes.push(nodeCreation(message));
        message = yield  websocket(7007);
        listNodes.push(nodeCreation(message));
        update(listNodes);
    });
}

function nodeCreation(message) {
    // must put the constructor inside runGenerator(g) because overshadowing
    function node(available_services, connType, description, host, port, rx_bytes, system, tx_bytes, uptime, version) {
        this.available_services = available_services;
        this.connType = connType;
        this.description = description;
        this.host = host;
        this.port = port;
        this.rx_bytes = rx_bytes; // reception
        this.system = system;
        this.tx_bytes = tx_bytes; // envoi
        this.uptime = uptime;
        this.version = version;
    }

    var node = new node(
        message.system.map.Status.value.field.map.Available_Services.value,
        message.system.map.Status.value.field.map.ConnType.value,
        message.system.map.Status.value.field.map.Description.value,
        message.system.map.Status.value.field.map.Host.value,
        message.system.map.Status.value.field.map.Port.value,
        message.system.map.Status.value.field.map.RX_bytes.value,
        message.system.map.Status.value.field.map.System.value,
        message.system.map.Status.value.field.map.TX_bytes.value,
        message.system.map.Status.value.field.map.Uptime.value,
        message.system.map.Status.value.field.map.Version.value
    );
    //console.log(message.Status.map.Status.value.module.map.Available_Services.value);
    //console.log(node);
    return node;
}