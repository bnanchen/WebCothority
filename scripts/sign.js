// Signing part
/**
 *
 * @param fileToSign
 */
function sign(fileToSign, file) {
    nacl_factory.instantiate(function (nacl) {
        var sha256File = nacl.crypto_hash_sha256(bytesToHex(fileToSign)); // typeof: Uint8Array
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

        // if the download button doesn't exist: create it
        if ($("#download_button").length == 0) {
            console.log("caca");
            $("#add_download_button").append("<button class='btn btn-default' type='button' id='download_button'>" + "Download the Signature" + "</button>");
            $("#download_button").click(function () {
                downloadSignature("signature_of_" + file.fileName, signedFileBase64);
            });
        }


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

function verifySignature(fileToVerify) {

}

/**
 *
 * @param filename
 * @param data
 */
function downloadSignature(filename, data) {
    var blob = new Blob([data], {type: 'text/txt'});
    if(window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    }
    else{
        var elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    }
}