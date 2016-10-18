// si je mets dans le ready ne fonctionne pas:
// var hello = $("#hello");
// hello.on("click", function(event) {
//   console.log("button hello clicked");
// });

//suppression d'une ligne du tableau:
$("#status").on("click", "tr", function (event) {
    console.log($(this).text());
});

//ajout d'une ligne au tableau:
var submitted = $("#sss");
submitted.submit(function (event) {
    if ($(".requested").val().length === 0) {
        console.log("un champ obligatoire n'a pas été rempli");
        event.preventDefault();
    }
});

$("#toDelete").on("click", function (event) {
    //$("#status tr.removable").remove(); // comment choisir la ligne où j'ai cliqué.
    $(this).closest("tr").remove();
});


/*****************************************/
/**
 * MAIN
 */
$(document).ready(function () {
    // appelle la fonction udpateList() toutes les 3 secondes:
    setInterval(function () {
        update()
    }, 3000);
    // $("#hello").on("click", function(event) {
    //   alert(list[0].name);
    // });
    var hello = $("#hello");
    hello.on("click", function () {
        console.log("Hello World!");
    });

    var ProtoBuf = dcodeIO.ProtoBuf;
    var Builder = ProtoBuf.newBuilder();
    var socket = new WebSocket("ws://localhost:7101/status");
    socket.binaryType = "arraybuffer";
    // quand le socket est ouvert alors il va devoir réagir par cette fonction:
    // socket.onopen = function() { // à l'ouverture réagit de cette manière: envoie un message "ping"
    //   socket.send("ping");
    // }
    // quand un message est reçu par le socket alors il va devoir réagir par cette fonction:
    // socket.onmessage = function(e) { // traite le message reçu et l'affiche dans la console
    //   console.log(e.data);
    //   socket.send("ping");
    // };

    /*****************************************/
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

    function hexToBytesX(hex) {
        // conversion to a binary array:
        var byteArray = new Uint8Array(hex.length / 2);
        for (var i = 0; i < byteArray.length; i++) {
            // conversion du string en bits avec parseInt:
            byteArray[i] = parseInt(hex.substr(i * 2, 2), 16);
        }
        // create a blob used to send the data:
        return byteArray;
    }
    /*****************************************/
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

    /*****************************************/
    /**
     * converts an ArrayBuffer to a String:
     */
    function ab2str(buf) {
        return String.fromCharCode.apply(null, new Uint16Array(buf));
    }

    // when the socket is opened (reaction):
    socket.onopen = function () {
        // code utilisé pour testDebug(t * testing.T)
        // socket.send(hexToBytes("0003"));
        // var bytes = hexToBytes("313c89a12cab56ce872744d2d7e144ce");
        // socket.send(bytes);
        // console.log(bytes); // mauvaise longueur de message, pour cela qu'il ne "lit" pas tout.

        var bytes = hexToBytes("313c89a12cab56ce872744d2d7e144ce");
        var l = bytes.size;
        var lb = new Blob([new Uint8Array([l%256, l/256])], {type:"application/octet-stream"});
        socket.send(lb);
        socket.send(bytes);
        console.log("sent everything");
    }

    // when the socket receives a message (reaction):
    socket.onmessage = function (e) {
        var status = ProtoBuf.loadProto(`
        message Module {
            map<string, string> module = 1; 
        }
        message Status {
            map<string, Module> Status = 1; 
        }
        ` );

        var byte16 = e.data.slice(0,15);
        var byteRem = e.data.slice(16, e.data.byteLength);
        console.log(e.data.byteLength);
        console.log(byte16);
        var h = bytesToHex(byteRem);
        console.log(h);
        // manière pour afficher dans la console un blob:
        /*var myReader = new FileReader();
        myReader.onload = function(event){
            console.log(JSON.stringify(myReader.result));
        };
        myReader.readAsText(h);*/
        var s = status.build("Status").decode(byteRem);
        console.log(s);
    };

});
