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
        runGenerator(function* waitingFile() {
            const fileAsArrayBuffer = yield takeCareOf(file.files[0], true);
            const message = yield websocketSign("localhost:7003", fileAsArrayBuffer);

            saveToFile(fileAsArrayBuffer, getFilename(file.value), message);
        });

    });

    /**
     * Verification part
     */
    $("#verify_file_fileInput").change(function() {
        const file = this;

        runGenerator(function* waitingFile() {
            const fileAsArrayBuffer = yield takeCareOf(file.files[0], true);

            $("#verify_signature_fileInput").change(function() {
                const file = this;

                runGenerator(function* waitingFile() {
                    const signatureAsString = yield takeCareOf(file.files[0], false);
                    const filename = getFileExtension(file.files[0].name);

                    // Verify that the second file has .json extension, if not display a warning
                    if (warningNotJSON(filename) === true) {
                        // abort the function
                        return;
                    }

                    verifySignature(fileAsArrayBuffer,signatureAsString);
                });
            });
        });
    });

    $("#verify_signature_fileInput").change(function() {
        const file = this;

        runGenerator(function* waitingFile() {
            const signatureAsString = yield takeCareOf(file.files[0], false);
            const filename = getFileExtension(file.files[0].name);

            $("#verify_file_fileInput").change(function() {
                const file = this;

                runGenerator(function* waitingFile() {
                    const fileAsArrayBuffer = yield takeCareOf(file.files[0], true);

                    // Verify that the second file has .json extension, if not display a warning
                    if (warningNotJSON(filename) === true) {
                        // abort the function
                        return;
                    }

                    verifySignature(fileAsArrayBuffer, signatureAsString);
                });
            });
        });
    });
});

/**
 * Check that the submitted file is a .json, if not display a warning
 *
 * @param filename     filename of the submitted file
 * @returns {boolean}  true if the warning was displayed, otherwise false
 */
function warningNotJSON(filename) {
    let abort = false;

    if (filename != "json") {
        abort = true;

        if ($("#verification_alert_window").length === 0) {
            // warning alert appears:
            $("#verification_alert").append("<div class='alert alert-warning alert-dismissible fade in'" +
                "id='verification_alert_window'>"
                +"<a href='#' class='close' data-dismiss='alert' aria-label='close'>"+ "&times;"
                +"</a><strong>"+ "Warning! " +"</strong>"+ "The signature file uploaded needs to be a .json."
                +"</div>");
        }
    } else if ($("#verification_alert").length !== 0) {
        $("#verification_alert").empty();
    }
    return abort;
}
