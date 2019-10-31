'use strict';

module.exports = class Device {
    constructor(manufacturer, sensors, server) {
        this.manufacturer = manufacturer;
        this.sensors = sensors ? sensors : {};
        this.server = server;
        this.server.on("frame", this.router.bind(this))
    }
    start() {
        Object.values(this.sensors).forEach(sensor => {
            sensor.start();
        });
        if (this.server) this.server.start();
    }

    stop() {
        Object.values(this.sensors).forEach(sensor => {
            sensor.stop();
        });
        if (this.server) this.server.start();
    }

    router(frame) {
        console.log("Device: Frame received: command => " + frame.command + ", data => " + frame.data)
        switch (frame.command) {
            case 'm': // m
                if (frame.data.length == 0) {
                    console.log("Device: Replying with manufacturer name: " + "m " + this.manufacturer)
                    this.server.send('m', [this.manufacturer]) // i.e: m National Instruments, Inc.
                }
                break;
            case 's': // s
                if (frame.data.length == 0) {
                    console.log("Device: Replying with available sensors: " + "s " + Object.keys(this.sensors).join(":"))
                    this.server.send('s', Object.keys(this.sensors)) // i.e: s temperature,pressure,weight
                }
                break;
            case 'v': // v sensorName:unit
                if (frame.data && frame.data.length > 0) {
                    const sensorName = frame.data[0];
                    const unit = frame.data[1] ? frame.data[1] : this.sensors[sensorName].getUnits()[0];
                    if (this.sensors[sensorName] && this.sensors[sensorName].getUnits().includes(unit)) {
                        console.log("Device: Replying with value for " + sensorName + " sensor: " + 'v ' + sensorName + ":" + this.sensors[sensorName].getValue(unit) + ":" + unit)
                        this.server.send('v', [sensorName, this.sensors[sensorName].getValue(unit), unit]) // i.e: v temperature:222.39136239997842:F
                    }
                } else this.server.send('e', "Incorrect value frame")
                break;
            case 'u': // u sensorName
                if (frame.data && frame.data.length == 1) {
                    const sensorName = frame.data[0];
                    if (this.sensors[sensorName]) {
                        console.log("Device: Replying with available units for " + sensorName + " sensor: " + 'u ' + this.sensors[sensorName].getUnits().join(":"))
                        this.server.send('u', [sensorName, ...this.sensors[sensorName].getUnits()]) // i.e: u C,F,K
                    }
                } else this.server.send('e', "Incorrect units frame")
                break;
            default:
                this.server.send('e', "Incorrect frame or command")
                break;
        }
    }

}