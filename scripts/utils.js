/**
 * File with useful methods for the project.
 */

/**
 * converts hexadecimal to bytes in returning a blob
 *
 * @return Blob
 */
function hexToBytes(hex) {
    // conversion to a binary array:
    const byteArray = new Uint8Array(hex.length / 2);
    for (let i = 0; i < byteArray.length; i++) {
        // conversion du string en bits avec parseInt:
        byteArray[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    // create a blob used to send the data:
    return new Blob([byteArray], {type: "application/octet-stream"});
}

/**
 * converts bytes to hexadecimal
 *
 * @return Uint8Array
 */
function bytesToHex(byteArray) {
    // conversion to a binary b:
    const ua = new Uint8Array(byteArray);
    let h = '0x';
    for (let i = 0; i < ua.length; i++) {
        h += ("0"+ ua[i].toString(16)).slice(-2)+ " ";
    }
    return h;
}

/**
 * Compare two Uint8Array, if they are the same return true, otherwise false.
 *
 * @param first
 * @param second
 * @returns {boolean}
 */
function isEqualTo(first, second) {
    if (first.length != second.length) {
        return false;
    } else {
        for (let i = 0; i < first.length; i++) {
            if (first[i] != second[i]) {
                return false;
            }
        }
        return true;
    }
}

/**
 * Translate a file in base64 to a file in Uint8Array
 *
 * @param base64
 * @returns {Uint8Array}
 */
function fromBase64toUint8Array(base64) {
    return new Uint8Array(atob(base64).split("").map(function(c) {
        return c.charCodeAt(0); }));
}

