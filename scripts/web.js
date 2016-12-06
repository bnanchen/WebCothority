/**
 * File with useful methods concerning Protobuf.
 */
function websocket(portNumber) {
    var ProtoBuf = dcodeIO.ProtoBuf;
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
        //console.log("sent everything");
    };

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
                
                message Test {
                    required string Msg = 1;
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
            //return ;
        });
    }
    return loadReceivedMessage();
    //return loadReceivedMessage();
}
/**
 *
 * @param portNumber
 * @param file        file as an ArrayBuffer
 * @returns {*}
 */
function websocket_sign(portNumber, file) {
    var ProtoBuf = dcodeIO.ProtoBuf;
    var socket = new WebSocket("ws://localhost:" + portNumber + "/sign");
    var protoSign = ProtoBuf.loadProto(`
                message SignRequest {
                    required bytes Hash = 1;
                    required string NodeList = 2;
                }

                message SignReply {
                    required bytes Signature = 1;
                    required bytes Aggregate = 2;
                }
                `);
    socket.binaryType = "arraybuffer";
    if (socket.readyState != 0 && socket.readyState != 1) {
        console.log("The opening of the WebSocket doesn't go well. Ready State constant: "+ socket.readyState);
    }
    // when the socket is opened (reaction):
    socket.onopen = function () {
        var signMsgProto = protoSign.build("SignRequest");
        nacl_factory.instantiate(function(nacl) {
            var hash = nacl.crypto_hash_sha256(bytesToHex(file)); // Uint8Array
            var signMsg = new signMsgProto({Hash: hash, NodeList: "localhost:2000"});
            var signMsgHex = signMsg.encode().toHex(); // finish doesn't exist
            var bytes = hexToBytes("be4784be234e5373908efe6820330ee9" + signMsgHex);
            var l = bytes.size;
            var lb = new Blob([new Uint8Array([l % 256, l / 256])], {type: "application/octet-stream"});
            socket.send(lb);
            socket.send(bytes);
            console.log("sent signRequest");
        });
    };

    function loadReceivedMessage() {
        // usage of a Promise:
        return new Promise(function (resolve, reject) {
            socket.onmessage = function(e) {
                var returnedMessage;

                var byte16 = e.data.slice(0, 15);
                var byteRem = e.data.slice(16, e.data.byLength);
                returnedMessage = protoSign.build("SignReply").decode(byteRem);
                resolve(returnedMessage);
            };

            socket.onerror = function (e) {
                reject(e);
            };
        });
    }
    return loadReceivedMessage();
}


function runGenerator(g) {
    var it = g(), ret;
    (function iterate(val) {
        ret = it.next(val);

        if (!ret.done) {
            if("then" in ret.value) {
                ret.value.then(iterate);
            } else {
                setTimeout(function() {
                    iterate(ret.value);
                }, 0);
            }
        }
    })();
}
