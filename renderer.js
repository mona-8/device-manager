async function loadDevices() {
  const devices = await window.api.getDevices();
  const table = document.getElementById('device-table');
  table.innerHTML = '';

  devices.forEach(d => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${d.port}</td>
      <td>${d.vid}</td>
      <td>${d.pid}</td>
      <td>${d.status}</td>
      <td><input value="${d.name}" /></td>
      <td><input value="${d.notes}" /></td>
      <td>${new Date(d.lastSeen).toLocaleString()}</td>
      <td><button>Save</button></td>
    `;

    const inputs = row.querySelectorAll('input');
    const button = row.querySelector('button');

    button.onclick = () => {
      window.api.saveDevice({
        id: d.id,
        port: d.port,
        vid: d.vid,
        pid: d.pid,
        name: inputs[0].value,
        notes: inputs[1].value
      });
    }

    table.appendChild(row);
  });
}

document.getElementById('refresh').onclick = loadDevices;
window.onload = loadDevices;
