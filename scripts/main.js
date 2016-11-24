
/**
 * MAIN
 */
$(document).ready(function () {
    // appelle la fonction udpate() toutes les 3 secondes:
   // setInterval(function () {
        updateList();
    //}, 3000);

    // $("#hello").on("click", function(event) {
    //   alert(list[0].name);
    // });
    var hello = $("#hello");
    hello.on("click", function () {
        console.log("Hello World!");
    });

    // If the button is clicked call the sign part:
    $("#sign_button").click(function() {
        websocket_sign(7101);
    });
});
