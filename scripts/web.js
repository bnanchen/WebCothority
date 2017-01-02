/**
 * File with useful methods concerning Protobuf.
 */
function websocket_status(portNumber) {
    const ProtoBuf = dcodeIO.ProtoBuf;
    const protoStatus = ProtoBuf.loadProto(`
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
    const socket = new WebSocket("ws://localhost:" + portNumber + "/Status/Request");
    socket.binaryType = "arraybuffer";
    if (socket.readyState != 0 && socket.readyState != 1) {
        console.log("The opening of the WebSocket doesn't go well. Ready State constant:"+ socket.readyState);
    }
    // when the socket is opened (reaction):
    socket.onopen = function () {
        const requestProto = protoStatus.build("Request");
        const request = new requestProto({});
        const requestHex = request.encode().toHex(); // finish doesn't exist
        const bytes = hexToBytes(requestHex);
        socket.send(bytes);
    };

    function loadReceivedMessage() {
        // usage of a Promise:
        return new Promise(function (resolve, reject) {
            socket.onmessage = function(e) {
                let returnedMessage;
                returnedMessage = protoStatus.build("Response").decode(e.data);

                resolve(returnedMessage);
            };

            socket.onerror = function (e) {
                reject(e);
            };
        });
    }
    return loadReceivedMessage();
}
/**
 *
 * @param portNumber
 * @param file        file as an ArrayBuffer
 * @returns {*}
 */
function websocket_sign(portNumber, file) {
    const ProtoBuf = dcodeIO.ProtoBuf;
    const socket = new WebSocket("ws://localhost:" + portNumber + "/CoSi/SignatureRequest");
    const aggKey = new Uint8Array(32);
    const protoSign = ProtoBuf.loadProto(`
    
        message ServerIdentity {
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
        
        message SignatureRequest {
            required bytes message = 1;
            required Roster roster = 2;
        }
        
        message SignatureResponse {
            required bytes hash = 1; 
            required bytes signature = 2;
        }
                `);
    socket.binaryType = "arraybuffer";
    if (socket.readyState != 0 && socket.readyState != 1) {
        console.log("The opening of the WebSocket doesn't go well. Ready State constant: "+ socket.readyState);
    }
    // when the socket is opened (reaction):
    socket.onopen = function () {
        const signMsgProto = protoSign.build("SignatureRequest");
        const rosterProto = protoSign.build("Roster");
        const siProto = protoSign.build("ServerIdentity");
        nacl_factory.instantiate(function (nacl) {
            // Create a list of ServerIdentities for the roster
            let agg = [];
            const listServers = window.listNodes.map(function(node, index) {
                const server = node.server;
                const pub = new Uint8Array(server.public.toArrayBuffer()); // public key of a server
                // the point is represented as a 2-dimensional array
                const pubNeg = [gf(), gf(), gf(), gf()]; // zero-point
                unpackneg(pubNeg, pub);
                const pubPosArr = new Uint8Array(32);
                pack(pubPosArr, pubNeg);
                const pubPos = [gf(), gf(), gf(), gf()]; // zero-point
                unpackneg(pubPos, pubPosArr);
                if (index == 0) {
                    agg = pubPos;
                } else {
                    // add pubPos to agg, storing result in agg
                    add(agg, pubPos);
                }
                return new siProto({public: server.public, id: server.id, address: server.address,
                    description: server.description});
            });
            pack(aggKey, agg);

            const rosterMsg = new rosterProto({list: listServers});
            // Calculate the hash and create the SignatureRequest
            const hash = nacl.crypto_hash_sha256(bytesToHex(file));
            const signMsg = new signMsgProto({roster: rosterMsg, message: hash});
            socket.send(signMsg.toArrayBuffer());
        });
    };

    function loadReceivedMessage() {
        // usage of a Promise:
        return new Promise(function (resolve, reject) {
            socket.onmessage = function(e) {
                let returnedMessage;
                // returnedMessage array composed of the response of the conode and the aggregate key
                returnedMessage = [protoSign.build("SignatureResponse").decode(e.data), aggKey];
                resolve(returnedMessage);
            };

            socket.onerror = function (e) {
                reject(e);
            };
        });
    }
    return loadReceivedMessage();
}

/**
 *
 *
 * @param g
 */
function runGenerator(g) {
    let iterator = g();
    (function iterate(message) {
        let ret = iterator.next(message);

        if (!ret.done) {
            ret.value.then(iterate);
        }
    })();
}