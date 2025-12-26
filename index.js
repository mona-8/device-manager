const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const { SerialPort } = require('serialport');
const usb = require('usb');

const DATA_FILE = path.join(app.getPath('userData'), 'devices.json');

function createWindow() {
  const win = new BrowserWindow({
    width: 950,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('index.html');
}

// ---------- Storage ----------

function loadSavedDevices() {
  if (!fs.existsSync(DATA_FILE)) return {};
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveAllDevices(devices) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(devices, null, 2));
}

// ---------- Device Detection ----------

async function getAllDevices() {
  const saved = loadSavedDevices();
  const now = new Date().toISOString();
  const devices = {};

  // SERIAL DEVICES
  const ports = await SerialPort.list();
  ports.forEach(p => {
    const id = `serial-${p.path}`;

    devices[id] = {
      id,
      port: p.path,
      vid: p.vendorId || '',
      pid: p.productId || '',
      name: saved[id]?.name || '',
      notes: saved[id]?.notes || '',
      status: 'Connected',
      lastSeen: now
    };
  });

  // USB DEVICES
  usb.getDeviceList().forEach(d => {
    const vid = d.deviceDescriptor.idVendor.toString(16);
    const pid = d.deviceDescriptor.idProduct.toString(16);
    const id = `usb-${vid}-${pid}-${d.deviceAddress}`;

    devices[id] = {
      id,
      port: 'USB',
      vid,
      pid,
      name: saved[id]?.name || '',
      notes: saved[id]?.notes || '',
      status: 'Connected',
      lastSeen: now
    };
  });

  // Merge + persist lastSeen updates
  const merged = { ...saved, ...devices };
  saveAllDevices(merged);

  return Object.values(merged);
}

// ---------- IPC ----------

ipcMain.handle('get-devices', async () => {
  return await getAllDevices();
});

ipcMain.handle('save-device', (_, device) => {
  const saved = loadSavedDevices();

  // Explicitly write only the fields we care about
  saved[device.id] = {
    id: device.id,
    port: device.port,
    vid: device.vid,
    pid: device.pid,
    name: device.name || '',
    notes: device.notes || '',
    lastSeen: new Date().toISOString()
  };

  saveAllDevices(saved);

  return true;
});


app.whenReady().then(createWindow);
