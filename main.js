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
$(document).ready(function () { // comme un main
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

    // Test 1: (ne fonctionne pas)
    //     var ProtoBuf = dcodeIO.ProtoBuf; // dcodeIO is not defined
    //     if (typeof dcodeIO === 'undefined' || !dcodeIO.ProtoBuf) {
    //       throw(new Error("Protobuf.js is not present. Try manual setup!"));
    //     }
    //     // test avec bouton hello world
    //     $("#hello").on("click", send());
    //     // Initialize Protobuf.js
    //     var ProtoBuf = dcodeIO.ProtoBuf;
    //     var Message = ProtoBuf.loadProtoFile("./example.proto").build("Message");
    //     // Connect to our server: node server.js
    //     var socket = new WebSocket("ws://localhost:8080/ws");
    //     socket.binaryType = "arraybuffer";
    //
    //     function send() {
    //       if (socket.readyState == WebSocket.OPEN) {
    //         var msg = new Message(text.value);
    //         socket.send(msg.toArrayBuffer());
    //         log.value += "Sent: "+ msg.text +"\n";
    //       } else {
    //         log.value += "Not connected\n";
    //       }
    //     }
    //
    //     socket.onopen = function() {
    //       log.value += "Connected\n";
    //     };
    //
    //     socket.onclose = function() {
    //       log.value += "Disconnected\n";
    //     };
    //
    //     socket.onmessage = function(evt) {
    //       try {
    //         // Decode the Message
    //         var msg = Message.decode(evt.data);
    //         log.value += "Received: "+ msg.text+"\n";
    //       } catch (err) {
    //         log.value += "Error: "+err+"\n";
    //       }
    //     }
    //
    // });
    //
    // log.value = ""; // Clear log on reload

    //test 2:
    var ProtoBuf = dcodeIO.ProtoBuf;
    var Builder = ProtoBuf.newBuilder();
    var socket = new WebSocket("ws://localhost:6979/status");
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

    function bytesToHex(bytes) {
        // conversion to a binary array:
        var hexArray = new Uint8Array(bytes.length /4);
        for (var i = 0; i < hexArray.length; i++) {
            hexArray[i] = parseInt(bytes.substr(i * 4, 4), 2);
        }
        // create a blob used to send the data:
        return new Blob([hexArray]);
        //return hexArray;
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
        // test car cothority ne fonctionne pas:
        e = "1010101010111011";
        var h = bytesToHex(e);
        socket.send(h);
        console.log(h);

    }

    // when the socket receives a message (reaction):
    socket.onmessage = function (e) {
        //console.log("receiving")
        //buffer = new Uint8Array(e.data);
        //console.log(e.data);
        //socket.send("ping");
        var status = ProtoBuf.loadProto(`
        message Status {
            map<string, string> status = 1; 
        }
        ` );
        console.log(typeof e);
        e.toString();
        var bit16 = e.slice(0,15);
        var remBytes = e.slice(16, e.length);
        var h = bytesToHex(bit16);
        console.log(h);
        var s = status.build("Status").decode(e.data);

        console.log(s);
    };

});
