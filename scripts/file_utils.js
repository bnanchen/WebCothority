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
