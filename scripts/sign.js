// Signing part
/**
 *
 * @param fileToSign
 */
function sign(fileToSign, file) {
    // instantiate the nacl module:
    nacl_factory.instantiate(function(nacl) {
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
        $("#add_download_button").append("<button type='button' id='download_button'>"+ "Download the Signature" + "</button>");
        $("#download_button").click(function() {
            downloadSignature("signature_of_" + file.fileName, signedFilebase64);
        });
    });
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