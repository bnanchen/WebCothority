// Signing part
function sign(fileToSign) {
    nacl_factory.instantiate(function(nacl) {
        var sha256File = nacl.crypto_hash_sha256(bytesToHex(fileToSign));
        console.log(sha256File);
    });
}