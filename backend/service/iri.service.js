require('console-stamp')(console, {
  pattern: 'dd/mm/yyyy HH:MM:ss.l'
});
const fs = require('fs');

const NODE_STATE = require('../state/node.state');

class IriService {
  createIriRequest(command) {
    return {
      url: `${NODE_STATE.protocol}://${NODE_STATE.iriIp}:${NODE_STATE.iriPort}`,
      data: { command },
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-IOTA-API-Version': '1'
      },
      timeout: 10000
    };
  }

  createIriRequestForNeighborNode(protocol, command, neighbor, port) {
    return {
      url: `${protocol}://${neighbor.address.split(':')[0]}:${
        port ? port : '14265'
      }`,
      data: { command },
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-IOTA-API-Version': '1'
      },
      timeout: 6000
    };
  }

  writeNeighborToIriConfig(fullAddress) {
    if (fs.existsSync(NODE_STATE.iriFileLocation)) {
      fs.readFile(
        NODE_STATE.iriFileLocation,
        'utf-8',
        (err, iriConfigContent) => {
          if (err) throw err;
          let neighborsKeywordMin = 'NEIGHBORS=';
          let neighborsKeywordMax = 'NEIGHBORS = ';
          let iriConfigContentLowerCase = iriConfigContent.toLowerCase();
          const allLines = iriConfigContentLowerCase.split(/\r\n|\n/);
          let indexOfNeighborsLine = -1;
          let currentlyPersistedNeighborsLine = '';
          allLines.forEach((line, index) => {
            if (line.toUpperCase().startsWith(neighborsKeywordMax)) {
              currentlyPersistedNeighborsLine = line.substring(
                neighborsKeywordMax.length
              );
              indexOfNeighborsLine = index;
            } else if (line.toUpperCase().startsWith(neighborsKeywordMin)) {
              currentlyPersistedNeighborsLine = line.substring(
                neighborsKeywordMin.length
              );
              indexOfNeighborsLine = index;
            }
          });

          if (indexOfNeighborsLine === -1) {
            const newNeighborLine = `\n${neighborsKeywordMax}${fullAddress}\n`;
            iriConfigContent += newNeighborLine;
            fs.writeFile(NODE_STATE.iriFileLocation, iriConfigContent, err => {
              if (err)
                console.error(
                  'Failed to add neighbor in iri. Permission error or wrong path.',
                  err.message
                );
            });
          } else {
            if (!currentlyPersistedNeighborsLine.includes(fullAddress)) {
              currentlyPersistedNeighborsLine += ` ${fullAddress}`;
              allLines[
                indexOfNeighborsLine
              ] = `${neighborsKeywordMax}${currentlyPersistedNeighborsLine}`;
              const newIriConfigContent = allLines.join('\n');
              fs.writeFile(
                NODE_STATE.iriFileLocation,
                newIriConfigContent,
                err => {
                  if (err)
                    console.error(
                      'Failed to add neighbor in iri. Permission error or wrong path.',
                      err.message
                    );
                }
              );
            }
          }
        }
      );
    } else {
      console.error('Iri config file not found.');
    }
  }

  removeNeighborFromIriConfig(domain) {
    if (fs.existsSync(NODE_STATE.iriFileLocation)) {
      fs.readFile(NODE_STATE.iriFileLocation, 'utf-8', (err, data) => {
        if (err) throw err;
        if (data.includes(domain)) {
          let iriConfigWithoutNeighbor = data.replace(`${domain}`, '');
          while (iriConfigWithoutNeighbor.indexOf('  ') !== -1) {
            iriConfigWithoutNeighbor = iriConfigWithoutNeighbor.replace(
              '  ',
              ' '
            );
          }
          while (iriConfigWithoutNeighbor.indexOf(' \n') !== -1) {
            iriConfigWithoutNeighbor = iriConfigWithoutNeighbor.replace(
              ' \n',
              '\n'
            );
          }

          fs.writeFile(
            NODE_STATE.iriFileLocation,
            iriConfigWithoutNeighbor,
            err => {
              if (err)
                console.error(
                  'Failed to remove neighbor from iri. Permission error or wrong path.',
                  err.message
                );
            }
          );
        }
      });
    } else {
      console.log(
        'Iri config file not set. Cannot remove neighbor from config file.'
      );
    }
  }

  async readPersistedNeighbors() {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(NODE_STATE.iriFileLocation)) {
        fs.readFile(NODE_STATE.iriFileLocation, 'utf-8', (err, data) => {
          const searchTerm = 'NEIGHBORS = ';
          const startIndex = data.indexOf(searchTerm) + searchTerm.length;
          const fromStartOfStaticNeighbors = data.substring(startIndex);
          const allNeighbors = fromStartOfStaticNeighbors
            .split('\n')[0]
            .split(' ');
          resolve(allNeighbors);
        });
      } else {
        reject();
      }
    });
  }
}

const iriService = new IriService();
module.exports = iriService;
