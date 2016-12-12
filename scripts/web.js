/**
 * File with useful methods concerning Protobuf.
 */
function websocket(portNumber) {
    var ProtoBuf = dcodeIO.ProtoBuf;
    var status = ProtoBuf.loadProto(`
				message ServerIdentity{
    				required bytes public = 1;
    				required bytes id = 2;
    				required string address = 3;
    				required string description = 4;
				}

                message Request {
                }

				message Response {
    				map<string, Status> system = 1;
    				optional ServerIdentity server = 2;

				    message Status {
        				map<string, string> field = 1;
    				}
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
    
message ServerIdentity{
    required bytes public = 1;
    required bytes id = 2;
    required string address = 3;
    required string description = 4;
}

message Roster {
    optional bytes id = 1;
    repeated ServerIdentity list = 2;
    optional bytes aggregate = 3;
}

message SignatureRequestFake {
    required bytes roster = 1;
    required bytes message = 2;
}

message SignatureRequest {
    required bytes message = 1;
    required Roster roster = 2;
}

message SignatureResponse {
    required bytes aggregate = 1;
    required bytes signature = 2;
}
                `);
    socket.binaryType = "arraybuffer";
    if (socket.readyState != 0 && socket.readyState != 1) {
        console.log("The opening of the WebSocket doesn't go well. Ready State constant: "+ socket.readyState);
    }
    // when the socket is opened (reaction):
    socket.onopen = function () {
        var signMsgProto = protoSign.build("SignatureRequest");
        var rosterProto = protoSign.build("Roster");
        var siProto = protoSign.build("ServerIdentity");
        nacl_factory.instantiate(function(nacl) {
        	// Create a list of ServerIdentities for the roster.
        	var list = listNodes.map(function(node){
        		var s = node.server;
        		return new siProto({public: s.public, id: s.id, address: s.address,
        			description: s.description});
        	})
			var rosterMsg = new rosterProto({list:list});

			// Calculate the hash and create the SignatureRequest.
            var hash = nacl.crypto_hash_sha256(bytesToHex(file));
            var signMsg = new signMsgProto({roster: rosterMsg, message: hash});
            socket.send(signMsg.toArrayBuffer());
        });
    };

    function loadReceivedMessage() {
        // usage of a Promise:
        return new Promise(function (resolve, reject) {
            socket.onmessage = function(e) {
                var returnedMessage;

                returnedMessage = protoSign.build("SignatureResponse").decode(e.data);
                console.log(returnedMessage)
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
