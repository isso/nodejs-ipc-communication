'use strict';

const Server = require('./server');
const Device = require('./device');
const SimulatedSensor = require('./sensor');

const DEVICE_ID = "server";
const DEVICE_MANUFACTURER = "National Instruments, Inc.";

const server = new Server(DEVICE_ID);

const temperatureUnits = {
    "F": (value) => (value * 9 / 5) + 32,
    "K": (value) => value + 273.15
}

const temperatureSimulationParameters = {
    minValue: 10,
    maxValue: 150,
    frequency: 100,
    defaultUnit: "C"
}

const pressureUnits = {
    "P": (value) => (value * 101325)

}

const pressureParameters = {
    minValue: 1,
    maxValue: 10,
    frequency: 1000,
    defaultUnit: "Atm"
}

const weightUnits = {
    "Kg": (value) => (value / 1000)

}

const weightParameters = {
    minValue: 1,
    maxValue: 10000,
    frequency: 500,
    defaultUnit: "g"
}

const temperature = new SimulatedSensor(temperatureUnits, temperatureSimulationParameters);
const pressure = new SimulatedSensor(pressureUnits, pressureParameters);
const weight = new SimulatedSensor(weightUnits, weightParameters);

const sensorsMap = {
    "temperature": temperature,
    "pressure": pressure,
    "weight": weight
};

const device = new Device(DEVICE_MANUFACTURER, sensorsMap, server);

device.start();