/**
 * take care of the file if there is an upload
 *
 * @param file the file uploaded (Blob)
 * @param asArrayBuffer true if we want to read the file as an ArrayBuffer, otherwise read as a String
 */
function takeCareOf(file, asArrayBuffer) {
    const reader = new FileReader();

    function loadFile() {
        // usage of a Promise:
        return new Promise(function (resolve) {
            reader.onload = function(event) {
                resolve(event.target.result);
            };
        });
    }

    if (asArrayBuffer === true) {
        reader.readAsArrayBuffer(file); // trigger the onload (asynchrone)
    } else {
        reader.readAsText(file); // trigger the onload (asynchrone)
    }

    return loadFile();
}

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

/**
 * Isolate the filename from the full path of the file
 *
 * @param fullPathName full path of the file
 */
function getFilename(fullPathName) {
    let charBackslachNumber = 0;
    let charPointNumber = fullPathName.length;

    for (let i = 0; i < fullPathName.length; i++) {
        // take off all characters before the last '\' (included itself)
        if (fullPathName[i] === "\\") {
            charBackslachNumber = i;
        }

        // take off all characters after the last '.'
        if (fullPathName[i] === '.') {
            charPointNumber = i;
        }
    }

    return fullPathName.slice(charBackslachNumber+1, charPointNumber);
}

/**
 * Return the extension name of the file
 *
 * @param file
 */
function getFileExtension(file) {
    let charPointNumber = 0;

    for (let i = 0; i < file.length; i++) {
        // take off all characters before the last '.'
        if (file[i] === '.') {
            charPointNumber = i;
        }
    }

    return file.slice(charPointNumber+1, file.length);
}

/**
 * Read the signature JSON file as a text and return it as an object
 *
 * @param text
 * @returns {*}
 */
function getJSONFileInObject(text) {
    return JSON.parse(text);
}
