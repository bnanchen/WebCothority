// download an element inside a blob from my computer
/*
var file = $("#file-sign");

file.fileinput({
    //uploadUrl: 'scripts/fileUpload.php', // using Ajax
    showCaption: true,
    showUpload: true,
    uploadLabel: "Submit",
    uploadClass: "btn btn-success",
    showRemove: false,
    uploadAsync: true,
    //maxFileSize: 4096,
    maxFilesNum: 1,
    maxFileCount: 1,
    multiple: false,
    showPreview: true
});

file.on('fileuploaded', function(event, data, previewId, index) {
    console.log('File uploaded triggered');
    console.log(data);
    console.log(data.response.data);
});

file.on('fileselect', function(event, numFiles, label) {
    console.log("fileselect");
});

file.on('fileloaded', function(event, file, previewId, index, reader) {
    console.log("fileloaded");
});

file.fileinput('upload');

*/



// A L'ANCIENNE:
/**
 * take care of the file if there is an upload
 *
 * @param file the file uploaded (Blob)
 */
function takeCareOf(file) {
    var reader = new FileReader();
    var progressBar = document.querySelector('.percent');;
    progressBar.style.width = '0%';
    progressBar.textContent = '0%';

    reader.onprogress = updateProgress(event, progressBar);

    reader.onload = function(event) {
        // Ensure that the progress bar displays 100% at the end.
        progressBar.style.width = '100%';
        progressBar.textContent = '100%';
        console.log("Ended to load the file");
        sign(event.target.result, file); // file read in ArrayBuffer
    };
    reader.readAsArrayBuffer(file); // trigger the onload (asynchrone)
}

/**
 * if there is an upload of a file by the user: call takeCareOf(file)
 */
$("#fileInput").change(function() {
   console.log(this.files[0]);
   takeCareOf(this.files[0]);
});

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








