'use strict';

const EventEmitter = require('events');
const ipc = require('node-ipc');


module.exports = class Client extends EventEmitter {
    constructor(clientId, serverId) {
        super();
        ipc.config.id = clientId;
        ipc.config.silent = true;
        ipc.config.retry = 1000;
        this.serverId = serverId;
        ipc.config.rawBuffer = true;
        this.buffer = ""
        this.isConnected = false;
    }

    connect() {
        const self = this;
        const serverId = this.serverId;
        this.disconnect();
        ipc.connectTo(
            serverId,
            function () {
                ipc.of[serverId].on(
                    'connect',
                    function () {
                        // console.log("Client: connected")
                        self.buffer = ""
                        self.isConnected = true
                        self.emit("connect")
                    }
                );
                ipc.of[serverId].on(
                    'disconnect',
                    function () {
                        // console.log("Client: disconnected")
                        self.buffer = ""
                        self.isConnected = false
                        self.emit("disconnect")
                    }
                );
                ipc.of[serverId].on(
                    'data',
                    (data) => {
                        // console.log("Client: Received data (hex): " + data.toString('hex'))
                        data = self.buffer + data.toString();
                        if (data.includes("\n")) {
                            let completeData = data.slice(0, data.lastIndexOf("\n"));
                            let inCompleteData = data.slice(data.lastIndexOf("\n") + 1);
                            self.buffer = inCompleteData;
                            let packets = completeData.split("\n")
                            for (let i = 0; i < packets.length; i++) {
                                let packet = packets[i];
                                if (packet.length > 0) {
                                    const command = packet[0]
                                    let dataArray = [];
                                    if (packet.length > 2 && packet[1] == " ") {
                                        dataArray = packet.slice(2).split(":");
                                    }
                                    self.emit("frame", {
                                        command: command,
                                        data: dataArray
                                    });
                                }
                            }
                        } else self.buffer = data;
                    }
                );
            }
        );
    }

    disconnect() {
        if (this.isConnected) ipc.disconnect(this.serverId);
    }
    send(command, data) {
        if (this.isConnected) {
            ipc.of[this.serverId].emit(command + (data ? " " + data.join(":") : "") + "\n");
            // console.log("Client: Sending data (hex) " + Buffer.from(command + (data ? " " + data.join(":") : "") + "\n").toString('hex'))
        }
    }
}