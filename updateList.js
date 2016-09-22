// constructeur pour les noeuds:
function node(name, ip, bandwidth_used) {
  this.name = name;
  this.ip = ip;
  this.bandwidth_used = bandwidth_used;
}

// listes des noeuds:
var node_1 = new node("Paul", 23, 14);
var node_2 = new node("Sarah", 234, 2);
var node_3 = new node("Xavier", 22, 4);
var node_4 = new node("Bubba", 34, 45);
var node_5 = new node("Stanley", 55, 23);
var node_6 = new node("Billy", 45, 22);

// 3 arrays de noeuds:
var set_1 = [node_1, node_3, node_4, node_5];
var set_2 = [node_2, node_4, node_6];
var set_3 = [node_3, node_4, node_5, node_6];

// Update-function:
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
