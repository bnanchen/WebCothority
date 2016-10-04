
    // si je mets dans le ready ne fonctionne pas:
    // var hello = $("#hello");
    // hello.on("click", function(event) {
    //   console.log("button hello clicked");
    // });

    //suppression d'une ligne du tableau:
    $("#status").on("click", "tr", function(event) {
      console.log($(this).text());
    });

    //ajout d'une ligne au tableau:
    var submitted = $("#sss");
    submitted.submit(function(event) {
      if ($(".requested").val().length === 0) {
        console.log("un champ obligatoire n'a pas été rempli");
        event.preventDefault();
      }
    });

    $("#toDelete").on("click", function(event) {
      //$("#status tr.removable").remove(); // comment choisir la ligne où j'ai cliqué.
      $(this).closest("tr").remove();
    });


/*****************************************//**
* MAIN
*/
    $( document ).ready(function() { // comme un main
      // appelle la fonction udpateList() toutes les 3 secondes:
      setInterval(function(){update()}, 3000);
      // $("#hello").on("click", function(event) {
      //   alert(list[0].name);
      // });
      var hello = $("#hello");
      hello.on("click", function() {
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
  var socket = new WebSocket("ws://localhost:6979/debug");
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

  // converts hexadecimal to bytes in returning a blob:
  function hexToBytes(hex) {
    // conversion to a binary array:
    var byteArray = new Uint8Array(hex.length/2);
    for (var i = 0; i < byteArray.length; i++) {
      byteArray[i] = parseInt(hex.substr(i*2, 2), 16);
    }
    // create a blob used to send the data:
    return new Blob([byteArray], {type: "application/octet-stream"});
}

  // when the socket is opened (reaction):
  socket.onopen = function() {
    socket.send(hexToBytes("0003"));
    var bytes = hexToBytes("313c89a12cab56ce872744d2d7e144ce");
    socket.send(bytes);
    console.log(bytes);
  }
  socket.onmessage = function(e) { // traite le message reçu et l'affiche dans la console
    console.log(e.data);
    socket.send("ping");
  };

});
