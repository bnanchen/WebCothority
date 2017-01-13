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

/**
 * Transform in a 'pretty' string the uptime of a server
 *
 * @param dateToParse string representing the uptime of a server
 * @returns {string}  'pretty' string
 */
function displayPrettyDate(dateToParse) {
    const listNumbers = ["0","1","2","3","4","5","6","7","8","9"];
    let buffer = "";
    let years = "";
    let months = "";
    let days = "";
    let hours = "";
    let minutes = "";
    let seconds = "";
    let milliseconds = "";

    for (let i = 0; i < dateToParse.length; i++) {
        if (listNumbers.indexOf(dateToParse[i]) != -1) {
            buffer = buffer.concat(dateToParse[i]);
        } else {
            if (dateToParse[i] === ".") {
                seconds = buffer;
                if (seconds.length == 1) {
                    seconds = "0" + seconds;
                }
            } else if (dateToParse[i] === "s") {
                milliseconds = buffer.slice(0,2);
            }
            else if (dateToParse[i] === "m") {
                minutes = buffer;
                if (minutes.length == 1) {
                    minutes = "0" + minutes;
                }
            } else if (dateToParse[i] === "h") {
                hours = buffer;
            } else if (dateToParse[i] === "d") {
                days = buffer;
            } else if (dateToParse[i] === "mo") {
                months = buffer;
            } else if (dateToParse[i] === "y") {
                years = buffer;
            }
            buffer = "";
        }
    }

    let date = seconds +"."+ milliseconds;
    if (minutes != "") {
        date = minutes +":"+ date;
    }
    if (hours != "") {
        date = hours +":"+ date;
    }
    if (days != "") {
        date = days +"d. "+ date;
    }
    if (months != "") {
        date = months +"m. "+ date;
    }
    if (years != "") {
        date = years +"y. " + date;
    }

    return date;
}

