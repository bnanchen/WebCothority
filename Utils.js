/**
 * File with useful methods for the project.
 */

/**
 * converts hexadecimal to bytes in returning a blob:
 */
function hexToBytes(hex) {
    // conversion to a binary array:
    var byteArray = new Uint8Array(hex.length / 2);
    for (var i = 0; i < byteArray.length; i++) {
        // conversion du string en bits avec parseInt:
        byteArray[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    // create a blob used to send the data:
    return new Blob([byteArray], {type: "application/octet-stream"});
}

/**
 * converts bytes to hexadecimal in returning a blob:
 */
function bytesToHex(byteArray) {
    // conversion to a binary b:
    var ua = new Uint8Array(byteArray);
    var h = '0x';
    for (var i = 0; i < ua.length; i++) {
        h += ("0"+ ua[i].toString(16)).slice(-2)+ " ";
    }
    return h;
}

