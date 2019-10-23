const si = require('systeminformation');

const NODE_STATE = require('../state/node.state');

const fetchSystemInfo = async () => {
  const { currentload } = await si.currentLoad();
  const { all } = await si.processes();
  const { tIO_sec } = await si.disksIO();
  const { rx_sec, tx_sec } = await si.networkInterfaces();

  const combinedData = {
    cpuLoad: currentload,
    allProcesses: all,
    diskIO: tIO_sec,
    networkIO: {
      upload: (rx_sec / 1024 / 1024).toFixed(2), // Mbit/s
      download: (tx_sec / 1024 / 1024).toFixed(2) // Mbit/s
    }
  };
  NODE_STATE.systemInfo.unshift(combinedData);
  NODE_STATE.systemInfo = [combinedData, ...NODE_STATE.systemInfo.slice(0, 99)];
};

module.exports = fetchSystemInfo;
