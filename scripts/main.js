
/**
 * MAIN
 */
$(document).ready(function () {
    updateList();
    // next call each 3 seconds the updateList() function:
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

    /**
     * if there is an upload of a file by the user: call takeCareOf(file)
     */
    $("#fileInput").change(function() {
        console.log(this.files[0]);
        var file = this;

        runGenerator(function* waitingfile() {
            var fileAsArrayBuffer = yield takeCareOf(file.files[0]);
            var message = yield websocket_sign(7101, fileAsArrayBuffer);

            $("#button_sign_file").click(function() {
                sign(fileAsArrayBuffer, getFilename(file.value), message);
            });

            $("#button_verify_signature").click(function() {
                verifySignature(fileAsArrayBuffer);
            });
        });

    });

    // If the button is clicked call the sign part:
     $("#sign_button").click(function() {
        runGenerator(function* bonjour() {
            var message = yield websocket_sign(7101, bytesToHex("1234"));
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
