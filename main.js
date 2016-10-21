
/*****************************************/
/**
 * MAIN
 */
$(document).ready(function () {
    // appelle la fonction udpate() toutes les 3 secondes:
    setInterval(function () {
        update()
    }, 3000);
    // $("#hello").on("click", function(event) {
    //   alert(list[0].name);
    // });
    var hello = $("#hello");
    hello.on("click", function () {
        console.log("Hello World!");
    });
});
