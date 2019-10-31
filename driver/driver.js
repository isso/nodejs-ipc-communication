'use strict';

const EventEmitter = require('events');

module.exports = class Driver extends EventEmitter {
    constructor(client) {
        super();
        this.client = client;
        this.client.on("frame", this.router.bind(this))
        this.client.on("connect", () => this.emit("connect"))
        this.client.on("disconnect", () => this.emit("disconnect"))
    }
    connect() {
        if (this.client) this.client.connect();
    }

    disconnect() {
        if (this.client) this.client.disconnect();
    }

    queryManufacturer() {
        this.client.send('m');
    }

    querySensors() {
        this.client.send('s');
    }

    querySensorUnits(sensor) {
        this.client.send('u', [sensor]);
    }

    querySensorValue(sensor, unit) {
        this.client.send('v', [sensor, unit]);
    }

    router(frame) {
        // console.log("Driver: Frame received: command => " + frame.command + ", data => " + frame.data)
        switch (frame.command) {
            case 'm':
                if (frame.data.length == 1) {
                    this.emit("manufacturer", frame.data[0])
                }
                break;
            case 's':
                if (frame.data.length > 0) {
                    this.emit("sensors", frame.data)
                }
                break;
            case 'v':
                if (frame.data && frame.data.length == 3) {
                    this.emit("value", {
                        sensorName: frame.data[0],
                        value: frame.data[1],
                        unit: frame.data[2]
                    })
                }
                break;
            case 'u':
                if (frame.data && frame.data.length > 2) {
                    this.emit("units", {
                        sensorName: frame.data[0],
                        units: frame.data.slice(1)
                    })
                }
                break;
            default:
                this.server.send('e', "Incorrect frame or command")
                break;
        }
    }
}