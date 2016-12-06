// Signing part
/**
 *
 * @param fileToSign
 */
function sign(fileToSign, filename, message) {
    console.log(filename);

    // instantiate the nacl module:
    nacl_factory.instantiate(function (nacl) {
        var signature = new Uint8Array(message.Signature.toArrayBuffer());
        var aggregateKey = new Uint8Array(message.Aggregate.toArrayBuffer());
        var hash = nacl.crypto_hash_sha256(bytesToHex(fileToSign)); // typeof: Uint8Array
        //var success = nacl.crypto_sign_verify_detached(signature, hash, aggregateKey);



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

        $("#download_button").click(function () {
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
 */
function verifySignature(fileToVerify) {
    console.log("verifySignature");
    // instantiate the nacl module:
    nacl_factory.instantiate(function (nacl) {
        var signature = new Uint8Array(fileToVerify);
        //var sig = new Uint8Array(message.Signature.toArrayBuffer());
        //var agg = new Uint8Array(message.Aggregate.toArrayBuffer());
        var hash = nacl.crypto_hash_sha256(bytesToHex("1234")); // Uint8Array
        var success = nacl.crypto_sign_verify_detached(signature, hash, agg);
        console.log(success);
    });
}

/**
 *
 *
 * @param filename
 * @param signature
 * @param aggregateKey
 * @param sha256File
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
    if(window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    }
    else{
        var elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = "signature_of_" + filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    }
}
