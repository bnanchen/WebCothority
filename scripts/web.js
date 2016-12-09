/**
 * File with useful methods concerning Protobuf.
 */
function websocket(portNumber) {
    var ProtoBuf = dcodeIO.ProtoBuf;
    var status = ProtoBuf.loadProto(`
                message SignRequest {
                    required bytes Hash = 1;
                    required string NodeList = 2;
                }

                message SignReply {
                    required bytes Signature = 1;
                    required bytes Aggregate = 2;
                }

                message Request {
                }

                message Status {
                    map<string, string> field = 1;
                }

                message Response {
                    map<string, Status> system = 1;
                }
                `);
    var socket = new WebSocket("ws://localhost:" + portNumber + "/Status/Request");
    socket.binaryType = "arraybuffer";
    if (socket.readyState != 0 && socket.readyState != 1) {
        console.log("The opening of the WebSocket doesn't go well. Ready State constant:"+ socket.readyState);
    }
    // when the socket is opened (reaction):
    socket.onopen = function () {
        var requestProto = status.build("Request");
        var request = new requestProto({});
        var requestHex = request.encode().toHex(); // finish doesn't exist
        var bytes = hexToBytes(requestHex);
        socket.send(bytes);
        //console.log("sent everything");
    };

    function loadReceivedMessage() {
        // usage of a Promise:
        return new Promise(function (resolve, reject) {
            socket.onmessage = function(e) {
                var returnedMessage;
                returnedMessage = status.build("Response").decode(e.data);

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
    var socket = new WebSocket("ws://localhost:" + portNumber + "/CoSi/SignatureRequest");
    var protoSign = ProtoBuf.loadProto(`
    
        message ServerIdentity {
            required string Public = 1;
            required string Address = 2;
            required string ID = 3;
        }
    
        message Roster {
            required bytes id = 1;
            repeated ServerIdentity list = 2;
            required bytes aggregate = 3;
        }

       message Sign {
            required Roster NodeList = 1;
            required bytes Hash = 2;
        }

        message SignatureResponse {
            required bytes Aggregate = 1;
            required bytes Signature = 2;
        }
        
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
        var signMsgProto = protoSign.build("Sign");
        var rosterProto = protoSign.build("Roster");
        nacl_factory.instantiate(function(nacl) {
            var rosterMsg = new rosterProto({id: hexToBytes("deadbeef"), list: [], aggregate: hexToBytes("cafe")});
            var hash = nacl.crypto_hash_sha256(bytesToHex(file)); // Uint8Array
            var signMsg = new signMsgProto({Hash: hash, NodeList: rosterMsg});
            var signMsgHex = signMsg.encode().toHex(); // finish doesn't exist
            var bytes = hexToBytes(signMsgHex);
            socket.send(bytes);
            console.log("sent signRequest");
        });
    };

    function loadReceivedMessage() {
        // usage of a Promise:
        return new Promise(function (resolve, reject) {
            socket.onmessage = function(e) {
                var returnedMessage;

                returnedMessage = protoSign.build("SignatureResponse").decode(e.data);
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
