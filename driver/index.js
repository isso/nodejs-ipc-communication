'use strict';

const Client = require('./client');
const Driver = require('./driver');

const client = new Client("client", "server");
const driver = new Driver(client);

driver.on("connect", () => {
    driver.queryManufacturer();
    driver.querySensors();
})

driver.on("manufacturer", (manufacturer) => {
    console.log("Manufacturer name: " + manufacturer)
})

driver.on("sensors", (sensors) => {
    console.log("Available sensors: " + sensors.join(", "))
    sensors.forEach(sensor => {
        driver.querySensorUnits(sensor);
    });
})
driver.on("value", (value) => {
    console.log("Sensor " + value.sensorName + ": " + Math.round(value.value) + " " + value.unit)

})
driver.on("units", (units) => {
    console.log("Available units for " + units.sensorName + ": " + units.units.join(", "))
    setInterval(() => {
        units.units.forEach(unit => {
            driver.querySensorValue(units.sensorName, unit);
        });
    }, 2000)
})

driver.connect();