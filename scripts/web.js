/**
 * File with useful methods concerning Protobuf.
 */
const ProtoBuf = dcodeIO.ProtoBuf;
// protoFile contains all the Protocol Buffer messages
const protoFile = ProtoBuf.loadProto(`
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

/**
 * Contact a conode and retrieve Status response
 *
 * @param portNumber port number of the conode to contact
 * @returns {*}      status information inside a Promise object
 */
function websocket_status(portNumber) {
    const socket = new WebSocket("ws://localhost:" + portNumber + "/Status/Request");
    socket.binaryType = "arraybuffer";
    if (socket.readyState != 0 && socket.readyState != 1) {
        console.log("The opening of the WebSocket doesn't go well. Ready State constant:"+ socket.readyState);
    }
    // when the socket is opened (reaction):
    socket.onopen = function () {
        const requestProto = protoFile.build("Request");
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
                returnedMessage = protoFile.build("Response").decode(e.data);

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
 * Contact a conode to ask for a collective signature of a file
 *
 * @param portNumber  port number of the conode to contact
 * @param file        file to sign as an ArrayBuffer
 * @returns {*}       Array containing signature of the file and the aggregate-key inside a Promise object
 */
function websocket_sign(portNumber, file) {
    const socket = new WebSocket("ws://localhost:" + portNumber + "/CoSi/SignatureRequest");
    const aggKey = new Uint8Array(32);
    socket.binaryType = "arraybuffer";
    if (socket.readyState != 0 && socket.readyState != 1) {
        console.log("The opening of the WebSocket doesn't go well. Ready State constant: "+ socket.readyState);
    }
    // when the socket is opened (reaction):
    socket.onopen = function onOpen() {
        const signMsgProto = protoFile.build("SignatureRequest");
        const rosterProto = protoFile.build("Roster");
        const siProto = protoFile.build("ServerIdentity");
        nacl_factory.instantiate(function (nacl) {
            // Create a list of ServerIdentities for the roster
            let agg = [];
            if (window.listNodes.length === 3) {
                const listServers = window.listNodes.map(function(node, index) {
                    const server = node.server;
                    const pub = new Uint8Array(server.public.toArrayBuffer()); // public key of a server
                    // multiply the x-axis of point with -1, because TweetNaCl.js doesn’t have unpack, only unpackneg
                    pub[31] ^= 128;
                    // the point is represented as a 2-dimensional array
                    const pubPos = [gf(), gf(), gf(), gf()]; // zero-point
                    unpackneg(pubPos, pub);
                    if (index === 0) {
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
            } else {
                // timeout of 50ms because all the status of each conodes are not completed
                setTimeout(onOpen, 50);
            }
        });
    };

    function loadReceivedMessage() {
        // usage of a Promise:
        return new Promise(function (resolve, reject) {
            socket.onmessage = function(e) {
                let returnedMessage;
                // returnedMessage array composed of the response of the conode and the aggregate key
                returnedMessage = [protoFile.build("SignatureResponse").decode(e.data), aggKey];
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
 * util function to control the generator function's iterator
 *
 * @param g generator function
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