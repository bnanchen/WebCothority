/**
 * File with useful methods concerning Protobuf.
 */

function protobufInst(portNumber) {
    var ProtoBuf = dcodeIO.ProtoBuf;
    var Builder = ProtoBuf.newBuilder();
    var socket = new WebSocket("ws://localhost:" + portNumber + "/status");
    socket.binaryType = "arraybuffer";

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
        console.log(byte16);
        var h = bytesToHex(byteRem);
        console.log(h);
        var s = status.build("Status").decode(byteRem);
        console.log(s);
    }
}