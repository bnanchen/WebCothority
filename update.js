function update() {
  var list = updateList();
  var numberBandwidth = 0;
  $("#numberNodes").html(list.length);
  for (var i = 0; i < list.length; i++) {
    numberBandwidth += list[i].bandwidth_used;
  }
  $("#numberBandwidth").html(numberBandwidth);
  updateTable(list);
}

function updateTable(list) {
  // enlève les lignes du tableau précédents
  $("#status td").each(function() {
    this.remove();
  });
  // ajoute les nouvelles lignes au tableau
  var table = $("#status");
  $.each(list, function(i, val) {
    table.append("<tr><td>"+ val.name +"</td><td>"+ val.ip +"</td><td>"+ val.bandwidth_used +"</td></tr>");
  });
}
