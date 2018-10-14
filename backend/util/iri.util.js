const fs = require('fs');

class IriUtil {

  constructor() {
    this.protocol = null;
    this.iriIp = null;
    this.iriPort = null;
    this.iriFileLocation = null;
  }

  createIriRequest(command, ip = this.iriIp) {
    return {
      url: `${this.protocol}://${ip}:${this.iriPort}`,
      data: {command},
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-IOTA-API-Version': '1'
      },
      timeout: 1000
    };
  }

  // Only works if at least one neighbor is in the iri file
  writeNeighborToIriConfig(fullAddress) {
    fs.readFile(this.iriFileLocation, 'utf-8', (err, data) => {
      let neighborsKeyword = 'NEIGHBORS = ';
      if (data.includes(neighborsKeyword)) {
        const insertLocation = data.indexOf(neighborsKeyword) + neighborsKeyword.length;
        const start = data.substring(0, insertLocation);
        const end = data.substring(insertLocation);
        const middle = `${fullAddress} `;
        const withAddedNeighbor = start + middle + end;
        fs.writeFile(this.iriFileLocation, withAddedNeighbor, (err) => {
          if (err) console.error('Failed to add neighbor in iri. Permission error or wrong path.', err.message);
        });
      }
    });
  }

  // Only works if at least one neighbor is remaining
  removeNeighborToIriConfig(fullAddress) {
    if (fs.existsSync(this.iriFileLocation)) {
      fs.readFile(this.iriFileLocation, 'utf-8', (err, data) => {
        if (data.includes(fullAddress)) {
          const withRemovedNeighbor = data.replace(`${fullAddress} `, '');
          fs.writeFile(this.iriFileLocation, withRemovedNeighbor, (err) => {
            if (err) console.error('Failed to remove neighbor from iri. Permission error or wrong path.', err.message)
          });
        }
      });
    }
  }

  readPersistedNeighbors() {
    if (fs.existsSync(this.iriFileLocation)) {
      fs.readFile(this.iriFileLocation, 'utf-8', (err, data) => {
        const searchTerm = 'NEIGHBORS = ';
        const startIndex = data.indexOf(searchTerm) + searchTerm.length;
        const fromStartOfStaticNeighbors = data.substring(startIndex);
        const allNeighbors = fromStartOfStaticNeighbors.split('\n')[0].split(' ');
        return allNeighbors;
      });
    } else {
      return [];
    }
  }

}

const iriUtil = new IriUtil();
module.exports = iriUtil;