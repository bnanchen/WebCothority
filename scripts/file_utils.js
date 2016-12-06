/**
 * take care of the file if there is an upload
 *
 * @param file the file uploaded (Blob)
 * @param asArrayBuffer true if we want to read the file as an ArrayBuffer, otherwise read as a String
 */
function takeCareOf(file, asArrayBuffer) {
    var reader = new FileReader();
    var progressBar = document.querySelector('.percent');;
    progressBar.style.width = '0%';
    progressBar.textContent = '0%';

    reader.onprogress = updateProgress(event, progressBar);

    function loadFile() {
        // usage of a Promise:
        return new Promise(function (resolve, reject) {
            reader.onload = function(event) {

                // Ensure that the progress bar displays 100% at the end.
                progressBar.style.width = '100%';
                progressBar.textContent = '100%';
                console.log("Ended to load the file");
                //sign(event.target.result, file); // file read in ArrayBuffer (typeof event.target.result)
                resolve(event.target.result);
            };
        });
    }

    if (asArrayBuffer == true) {
        reader.readAsArrayBuffer(file); // trigger the onload (asynchrone)
    } else {
        reader.readAsText(file); // trigger the onload (asynchrone)
    }

    return loadFile();
}


/**
 * update the progress bar when there is the upload of a file
 *
 * @param evt progress event
 */
function updateProgress(evt, progressBar) {
    // evt is an ProgressEvent.
    if (evt.lengthComputable) {
        var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
        // Increase the progress bar length.
        if (percentLoaded < 100) {
            progressBar.style.width = percentLoaded + '%';
            progressBar.textContent = percentLoaded + '%';
        }
    }
}

/**
 * Isolate the filename from the full path of the file
 *
 * @param fullPathName full path of the file
 */
function getFilename(fullPathName) {
    var charBackslachNumber = 0;
    var charPointNumber = 0;

    for (i = 0; i < fullPathName.length; i++) {
        // take off all characters before the last '\' (included itself)
        if (fullPathName[i] == "\\") {
            charBackslachNumber = i;
        }

        // take off all characters after the last '.'
        if (fullPathName[i] == '.') {
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
    var charPointNumber = 0;

    for (i = 0; i < file.length; i++) {
        // take off all characters before the last '.'
        if (file[i] == '.') {
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
    var object = JSON.parse(text);
    return object;
}
