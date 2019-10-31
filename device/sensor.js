'use strict';

module.exports = class Sensor {
    constructor(units, simulationParameters) {
        this.units = units ? units : {};
        this.value = 0.0;
        this.simulationWorker = null;
        this.minValue = simulationParameters.minValue ? simulationParameters.minValue : 0;
        this.maxValue = simulationParameters.maxValue ? simulationParameters.maxValue : 1;
        this.frequency = simulationParameters.frequency ? simulationParameters.frequency : 100;
        this.defaultUnit = simulationParameters.defaultUnit ? simulationParameters.defaultUnit : '';
    }

    start() {
        let self = this;
        this.simulationWorker = setInterval(() => {
            self.value = Math.random() * (self.maxValue - self.minValue) + self.minValue;
        }, this.frequency);
    }

    stop() {
        if (this.simulationWorker != null)
            clearInterval(this.simulationWorker)
    }

    getValue(unit) {
        if (unit != null && this.units[unit]) {
            return this.units[unit](this.value);
        }
        return this.value;
    }

    getUnits() {
        return [this.defaultUnit, ...Object.keys(this.units)]
    }
}