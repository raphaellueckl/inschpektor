const si = require('systeminformation');

const NODE_STATE = require('../state/node.state');

const fetchSystemInfo = async () => {
  const { currentload } = await si.currentLoad();
  const { running } = await si.processes();
  const network = await si.networkStats();
  const { tx_sec } = await si.fsStats(); // Combined disk IO in Bytes per second
  const combinedData = {
    cpuLoad: currentload, // CPU load in %
    runningProcesses: running, // Number of running processes
    diskIO: Number((tx_sec / 1024 / 1024).toFixed(2)), // Combined disk IO in MB/s per second
    networkIO: {
      upload: Number((network[0].tx_sec / 1024 / 1024).toFixed(1)), // Network upload in mbps (byte)
      download: Number((network[0].rx_sec / 1024 / 1024).toFixed(1)) // Network download in mbps (byte)
    }
  };
  NODE_STATE.systemInfo.unshift(combinedData);
  NODE_STATE.systemInfo = [combinedData, ...NODE_STATE.systemInfo.slice(0, 99)];
};

module.exports = fetchSystemInfo;
