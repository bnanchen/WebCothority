
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
     * Signature part
     */
    $("#signature_fileInput").change(function() {
        console.log(this.files[0]);
        var file = this;
        console.log("1");
        runGenerator(function* waitingfile() {
            var fileAsArrayBuffer = yield takeCareOf(file.files[0], true);
            var message = yield websocket_sign(7101, fileAsArrayBuffer);

            $("#button_sign_file").unbind('click').click(function() {
                console.log("3");
                sign(fileAsArrayBuffer, getFilename(file.value), message);
            });
        });

    });

    /**
     * Verification part
     */
    $("#verify_fileInput").change(function() {
        var file = this;

        runGenerator(function* waitingfile() {
            // TODO ajouter vérification des fichiers
            var fileAsArrayBuffer = yield takeCareOf(file.files[0], true);
            var signatureAsString = yield takeCareOf(file.files[1], false);
            console.log(getFilename(file.value));
            var message = yield websocket_sign(7101, fileAsArrayBuffer);

            $("#button_verify_signature").unbind('click').click(function () {
                verifySignature(fileAsArrayBuffer, signatureAsString, message);
            });
        });
    });
/*
    // If the button is clicked call the sign part:
     $("#sign_button").click(function() {
        runGenerator(function* bonjour() {
            var message = yield websocket_sign(7101, "1234");
            nacl_factory.instantiate(function (nacl) {
                var sig = new Uint8Array(message.Signature.toArrayBuffer());
                var agg = new Uint8Array(message.Aggregate.toArrayBuffer());
                var hash = nacl.crypto_hash_sha256(bytesToHex("1234")); // Uint8Array
                var success = nacl.crypto_sign_verify_detached(sig, hash, agg);
                console.log(success);
            });
        });
     });*/
});
