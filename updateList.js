// constructeur pour les noeuds:
function node(name, ip, portNumber, uptime, bandwidth_used, number_services) {
  this.name = name;
  this.ip = ip;
  this.portNumber = portNumber;
  this.uptime = uptime;
  this.bandwidth_used = bandwidth_used;
  this.number_services = number_services;
}

// listes des noeuds:
var node_1 = new node("Paul", "69.89.31.226", 14, 234, 34, 2);
var node_2 = new node("Sarah", "69.89.31.226", 2, 235, 23, 3);
var node_3 = new node("Xavier", "69.89.31.226", 4, 534, 12, 4);
var node_4 = new node("Bubba", "69.89.31.226", 45, 234, 5, 5);
var node_5 = new node("Stanley", "69.89.31.226", 23, 345, 32, 6);
var node_6 = new node("Billy", "69.89.31.226", 22, 235, 23, 7);

// 3 arrays de noeuds:
var set_1 = [node_1, node_3, node_4, node_5];
var set_2 = [node_2, node_4, node_6];
var set_3 = [node_3, node_4, node_5, node_6];

/*****************************************//**
* fonction de mise à jour de la liste des noeuds actifs
*/
function updateList() {
  var chosenSetNumber = Math.floor((Math.random() * 10) + 1) % 3;
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
