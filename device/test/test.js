const assert = require('assert');
var ipc = require('node-ipc');

ipc.config.id = 'client';
ipc.config.maxRetries = 0;
ipc.config.rawBuffer = true;
ipc.config.silent = true;

function sendFrame(frames, done, callback) {
    ipc.connectTo(
        'server',
        function () {
            ipc.of.server.on(
                'connect',
                function () {
                    frames.forEach(frame => {
                        ipc.of.server.emit(frame)
                    });
                }
            );
            ipc.of.server.on(
                'error',
                function (err) {
                    done(err)
                }
            );
            ipc.of.server.on(
                'data',
                function (data) {
                    done();
                    callback(data)
                    ipc.disconnect("server");
                }
            );
        }
    );
}


describe('Device', function () {
    it('should accept connections successfully', function (done) {
        ipc.connectTo(
            'server',
            function () {
                ipc.of.server.on(
                    'connect',
                    function () {
                        ipc.disconnect("server");
                        done()
                    }
                );
                ipc.of.server.on(
                    'error',
                    function (err) {
                        done(err)
                    }
                );
            }
        );
    });

    it('should respond correctly to device manufacturer frame', function (done) {
        sendFrame(["m\n"], done, (data) => {
            assert.equal(data.toString(), "m National Instruments, Inc.\n")
        })
    });

    it('should respond correctly to device available sensors frame', function (done) {
        sendFrame(["s\n"], done, (data) => {
            assert.equal(data.toString(), "s temperature,pressure,weight\n")
        })
    });

    it('should respond correctly to temperature units frame', function (done) {
        sendFrame(["u temperature\n"], done, (data) => {
            assert.equal(data.toString(), "u C,F,K\n")
        })
    });

    it('should respond correctly to temperature value frame', function (done) {
        sendFrame(["v temperature:F\n"], done, (data) => {
            assert.ok(data.toString().startsWith("v temperature:"))
            assert.ok(data.toString().endsWith(":F\n"))
            const number = data.toString().slice(data.toString().indexOf(":"), data.toString().lastIndexOf(":"))
            assert.ok(typeof parseFloat(number) == "number");
        })
    });
    it('should respond correctly to valid frames sent on multiple smaller frames', function (done) {
        sendFrame(["v tem", "per", "atu", "re:F\nm\n"], done, (data) => {
            assert.ok(data.toString().startsWith("v temperature:"))
            assert.ok(data.toString().endsWith(":F\n"))
            const number = data.toString().slice(data.toString().indexOf(":"), data.toString().lastIndexOf(":"))
            assert.ok(typeof parseFloat(number) == "number");
        })
    });
});