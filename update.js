/*****************************************//**
* fonction de mise à jour des données de la page
*/
function update(listNodes) {
    var numberBandwidth = 0;
    $("#numberNodes").html(listNodes.length);
    for (var i = 0; i < listNodes.length; i++) {
        numberBandwidth += (parseInt(listNodes[i].rx_bytes) + parseInt(listNodes[i].tx_bytes));
    }
    $("#numberBandwidth").html(numberBandwidth);
    updateTable(listNodes);
    /*updateList(7101);
    var list = updateListOld();
    var numberBandwidth = 0;
    $("#numberNodes").html(list.length);
    for (var i = 0; i < list.length; i++) {
        numberBandwidth += list[i].bandwidth_used;
    }
    $("#numberBandwidth").html(numberBandwidth);
    //updateTable(list);*/
}

/*****************************************//**
* fonction de mise à jour du tableau
*/
function updateTable(listNodes) {
    //updateTable
    $("#status td").each(function() {
        this.remove();
    });
    var table = $("#status");
    $.each(listNodes, function(i, node) {
        table.append("<tr><td>"+ node.description +"</td>" +
            "<td>"+ node.connType +"</td>" +
            "<td>"+ node.port +"</td><" +
            "td>"+ node.uptime +"</td>" +
            "<td>"+ (parseInt(node.rx_bytes) + parseInt(node.tx_bytes)) +"</td>" +
            "<td>" + helperNumberOfServices(node) + "</td>" +
            "<td>"+ node.version +"</td></tr>");
        // Using tooltip:
        //table.append("<tr><td>"+ node.description +"</td>
        // <td>"+ node.connType +"</td>
        // <td>"+ node.port +"</td>
        // <td>"+ node.uptime +"</td>
        // <td>"+ (parseInt(node.rx_bytes) + parseInt(node.tx_bytes)) +"</td>
        // <td id='tooltipUse' data-toggle='tooltip' data-placement='bottom' data-selector='true' data-trigger='click'>"+ helperNumberOfServices(node) +"</td>
        // <td>"+ node.version +"</td></tr>");
        //$("#tooltipUse").tooltip({title: String(node.available_services), viewport: '#viewport'});
        // Using dropdown:
        /*table.append("<tr><td>"+ node.description +"</td>" +
            "<td>"+ node.connType +"</td>" +
            "<td>"+ node.port +"</td><" +
            "td>"+ node.uptime +"</td>" +
            "<td>"+ (parseInt(node.rx_bytes) + parseInt(node.tx_bytes)) +"</td>" +
            "<td class='dropdown-toggle' data-toggle='dropdown' href='#' role='button' aria-haspopup='true' aria-expanded='false' style='overflow:visible'>"
            + helperNumberOfServices(node) +"<ul class='dropdown-menu' style='overflow:visible'>" +
            "<li><a href='#'>Action</a></li>" +
            "<li><a href='#'>Another action</a></li>" +
        "<li><a href='#'>Something else here</a></li>" +
            "<li><a href='#'>Separated link</a></li>" +
        "</ul>" +
            "</td>" +
            "<td>"+ node.version +"</td></tr>");*/
        // Using modal:
        /*table.append("<tr><td>"+ node.description +"</td>" +
            "<td>"+ node.connType +"</td>" +
            "<td>"+ node.port +"</td><" +
            "td>"+ node.uptime +"</td>" +
            "<td>"+ (parseInt(node.rx_bytes) + parseInt(node.tx_bytes)) +"</td>" +
            "<td data-toggle='modal' data-target='.bs-example-modal-sm'>" +
            "<div class='modal fade bs-example-modal-sm' tabindex='-1' role='dialog' aria-labelledby='mySmallModalLabel'>" +
            "<div class='modal-dialog modal-sm' role='document'>" +
            "<div class='modal-content'>"+ String(node.available_services) +"</div>"+
            "</div></div>"+
            + helperNumberOfServices(node) +

            "</td>" +
            "<td>"+ node.version +"</td></tr>");*/

        /*<button type="button" class="btn btn-primary" data-toggle="modal" data-target=".bs-example-modal-sm">Small modal</button>

        <div class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel">
            <div class="modal-dialog modal-sm" role="document">*/

    });

}

function helperNumberOfServices(node) {
    var numberOfServices = String(node.available_services).split(',').length;
    return numberOfServices;
}
