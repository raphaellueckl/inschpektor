const si = require('systeminformation');

const NODE_STATE = require('../state/node.state');

const fetchSystemInfo = async () => {
    // si.currentLoad()
    // .then(data => console.log(`${data.currentload} / ${data.currentload_idle}`))
    // .catch(error => console.error(error));
    
    // si.processes()
    // .then(data => console.log(`${data.all}`)) // Number of all Processes
    // .catch(error => console.error(error));
    
    // si.disksIO()
    // .then(data => console.log(`rw_dsk: ${data.rIO_sec} / ${data.wIO_sec}`)) // read and write on disks per sec
    // .catch(error => console.error(error));
    
    // // si.fsStats()
    // // .then(data => console.log(`rw: ${data.rx_sec} / ${data.wx_sec}`)) // read and write on disks per sec
    // // .catch(error => console.error(error));
    
    // si.networkInterfaces()
    // .then(data => (`speedy: ${data[0].speed}}`)) // read and write on disks per sec
    // .catch(error => console.error(error));
    
    si.networkStats()
    .then(data => data.forEach(d => console.log(`speed: ${d.rx_sec / 1024 / 1024 * 8} / ${d.tx_sec / 1024 / 1024 * 8}`))) // transferred mb per second, receive / send
    .catch(error => console.error(error));

    console.log('\n###\n')
};

module.exports = fetchSystemInfo;
