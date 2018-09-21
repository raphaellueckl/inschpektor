const fs = require('fs');

class IriUtil {

  constructor() {
    this.iriIp = null;
    this.iriPort = null;
    this.iriFileLocation = null;
  }

  createIriRequest(command, ip = this.iriIp) {
    return {
      url: `http://${ip}:${this.iriPort}`,
      data: {command},
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-IOTA-API-Version': '1'
      },
      timeout: 5000
    };
  }

  writeNeighborToIriConfig(fullAddress) {
    fs.readFile(this.iriFileLocation, 'utf-8', (err, data) => {
      let neighborsKeyword = 'NEIGHBORS = ';
      if (data.includes(neighborsKeyword)) {
        const insertLocation = data.indexOf(neighborsKeyword) + neighborsKeyword.length;
        const start = data.substring(0, insertLocation);
        const end = data.substring(insertLocation);
        const middle = `${fullAddress} `;
        const iriConfigWithAddedNeighbor = start + middle + end;
        fs.writeFile(this.iriFileLocation, iriConfigWithAddedNeighbor, (err) => {
          if (err) throw err;
        });
      }
    });
  }

}

const iriUtil = new IriUtil();
module.exports = iriUtil;