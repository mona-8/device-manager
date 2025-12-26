# USB & Serial Device Manager using Electron

An Electron desktop application that detects **USB and serial devices**, and **stores device information locally** using a JSON file.

## Features

- Detects **USB devices** and **serial devices**  
- Unified device table showing:
  - Port
  - Vendor ID (VID)
  - Product ID (PID)
  - Status 
  - Custom name
  - Notes
  - Last seen timestamp

## Project Setup

### Prerequisites

- Node.js

### Dependencies

- Electron
- Node.js
- serialport
- usb

### Install dependencies

`npm install`

### Run the application

`npm start`

## Data Storage

Device data is stored in `devices.json`

Path: `C:\Users\<USERNAME>\AppData\Roaming\Electron\devices.json`


