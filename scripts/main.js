
/**
 * MAIN
 */
$(document).ready(function () {
    updateList();
    // next call each 3 seconds the updateList() function:
    setInterval(function () {
        updateList();
    }, 3000);

    /**
     * Signature part
     */
    $("#signature_fileInput").change(function() {
        var file = this;

        runGenerator(function* waitingfile() {
            var fileAsArrayBuffer = yield takeCareOf(file.files[0], true);
            var message = yield websocket_sign(7003, fileAsArrayBuffer);

            sign(fileAsArrayBuffer, getFilename(file.value), message);
        });

    });

    /**
     * Verification part
     */
    $("#verify_file_fileInput").change(function() {
        var file = this;

        runGenerator(function* waitingfile() {
            var fileAsArrayBuffer = yield takeCareOf(file.files[0], true);

            $("#button_verify_signature").unbind('click').click(function() {
                // Verify that the number of files is 2:
                if (file.files.length != 2) {
                    // warning alert appears:
                    $("#verification_alert").append("<div class='alert alert-warning alert-dismissible fade in'>"
                        +"<a href='#' class='close' data-dismiss='alert' aria-label='close'>"+ "&times;"
                        +"</a> <strong>"+ "Warning! " +"</strong>"+ "You must upload two files."
                        +"</div>");
                }
            });

            $("#verify_signature_fileInput").change(function() {
                var file = this;

                runGenerator(function* waitingfile() {
                    var signatureAsString = yield takeCareOf(file.files[0], false);
                    var nameFile = getFileExtension(file.files[0].name);

                    // Verify that one of the two files has .json extension:
                    if (nameFile != "json") {
                        // warning alert appears:
                        $("#verification_alert").append("<div class='alert alert-warning alert-dismissible fade in'>"
                            +"<a href='#' class='close' data-dismiss='alert' aria-label='close'>"+ "&times;"
                            +"</a><strong>"+ "Warning! " +"</strong>"+ "The signature file uploaded needs to be a .json."
                            +"</div>");
                        return;
                    }

                    verifySignature(fileAsArrayBuffer,signatureAsString);
                });
            });
        });
    });

    $("#verify_signature_fileInput").change(function() {
        var file = this;

        runGenerator(function* waitingfile() {
            var signatureAsString = yield takeCareOf(file.files[0], false);
            var nameFile = getFileExtension(file.files[0].name);

            $("#button_verify_signature").unbind('click').click(function() {
                // Verify that the number of files is 2:
                if (file.files.length != 2) {
                    // warning alert appears:
                    $("#verification_alert").append("<div class='alert alert-warning alert-dismissible fade in'>"
                        +"<a href='#' class='close' data-dismiss='alert' aria-label='close'>"+ "&times;"
                        +"</a> <strong>"+ "Warning! " +"</strong>"+ "You must upload two files."
                        +"</div>");
                }
            });

            $("#verify_file_fileInput").change(function() {
                var file = this;

                runGenerator(function* waitingfile() {
                    var fileAsArrayBuffer = yield takeCareOf(file.files[0], true);

                    // Verify that one of the two files has .json extension:
                    if (nameFile != "json") {
                        // warning alert appears:
                        $("#verification_alert").append("<div class='alert alert-warning alert-dismissible fade in'>"
                            +"<a href='#' class='close' data-dismiss='alert' aria-label='close'>"+ "&times;"
                            +"</a><strong>"+ "Warning! " +"</strong>"+ "The signature file uploaded needs to be a .json."
                            +"</div>");
                        return;
                    }

                    verifySignature(fileAsArrayBuffer, signatureAsString);
                });
            });
        });
    });


    /*
     $("#verify_fileInput").change(function() {
     var file = this;

     runGenerator(function* waitingfile() {
     var jsonFile = 0;
     var nameFile1 = getFileExtension(file.files[0].name);
     var nameFile2 = getFileExtension(file.files[1].name);

     // Verify that the number of files is 2:
     if (file.files.length != 2) {
     // warning alert appears:
     $("#verification_alert").append("<div class='alert alert-warning alert-dismissible fade in'>"
     +"<a href='#' class='close' data-dismiss='alert' aria-label='close'>"+ "&times;"
     +"</a> <strong>"+ "Warning! " +"</strong>"+ "You must upload only two files."
     +"</div>");
     return;
     }

     // Verify that one of the two files has .json extension:
     if (nameFile1 != "json" && nameFile2 != "json") {
     // warning alert appears:
     $("#verification_alert").append("<div class='alert alert-warning alert-dismissible fade in'>"
     +"<a href='#' class='close' data-dismiss='alert' aria-label='close'>"+ "&times;"
     +"</a><strong>"+ "Warning! " +"</strong>"+ "The signature file uploaded needs to be a .json."
     +"</div>");
     return;
     }

     // determine the jsonFile
     if (nameFile2 == "json") {
     jsonFile = 1;
     }

     var fileAsArrayBuffer = yield takeCareOf(file.files[(jsonFile+1) % 2], true);
     var signatureAsString = yield takeCareOf(file.files[jsonFile], false);

     $("#button_verify_signature").unbind('click').click(function () {
     verifySignature(fileAsArrayBuffer, signatureAsString);
     });
     });
     }); */
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
