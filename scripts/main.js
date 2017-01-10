/**
 * MAIN
 */

$(document).ready(function () {
    /**
     * Status part
     */
    updateList();
    // next call each 3 seconds the updateList() function:
    setInterval(function () {
        updateList();
    }, 3000);

    /**
     * Signature part
     */
    $("#signature_fileInput").change(function() {
        const file = this;
        runGenerator(function* waitingfile() {
            const fileAsArrayBuffer = yield takeCareOf(file.files[0], true);
            const message = yield websocket_sign("localhost:7003", fileAsArrayBuffer);

            saveToFile(fileAsArrayBuffer, getFilename(file.value), message);
        });

    });

    /**
     * Verification part
     */
    $("#verify_file_fileInput").change(function() {
        const file = this;

        runGenerator(function* waitingfile() {
            const fileAsArrayBuffer = yield takeCareOf(file.files[0], true);

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
                const file = this;

                runGenerator(function* waitingfile() {
                    const signatureAsString = yield takeCareOf(file.files[0], false);
                    const nameFile = getFileExtension(file.files[0].name);

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
        const file = this;

        runGenerator(function* waitingfile() {
            const signatureAsString = yield takeCareOf(file.files[0], false);
            const nameFile = getFileExtension(file.files[0].name);

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
                const file = this;

                runGenerator(function* waitingfile() {
                    const fileAsArrayBuffer = yield takeCareOf(file.files[0], true);

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
});
