/**
 * Process the information to allow the user to download the signature JSON file
 *
 * @param fileSigned  signed file as an ArrayBuffer
 * @param filename    name of the signed file
 * @param message     array containing the file's signature and the aggregate-key
 */
function saveToFile(fileSigned, filename, message) {
    // instantiate the nacl module:
    nacl_factory.instantiate(function (nacl) {
        const signature = new Uint8Array(message[0].signature.toArrayBuffer());
        const hash = nacl.crypto_hash_sha256(bytesToHex(fileSigned)); // typeof: Uint8Array

        const signatureBase64 = btoa(String.fromCharCode.apply(null, signature));
        const aggregateKeyBase64 = btoa(String.fromCharCode.apply(null, message[1]));
        const hashBase64 = btoa(String.fromCharCode.apply(null, hash));

        // if the download button doesn't exist: create it
        if ($("#download_button").length === 0) {
            $("#add_download_button").append("<button class='btn btn-primary' type='button' id='download_button'>"
                + "Download the Signature" + "</button>");
        }

        // download the JSON file in clicking on the download_button
        $("#download_button").unbind('click').click(function () {
            downloadJSONFile(filename, signatureBase64, aggregateKeyBase64, hashBase64);
        });
    });
}

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

    // instantiate the nacl module:
    nacl_factory.instantiate(function (nacl) {
        const signature = fromBase64toUint8Array(objectJSON.signature).slice(0, 64);
        const aggregate = fromBase64toUint8Array(objectJSON["aggregate-key"]);
        const hash = nacl.crypto_hash_sha256(bytesToHex(fileToVerify)); // Uint8Array
        console.log(objectJSON["aggregate-key"].length);
        console.log(objectJSON.signature.length);
        console.log(objectJSON.hash.length);

        // Verification if the hash of the fileToVerify is the same as the hash of the file inside the JSON file:
        const hashJSON = fromBase64toUint8Array(objectJSON.hash);
        if (isEqualTo(hash, hashJSON)) {
            hashVerification = true;
        }

        // Verification of the signature with the hash and the aggregate public key:
        const verification = nacl.crypto_sign_verify_detached(signature, hash, aggregate);
        if (verification) {
            signatureVerification = true;
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

/**
 * Let the user download the JSON signature file to his computer
 *
 * @param filename
 * @param signature      file's signature
 * @param aggregateKey   aggregate-key
 * @param hash           file's hash
 */
function downloadJSONFile(filename, signature, aggregateKey, hash) {
    // today date in format: mm/dd/yyyy
    const currentTime = new Date();
    const day = currentTime.getDay();
    const month = currentTime.getMonth()+1; // January is number 0
    const year = currentTime.getFullYear();

    const jsonFile = {
        filename: filename,
        date: day +"/"+ month +"/"+ year,
        signature: signature,
        'aggregate-key': aggregateKey,
        hash: hash
    };

    const blob = new Blob([JSON.stringify(jsonFile, null, 5)], {type: 'application/json'});

    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    }
    else {
        const elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = "signature_of_" + filename +".json";
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    }
}
