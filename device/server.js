'use strict';

const EventEmitter = require('events');
const ipc = require('node-ipc');


module.exports = class Server extends EventEmitter {
    constructor(clientId) {
        super();
        ipc.config.id = clientId;
        ipc.config.silent = true;
        ipc.config.retry = 1500;
        ipc.config.maxConnections = 1;
        this.currentSocket = null;
        ipc.config.rawBuffer = true;
        const self = this;
        this.buffer = ""
        ipc.serve(() => {
            ipc.server.on('data', (data) => {
                console.log("Server: Received data (hex): " + data.toString('hex'))
                data = self.buffer + data.toString();
                if (data.includes("\n")) {
                    const completeData = data.slice(0, data.lastIndexOf("\n"));
                    const inCompleteData = data.slice(data.lastIndexOf("\n") + 1);
                    self.buffer = inCompleteData;
                    const packets = completeData.split("\n")
                    for (let i = 0; i < packets.length; i++) {
                        const packet = packets[i];
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
            });
            ipc.server.on('connect',
                (socket) => {
                    console.log("Server: Client connected")
                    self.currentSocket = socket;
                    self.buffer = ""
                })
            ipc.server.on('socket.disconnected',
                () => {
                    console.log("Server: Client disconnected")
                    self.currentSocket = null;
                    self.buffer = ""
                })
        });
    }

    start() {
        ipc.server.start();
    }
    send(command, data) {
        if (this.currentSocket != null) {
            ipc.server.emit(this.currentSocket, command + (data ? " " + data.join(":") : "") + "\n");
            console.log("Server: Sending data (hex) " + Buffer.from(command + (data ? " " + data.join(":") : "") + "\n").toString('hex'))
        }
    }
}