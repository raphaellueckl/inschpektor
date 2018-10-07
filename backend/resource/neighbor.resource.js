const IRI_SERVICE = require('../util/iri.util');
const USER_RESOURCE = require('./user.resource');
const AUTH_UTIL = require('../util/auth.util');
const axios = require('axios');
const neighborUsernames = new Map();
const MAX_MILESTONES_BEHIND_BEFORE_UNSYNCED = 50;
// TODO move to a config or something, since redundant
const BASE_URL = '/api';

let db;

class NeighborResource {

  intitializeNeighborUsernname(fullAddress, name) {
    neighborUsernames.set(fullAddress, name);
  }

  removeNeighborFromUserNameTable(address) {
    neighborUsernames.delete(address);

    const removeNeighborEntriesWithAddress = db.prepare('DELETE FROM neighbor_data where address=?');
    removeNeighborEntriesWithAddress.run(address);
  }

  addNeighborUserName(fullAddress, name) {
    neighborUsernames.set(fullAddress, name);

    const stmt = db.prepare('REPLACE INTO neighbor_data (address, name) VALUES (?, ?)');
    stmt.run(fullAddress, name);
  }

  init(app, database) {
    db = database;
    app.post('/api/neighbor/nick', (req, res) => {
      if (!AUTH_UTIL.isUserAuthenticated(USER_RESOURCE.loginToken, req)) res.status(401).send();
      const name = req.body.name;
      const fullAddress = req.body.fullAddress;

      this.addNeighborUserName(fullAddress, name);

      res.json({});
    });

    app.get('/api/neighbors', (req, res) => {
      const resultNeighbors = [];

      axios(IRI_SERVICE.createIriRequest('getNeighbors'))
      .then(iriNeighborsResponse => {
        const activeNeighbors = iriNeighborsResponse.data.neighbors;

        db.all('SELECT * FROM neighbor ORDER BY timestamp ASC', [], (err, rows) => {
          const allRequests = [];
          for (let neighbor of activeNeighbors) {
            allRequests.push(new Promise((resolve) => {
                axios(IRI_SERVICE.createIriRequest('getNodeInfo', neighbor.address.split(':')[0]))
                .then(nodeInfoResponse => {
                  let nodeInfo = nodeInfoResponse.data;
                  const oldestEntry = rows.find(row => neighbor.address === row.address);

                  const resultNeighbor = this.createResultNeighbor(neighbor, oldestEntry, nodeInfo);

                  resultNeighbors.push(resultNeighbor);
                  resolve(resultNeighbor);
                })
                .catch(error => {
                  const oldestEntry = rows.find(row => neighbor.address === row.address);

                  const resultNeighbor = this.createResultNeighbor(neighbor, oldestEntry);

                  const name = neighborUsernames.get(`${resultNeighbor.protocol}://${resultNeighbor.address}`);
                  resultNeighbor.name = name ? name : null;

                  resultNeighbors.push(resultNeighbor);
                  resolve(resultNeighbor);
                });
              })
            );
          }

          Promise.all(allRequests).then(evaluatedNeighbors => {
            res.json(evaluatedNeighbors);
          });
        });
      })
      .catch(error => {
        console.log('failed to get neighbors', error.message);
      });
    });

    app.post(`${BASE_URL}/neighbor`, (req, res) => {
      if (!AUTH_UTIL.isUserAuthenticated(USER_RESOURCE.loginToken, req)) res.status(401).send();
      const name = req.body.name;
      const fullAddress = req.body.address;
      const writeToIriConfig = req.body.writeToIriConfig;

      const addNeighborRequest = IRI_SERVICE.createIriRequest('addNeighbors');
      addNeighborRequest.data.uris = [fullAddress];

      axios(addNeighborRequest)
      .then(response => {
        // Remove old entries to not confuse outdated data with new one, if neighbor was already added in the past.
        const removeNeighborEntriesWithAddress = db.prepare(`DELETE FROM neighbor where address=?`);
        removeNeighborEntriesWithAddress.run(fullAddress);

        this.addNeighborUserName(fullAddress, name);

        if (writeToIriConfig) IRI_SERVICE.writeNeighborToIriConfig(fullAddress);

        res.status(200).send();
      })
      .catch(error => {
        console.log(`Couldn't add neighbor`, error.message);
        res.status(500).send();
      });
    });

    app.delete(`${BASE_URL}/neighbor`, (req, res) => {
      if (!AUTH_UTIL.isUserAuthenticated(USER_RESOURCE.loginToken, req)) res.status(401).send();
      const fullAddress = req.body.address;
      const removeNeighborRequest = IRI_SERVICE.createIriRequest('removeNeighbors');
      removeNeighborRequest.data.uris = [fullAddress];

      axios(removeNeighborRequest)
      .then(response => {
        const addressWithoutProtocolPrefix = fullAddress.substring(6);

        const removeNeighborEntriesWithAddress = db.prepare(`DELETE FROM neighbor where address=?`);
        removeNeighborEntriesWithAddress.run(addressWithoutProtocolPrefix);

        this.removeNeighborFromUserNameTable(fullAddress);

        IRI_SERVICE.removeNeighborToIriConfig(fullAddress);

        res.status(200).send();
      })
      .catch(error => {
        console.log(`Couldn't remove neighbor`, error.message);
        res.status(500).send();
      });
    });

  }

  createResultNeighbor(neighbor, oldestEntry, nodeInfo) {
    const resultNeighbor = {
      premium: true,  // If neighbor allows remote node-info query
      address: neighbor.address,
      iriVersion: nodeInfo ? nodeInfo.appVersion: null,
      isSynced: nodeInfo ? nodeInfo.latestSolidSubtangleMilestoneIndex >= currentOwnNodeInfo.latestMilestoneIndex - MAX_MILESTONES_BEHIND_BEFORE_UNSYNCED : null,
      isActive: oldestEntry ? neighbor.numberOfNewTransactions > oldestEntry.numberOfNewTransactions : null,
      protocol: neighbor.connectionType,
      onlineTime: nodeInfo ? nodeInfo.time : null,
      isFriendlyNode: neighbor.numberOfInvalidTransactions < neighbor.numberOfAllTransactions / 200
    };

    const name = neighborUsernames.get(`${resultNeighbor.protocol}://${resultNeighbor.address}`);
    resultNeighbor.name = name ? name : null;

    return resultNeighbor;
  }
}

const neighborResource = new NeighborResource();
module.exports = neighborResource;