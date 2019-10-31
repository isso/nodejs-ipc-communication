# Sensor Device Emulator and Driver

The project consists of 2 NodeJS applications, the device emulator is in `./device` and the driver is in `./driver`. They communicates with each other over OS IPC sockets.

## Device

The emulated device has 3 sensors: temperature, pressure and weight. Each sensor has multiple units and each reading is a random value that changes according to a specified frequency. The device can be queried for its manufacturer name, available sensors, available units for a specific sensor, and the value of the sensor.

Sample console output

```
Server: Client connected
Server: Received data (hex): 6d0a
Device: Frame received: command => m, data =>
Device: Replying with manufacturer name: m National Instruments, Inc.
Server: Sending data (hex) 6d204e6174696f6e616c20496e737472756d656e74732c20496e632e0a
Server: Received data (hex): 730a
Device: Frame received: command => s, data =>
Device: Replying with available sensors: s temperature:pressure:weight
Server: Sending data (hex) 732074656d70657261747572653a70726573737572653a7765696768740a
Server: Received data (hex): 752074656d70657261747572650a
Device: Frame received: command => u, data => temperature
Device: Replying with available units for temperature sensor: u C:F:K
Server: Sending data (hex) 752074656d70657261747572653a433a463a4b0a
Server: Received data (hex): 752070726573737572650a75207765696768740a
Device: Frame received: command => u, data => pressure
Device: Replying with available units for pressure sensor: u Atm:P
Server: Sending data (hex) 752070726573737572653a41746d3a500a
Device: Frame received: command => u, data => weight
Device: Replying with available units for weight sensor: u g:Kg
Server: Sending data (hex) 75207765696768743a673a4b670a
Server: Received data (hex): 762074656d70657261747572653a430a
Device: Frame received: command => v, data => temperature,C
Device: Replying with value for temperature sensor: v temperature:64.15872669785506:C
Server: Sending data (hex) 762074656d70657261747572653a36342e31353837323636393738353530363a430a
Server: Received data (hex): 762074656d70657261747572653a460a762074656d70657261747572653a4b0a762070726573737572653a41746d0a762070726573737572653a500a76207765696768743a670a76207765696768743a4b670a
Device: Frame received: command => v, data => temperature,F
Device: Replying with value for temperature sensor: v temperature:147.48570805613912:F
Server: Sending data (hex) 762074656d70657261747572653a3134372e34383537303830353631333931323a460a
Device: Frame received: command => v, data => temperature,K
Device: Replying with value for temperature sensor: v temperature:337.30872669785504:K
Server: Sending data (hex) 762074656d70657261747572653a3333372e33303837323636393738353530343a4b0a
Device: Frame received: command => v, data => pressure,Atm
Device: Replying with value for pressure sensor: v pressure:9.843465362617895:Atm
Server: Sending data (hex) 762070726573737572653a392e3834333436353336323631373839353a41746d0a
Device: Frame received: command => v, data => pressure,P
Device: Replying with value for pressure sensor: v pressure:997389.1278672582:P
Server: Sending data (hex) 762070726573737572653a3939373338392e313237383637323538323a500a
Device: Frame received: command => v, data => weight,g
Device: Replying with value for weight sensor: v weight:89.43220762051693:g
Server: Sending data (hex) 76207765696768743a38392e34333232303736323035313639333a670a
Device: Frame received: command => v, data => weight,Kg
Device: Replying with value for weight sensor: v weight:0.08943220762051693:Kg
Server: Sending data (hex) 76207765696768743a302e30383934333232303736323035313639333a4b670a
Server: Client disconnected
```

## Driver

The driver communicates with the device over OS IPC sockets and queries all of the available data every 2 seconds and show it on the console.

Sample console output

```
Manufacturer name: National Instruments, Inc.
Available sensors: temperature, pressure, weight
Available units for temperature: C, F, K
Available units for pressure: Atm, P
Available units for weight: g, Kg
Sensor temperature: 64 C
Sensor temperature: 147 F
Sensor temperature: 337 K
Sensor pressure: 10 Atm
Sensor pressure: 997389 P
Sensor weight: 89 g
Sensor weight: 0 Kg
```

# Protocol

The protocol used between the device and the driver is a very simple ASCII protocol with a total of 4 message types:

- Manufacturer query

    Request: `m\n`

    Response: `m National Instruments, Inc.\n`

- Sensors query

    Request: `s\n`

    Response: `s temperature:pressure:weight\n`

- Sensors units query

    Request: `u temperature\n`

    Response: `u temperature:C:F:K\n`

- Sensors value query

    Request: `v temperature:C\n`

    Response: `v temperature:23.3432:C\n`

Each message has to be terminated with a new line character.

# Building And Running

`npm install` and `node index.js` in each of the 2 directories.

# Tests

The `device` project is covered with some tests that can be run using `npm test` inside `./device` directory after running the application.

