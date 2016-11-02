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

/**
 * Generator
 */
function updateList() { // mettre en async si dispo: chrome 55
    //var a = websocket(7101);
    //console.log(a);
    runGenerator(function* bonjour() {
        var listNodes = [];
        var message = yield websocket(7101);
        listNodes.push(nodeCreation(message));
        message = yield websocket(7102);
        listNodes.push(nodeCreation(message));
        message = yield  websocket(7103);
        listNodes.push(nodeCreation(message));
        update(listNodes);
       /* $("#status td").each(function() {
            this.remove();
        });
        var table = $("#status");
        table.append("<tr><td>"+ node.available_services +"</td><td>"+ node.connType +"</td><td>"+ node.port +"</td><td>"+ node.rx_bytes +"</td><td>"+ node.tx_bytes +"</td><td>"+ node.version +"</td></tr>");*/
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
        message.Status.map.Status.value.module.map.Available_Services.value,
        message.Status.map.Status.value.module.map.ConnType.value,
        message.Status.map.Status.value.module.map.Description.value,
        message.Status.map.Status.value.module.map.Host.value,
        message.Status.map.Status.value.module.map.Port.value,
        message.Status.map.Status.value.module.map.RX_bytes.value,
        message.Status.map.Status.value.module.map.System.value,
        message.Status.map.Status.value.module.map.TX_bytes.value,
        message.Status.map.Status.value.module.map.Uptime.value,
        message.Status.map.Status.value.module.map.Version.value
    );
    console.log(message.Status.map.Status.value.module.map.Available_Services.value);
    console.log(node);
    return node;
}

function helpUpdateList(message) {
    var node = new node( message.Status.map.Status.value.module.map.Available_Services,
        message.Status.map.Status.value.module.map.ConnType.value,
        message.Status.map.Status.value.module.map.Description.value,
        message.Status.map.Status.value.module.map.Host.value,
        message.Status.map.Status.value.module.map.Port.value,
        message.Status.map.Status.value.module.map.RX_bytes.value,
        message.Status.map.Status.value.module.map.System.value,
        message.Status.map.Status.value.module.map.TX_bytes.value,
        message.Status.map.Status.value.module.map.Uptime.value,
        message.Status.map.Status.value.module.map.Version.value);
        return node;
}
    //var p = new Promise(function (resolve, reject) {
      //  var setNodes = [];
        /*for(var i = 7001; i <= 7003; i++) {
            websocket(i).then(function (message) {
                var node = new node( message.Status.map.Status.value.module.map.Available_Services,
                    message.Status.map.Status.value.module.map.ConnType.value,
                    message.Status.map.Status.value.module.map.Description.value,
                    message.Status.map.Status.value.module.map.Host.value,
                    message.Status.map.Status.value.module.map.Port.value,
                    message.Status.map.Status.value.module.map.RX_bytes.value,
                    message.Status.map.Status.value.module.map.System.value,
                    message.Status.map.Status.value.module.map.TX_bytes.value,
                    message.Status.map.Status.value.module.map.Uptime.value,
                    message.Status.map.Status.value.module.map.Version.value);
                console.log(node);
                return node;
            }).then(function (node) {
                setNodes.push(node);
            });*/
        //}
    //});
    //console.log(setNodes); // not defined
    //return p;
//}
