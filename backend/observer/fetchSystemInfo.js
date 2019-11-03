const si = require('systeminformation');

const NODE_STATE = require('../state/node.state');

const fetchSystemInfo = async () => {
  const { currentload } = await si.currentLoad();
  const { running } = await si.processes();
  const { tIO_sec } = await si.disksIO();
  const network = await si.networkStats();
  const receiving = Number((network[0].rx_sec / 1024 / 1024).toFixed(1));
  const sending = Number((network[0].tx_sec / 1024 / 1024).toFixed(1));
  const combinedData = {
    cpuLoad: currentload,
    runningProcesses: running,
    diskIO: tIO_sec,
    networkIO: {
      upload: sending,
      download: receiving
    }
  };
  NODE_STATE.systemInfo.unshift(combinedData);
  NODE_STATE.systemInfo = [combinedData, ...NODE_STATE.systemInfo.slice(0, 99)];
};

module.exports = fetchSystemInfo;
