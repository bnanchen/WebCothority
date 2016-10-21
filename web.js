/**
 * File with useful methods concerning Protobuf.
 */
function websocket(portNumber) {
    var a = protobufOp(portNumber); // Promise
    return a.then(function (message) {
        console.log(message);
       message;
    });
}

/**
 * Open a WebSocket and instantiate the Protobuf
 *
 * @portNumber the port number where the WebSocket need to connect
 */
function protobufOp(portNumber) {
    var ProtoBuf = dcodeIO.ProtoBuf;
    var Builder = ProtoBuf.newBuilder();
    var socket = new WebSocket("ws://localhost:" + portNumber + "/status");
    socket.binaryType = "arraybuffer";
    if (socket.readyState != 0 && socket.readyState != 1) {
        console.log("The opening of the WebSocket doesn't go well. Ready State constant:"+ socket.readyState);
    }
    // when the socket is opened (reaction):
    socket.onopen = function () {
        var bytes = hexToBytes("313c89a12cab56ce872744d2d7e144ce");
        var l = bytes.size;
        var lb = new Blob([new Uint8Array([l % 256, l / 256])], {type: "application/octet-stream"});
        socket.send(lb);
        socket.send(bytes);
        console.log("sent everything");
    }

    // Solution 1 with Callback function:
    // when the socket receives a message (reaction):
    /*function onMessageAsync(callback) { // callbacks
        socket.onmessage = function (e) {
            var status = ProtoBuf.loadProto(`
        message Module {
            map<string, string> module = 1; 
        }
        message Status {
            map<string, Module> Status = 1; 
        }
        `);

            var byte16 = e.data.slice(0, 15);
            var byteRem = e.data.slice(16, e.data.byteLength);
            console.log(e.data.byteLength);
            returnedMessage = status.build("Status").decode(byteRem); // private variable, considered as Object
            //callback(returnedMessage);


        }
    }
    onMessageAsync(function (returnedMessage) {
        node = new node(returnedMessage.Status.map.Status.value.module.map.Available_Services.value,
        returnedMessage.Status.map.Status.value.module.map.ConnType.value,
        returnedMessage.Status.map.Status.value.module.map.Host.value,
        returnedMessage.Status.map.Status.value.module.map.Port.value,
        returnedMessage.Status.map.Status.value.module.map.RX_bytes.value,
        returnedMessage.Status.map.Status.value.module.map.System.value,
        returnedMessage.Status.map.Status.value.module.map.TX_bytes.value,
        returnedMessage.Status.map.Status.value.module.map.Uptime.value,
        returnedMessage.Status.map.Status.value.module.map.Version.value);
        // utiliser des Promise!!!!
        return node;
    });*/

    function loadReceivedMessage() {
        // usage of a Promise:
        return new Promise(function (resolve, reject) {
            socket.onmessage = function(e) {
                var returnedMessage;
                var status = ProtoBuf.loadProto(`
                message Module {
                    map<string, string> module = 1; 
                }
                message Status {
                map<string, Module> Status = 1;  
                }
                `);

                var byte16 = e.data.slice(0, 15);
                var byteRem = e.data.slice(16, e.data.byLength);
                returnedMessage = status.build("Status").decode(byteRem);
                resolve(returnedMessage);
            };

            socket.onerror = function (e) {
                reject(e);
            };
        });
    }

    return loadReceivedMessage().then(function (returnedMessage) {
        returnedMessage;


    });
    /*return new Promise(function(resolve, reject) {
        resolve(returnedMessage)
    });*/

    // fermer le socket???????????
}