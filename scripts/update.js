/**
 * Update the Status part of the website
 */
function update(listNodes) {
    let numberBandwidth = 0;

    $("#numberNodes").html(listNodes.length);

    for (let i = 0; i < listNodes.length; i++) {
        numberBandwidth += (parseInt(listNodes[i].rx_bytes) + parseInt(listNodes[i].tx_bytes));
    }

    $("#numberBandwidth").html(numberBandwidth);

    updateTable(listNodes);
}

/**
 * Update the Status Table
 */
function updateTable(listNodes) {
    // "clean" the table
    $("#status td").each(function() {
        this.remove();
    });

    const table = $("#status");

    $.each(listNodes, function(i, node) {
        table.append("<tr><td>"+ node.description +"</td>" +
            "<td>"+ node.connType +"</td>" +
            "<td>"+ node.port +"</td><" +
            "td>"+ displayPrettyDate(node.uptime) +"</td>" +
            "<td>"+ (parseInt(node.rx_bytes) + parseInt(node.tx_bytes)) +"</td>" +
            "<td>" + helperNumberOfServices(node) + "</td>" +
            "<td>"+ node.version +"</td></tr>");
    });

}

/**
 * helper function
 *
 * @param node        node object
 * @returns {Number}  number of available services of the node
 */
function helperNumberOfServices(node) {
    return String(node.available_services).split(',').length;
}
