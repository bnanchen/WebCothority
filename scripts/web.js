/**
 * File with useful methods concerning Protobuf.
 */
function websocket(portNumber) {
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