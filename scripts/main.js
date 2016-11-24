
/**
 * MAIN
 */
$(document).ready(function () {
    updateList();
    // appelle la fonction udpate() toutes les 3 secondes:
    setInterval(function () {
        updateList();
    }, 3000);

    // $("#hello").on("click", function(event) {
    //   alert(list[0].name);
    // });
    var hello = $("#hello");
    hello.on("click", function () {
        console.log("Hello World!");
    });

    // If the button is clicked call the sign part:
     $("#sign_button").click(function() {
        runGenerator(function* bonjour() {
            var message = yield websocket_sign(7101);
            nacl_factory.instantiate(function (nacl) {
                var sig = new Uint8Array(message.Signature.toArrayBuffer());
                var agg = new Uint8Array(message.Aggregate.toArrayBuffer());
                var hash = nacl.crypto_hash_sha256(bytesToHex("1234")); // Uint8Array
                var success = nacl.crypto_sign_verify_detached(sig, hash, agg);
                console.log(success);
            });
        });
     });
});
