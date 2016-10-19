/**
 * File with useful methods concerning Protobuf.
 */

function websocket() {
    protobufOp(7101);

    // when the socket is opened (reaction):
    socket.onopen = function () {
        var bytes = hexToBytes("313c89a12cab56ce872744d2d7e144ce");
        var l = bytes.size;
        var lb = new Blob([new Uint8Array([l % 256, l / 256])], {type: "application/octet-stream"});
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
        `);

        var byte16 = e.data.slice(0, 15);
        var byteRem = e.data.slice(16, e.data.byteLength);
        console.log(e.data.byteLength);
        var returnedMessage = status.build("Status").decode(byteRem); // not assigned
        //console.log(returnedMessage);
    }

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
    if (socket.readyState != 1) {
        console.log("The opening of the WebSocket doesn't go well. Ready State constant:"+ socket.readyState);
    }
}