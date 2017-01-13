/**
 * Verify the hash of the file and the signature and display the result to the user
 *
 * @param fileToVerify    file as an ArrayBuffer
 * @param stringJSON      JSON file as a String
 */
function verifySignature(fileToVerify, stringJSON) {
    const objectJSON = getJSONFileInObject(stringJSON);
    let hashVerification = false;
    let signatureVerification = false;
    let signature;
    let aggregate;

    // instantiate the nacl module:
    nacl_factory.instantiate(function (nacl) {
        try {
            signature = fromBase64toUint8Array(objectJSON.signature).slice(0, 64);
        } catch(err) {
            // error catched if the signature is not a correct length for a base64 version
            signature = new Uint8Array(0);
        }

        try {
            aggregate = fromBase64toUint8Array(objectJSON["aggregate-key"]);
        } catch(err) {
            // error catched if the aggregate-key is not a correct length for a base64 version
            aggregate = new Uint8Array(0);
        }

        const hash = nacl.crypto_hash_sha256(bytesToHex(fileToVerify)); // Uint8Array

        // Verification if the hash of the fileToVerify is the same as the hash of the file inside the JSON file:
        if (hash.length !== 0) {
            let hashJSON;
            try {
                hashJSON = fromBase64toUint8Array(objectJSON.hash);
            } catch(err) {
                // error catched if the hash is not a correct length for a base64 version
                hashJSON = new Uint8Array(0);
            }
            if (isEqualTo(hash, hashJSON)) {
                hashVerification = true;
            }
        }

        // Verification of the signature with the hash and the aggregate public key:
        if (signature.length !== 0 && hash.length !== 0 && aggregate.length !== 0) {
            const verification = nacl.crypto_sign_verify_detached(signature, hash, aggregate);
            if (verification) {
                signatureVerification = true;
            }
        }

        // If the progress bar already exists, remove it.
        if ($("#hash_progress_bar").length != 0) {
            $("#hash_progress_bar").remove();
        }

        if ($("#signature_progress_bar").length != 0) {
            $("#signature_progress_bar").remove();
        }

        // show the Verification Modal
        $("#verification_result_modal").modal('show');

        // Update of the progress bars
        if (hashVerification) {
            $("#verify_hash_progress").append("<div id='hash_progress_bar' class='progress-bar progress-bar-success' " +
                "role='progressbar' aria-valuenow='100' aria-valuemin='0' aria-valuemax='100' style='width: 100%'>"
                + "Valid!" +"</div>");
        } else {
            $("#verify_hash_progress").append("<div id='hash_progress_bar' class='progress-bar progress-bar-danger' " +
                "role='progressbar' aria-valuenow='100' aria-valuemin='0' aria-valuemax='100' style='width: 100%'>"
                + "Not valid!" +"</div>");
        }

        if (signatureVerification) {
            $("#verify_signature_progress").append("<div id='signature_progress_bar' " +
                "class='progress-bar progress-bar-success' role='progressbar' aria-valuenow='100' aria-valuemin='0' " +
                "aria-valuemax='100' style='width: 100%'>"+ "Valid!" +"</div>");
        } else {
            $("#verify_signature_progress").append("<div id='signature_progress_bar' " +
                "class='progress-bar progress-bar-danger' role='progressbar' aria-valuenow='100' aria-valuemin='0' " +
                "aria-valuemax='100' style='width: 100%'>"+ "Not valid!" +"</div>");
        }
    });
}
