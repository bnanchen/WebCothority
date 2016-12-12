// Signing part
/**
 *
 *
 * @param fileToSign
 * @param filename
 * @param message
 */
function sign(fileToSign, filename, message) {
    // instantiate the nacl module:
    nacl_factory.instantiate(function (nacl) {
        var signature = new Uint8Array(message.signature.toArrayBuffer());
        var aggregateKey = new Uint8Array(message.aggregate.toArrayBuffer());
        var hash = nacl.crypto_hash_sha256(bytesToHex(fileToSign)); // typeof: Uint8Array


        /*
        var keys = nacl.crypto_sign_keypair(); // return: {signPk, signSk} with signPk public key and signSk private key
        var signedFile = nacl.crypto_sign(sha256File, keys.signSk); // typeof: Uint8Array

        if (nacl.crypto_sign_open(signedFile, keys.signPk) == null) {
            // signature is not good
            console.log("arf");
        } else {
            // signature is good
            console.log("Good signature");
        }

        var signedFileBase64 = btoa(String.fromCharCode.apply(null, signedFile));
        */

        var signatureBase64 = btoa(String.fromCharCode.apply(null, signature));
        var aggregateKeyBase64 = btoa(String.fromCharCode.apply(null, aggregateKey));
        var hashBase64 = btoa(String.fromCharCode.apply(null, hash));

        // if the download button doesn't exist: create it
        if ($("#download_button").length == 0) {
            $("#add_download_button").append("<button class='btn btn-default' type='button' id='download_button'>" + "Download the Signature" + "</button>");
        }

        // download the JSON file in clicking on the download_button
        $("#download_button").unbind('click').click(function () {
            downloadJSONFile(filename, signatureBase64, aggregateKeyBase64, hashBase64);
        });


        // ====================== OLD VERSION ================================
        // instantiate the nacl module:
        /* nacl_factory.instantiate(function(nacl) {
         var sha256File = nacl.crypto_hash_sha256(bytesToHex(fileToSign)); // Uint8Array
         var keys = nacl.crypto_sign_keypair(); // return: {signPk, signSk} with signPk public key and signSk private key
         var signedFile = nacl.crypto_sign(sha256File, keys.signSk); // Uint8Array
         if (nacl.crypto_sign_open(signedFile, keys.signPk) == null) {
         console.log("arf"); // signature is not good
         } else {
         console.log("Good signature");
         }
         // translate the signature in base64:
         var signedFilebase64 = btoa(String.fromCharCode.apply(null, signedFile));
         //alert(signedFilebase64);
         $("#add_download_button").append("<button class='btn btn-default' type='button' id='download_button'>"+ "Download the Signature" + "</button>");
         $("#download_button").click(function() {
         downloadSignature("signature_of_" + file.fileName, signedFilebase64);
         });
         });*/
    });
}

/**
 *
 *
 * @param fileToVerify
 * @param signatureToVerify
 * @param message
 */
function verifySignature(fileToVerify, signatureToVerify, message) {
    var objectJSON = getJSONFileInObject(signatureToVerify);
    var hash_verification = false;
    var signature_verification = false;

    // instantiate the nacl module:
    nacl_factory.instantiate(function (nacl) {
        var signature = fromBase64toUint8Array(objectJSON.signature);
        var aggregate = fromBase64toUint8Array(objectJSON["aggregate key"]);
        var hash = nacl.crypto_hash_sha256(bytesToHex(fileToVerify)); // Uint8Array

        // Verification if the hash of the fileToVerify is the same as the hash of the file inside the JSON file:
        var hashJSON = fromBase64toUint8Array(objectJSON.hash);
        if (isEqualTo(hash, hashJSON)) {
            hash_verification = true;
        }

        // Verification of the signature with the hash and the aggregate public key:
        var verification = nacl.crypto_sign_verify_detached(signature, hash, aggregate);
        if (verification) {
            signature_verification = true;
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
        if (hash_verification) {
            $("#verify_hash_progress").append("<div id='hash_progress_bar' class='progress-bar progress-bar-success' role='progressbar' aria-valuenow='100' aria-valuemin='0' aria-valuemax='100' style='width: 100%'>"+ "Valid!" +"</div>");
        } else {
            $("#verify_hash_progress").append("<div id='hash_progress_bar' class='progress-bar progress-bar-danger' role='progressbar' aria-valuenow='100' aria-valuemin='0' aria-valuemax='100' style='width: 100%'>"+ "Not valid!" +"</div>");
        }

        if (signature_verification) {
            $("#verify_signature_progress").append("<div id='signature_progress_bar' class='progress-bar progress-bar-success' role='progressbar' aria-valuenow='100' aria-valuemin='0' aria-valuemax='100' style='width: 100%'>"+ "Valid!" +"</div>");
        } else {
            $("#verify_signature_progress").append("<div id='signature_progress_bar' class='progress-bar progress-bar-danger' role='progressbar' aria-valuenow='100' aria-valuemin='0' aria-valuemax='100' style='width: 100%'>"+ "Not valid!" +"</div>");
        }

    });
}

/**
 *
 *
 * @param filename
 * @param signature
 * @param aggregateKey
 * @param hash
 */
function downloadJSONFile(filename, signature, aggregateKey, hash) {
    // today date in format: mm/dd/yyyy
    var currentTime = new Date();
    var day = currentTime.getDay();
    var month = currentTime.getMonth()+1; // January is number 0
    var year = currentTime.getFullYear();


    var jsonFile = {
        filename: filename,
        date: day +"/"+ month +"/"+ year,
        signature: signature,
        'aggregate key': aggregateKey,
        hash: hash
    };

    var blob = new Blob([JSON.stringify(jsonFile, null, 5)], {type: 'application/json'});

    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    }
    else {
        var elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = "signature_of_" + filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    }
}
