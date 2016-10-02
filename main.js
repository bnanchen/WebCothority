
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
  var ProtoBuf = require(["protobufjs"]); // console says:"require not defined"
  //var ProtoBuf = dcodeIO.ProtoBuf; // console says:"dcodeIO not defined"
  //var Builder = ProtoBuf.newBuilder(); // la fonction newBuilder() n'existe pas

});
