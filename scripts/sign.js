// Signing part
function sign(fileToSign) {
    // instantiate the nacl module:
    nacl_factory.instantiate(function(nacl) {
        var sha256File = nacl.crypto_hash_sha256(bytesToHex(fileToSign)); // Uint8Array
        var keys = nacl.crypto_sign_keypair(); // return: {signPk, signSk} with signPk public key and signSk private key
        var signedFile = nacl.crypto_sign(sha256File, keys.signSk); // Uint8Array
        if (nacl.crypto_sign_open(signedFile, keys.signPk) == null) {
            console.log("arf");
        } else {
            console.log("Good signature");
        }
    });
}