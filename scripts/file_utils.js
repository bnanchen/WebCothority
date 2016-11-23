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

function takeCareOf(file) {
    var reader = new FileReader();
    reader.onload = function(event) {
        console.log("Ended to load the file");
        sign(event.target.result); // try with file and will see
    };
    reader.readAsArrayBuffer(file); // trigger the onload (asynchrone)
}

$("#fileInput").change(function() {
   console.log(this.files[0]);
   takeCareOf(this.files[0]);
});



