const IRI_SERVICE = require('../util/iri.util.js');
const axios = require('axios');
const neighborUsernames = new Map();
const MAX_MILESTONES_BEHIND_BEFORE_UNSYNCED = 50;
// TODO move to a config or something, since duplicated
const BASE_URL = '/api';

let db;

class NeighborResource {

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
          function doCallAndPrepareCallForNext(activeNeighbors, currentIndex) {
            const activeNeighbor = activeNeighbors[currentIndex];

            axios(IRI_SERVICE.createIriRequest('getNodeInfo', activeNeighbor.address.split(':')[0]))
            .then(nodeInfoResponse => {
              let nodeInfo = nodeInfoResponse.data;
              const oldestEntry = rows.find(row => activeNeighbor.address === row.address);

              const resultNeighbor = {
                address: activeNeighbor.address,
                iriVersion: nodeInfo.appVersion,
                isSynced: nodeInfo.latestSolidSubtangleMilestoneIndex >= currentOwnNodeInfo.latestMilestoneIndex - MAX_MILESTONES_BEHIND_BEFORE_UNSYNCED,
                isActive: oldestEntry ? activeNeighbor.numberOfNewTransactions > oldestEntry.numberOfNewTransactions : null,
                protocol: activeNeighbor.connectionType,
                onlineTime: nodeInfo.time,
                isFriendlyNode: activeNeighbor.numberOfInvalidTransactions < activeNeighbor.numberOfAllTransactions / 200
              };

              const name = neighborUsernames.get(`${resultNeighbor.protocol}://${resultNeighbor.address}`);
              resultNeighbor.name = name ? name : null;

              resultNeighbors.push(resultNeighbor);

              if (++currentIndex < activeNeighbors.length) {
                doCallAndPrepareCallForNext(activeNeighbors, currentIndex);
              } else {
                res.json(resultNeighbors);
              }
            })
            .catch(error => {
              const oldestEntry = rows.find(row => activeNeighbor.address === row.address);

              const resultNeighbor = {
                address: activeNeighbor.address,
                iriVersion: null,
                isSynced: null,
                isActive: oldestEntry ? activeNeighbor.numberOfNewTransactions > oldestEntry.numberOfNewTransactions : null,
                protocol: activeNeighbor.connectionType,
                onlineTime: null,
                isFriendlyNode: activeNeighbor.numberOfInvalidTransactions < activeNeighbor.numberOfAllTransactions / 200
              };

              const name = neighborUsernames.get(`${resultNeighbor.protocol}://${resultNeighbor.address}`);
              resultNeighbor.name = name ? name : null;

              resultNeighbors.push(resultNeighbor);

              if (++currentIndex < activeNeighbors.length) {
                doCallAndPrepareCallForNext(activeNeighbors, currentIndex);
              } else {
                res.json(resultNeighbors);
              }
            });
          }

          doCallAndPrepareCallForNext(activeNeighbors, 0);
        });
      })
      .catch(error => {
        console.log('failed to get neighbors');
      });
    });

    app.post(`${BASE_URL}/neighbor`, (req, res) => {
      const name = req.body.name;
      const fullAddress = req.body.address;
      const writeToIriConfig = req.body.writeToIriConfig;

      const addNeighborRequest = IRI_SERVICE.createIriRequest('addNeighbors');
      addNeighborRequest.data.uris = [fullAddress];

      axios(addNeighborRequest)
      .then(response => {
        const removeNeighborEntriesWithAddress = db.prepare(`DELETE FROM neighbor where address=?`);
        removeNeighborEntriesWithAddress.run(fullAddress);

        this.addNeighborUserName(fullAddress, name);

        if (writeToIriConfig) IRI_SERVICE.writeNeighborToIriConfig(fullAddress);

        res.status(200).send();
      })
      .catch(error => {
        console.log(`Couldn't add neighbor`);
        res.status(500).send();
      });
    });

    app.delete(`${BASE_URL}/neighbor`, (req, res) => {
      const address = req.body.address;
      const removeNeighborRequest = IRI_SERVICE.createIriRequest('removeNeighbors');
      removeNeighborRequest.data.uris = [address];

      axios(removeNeighborRequest)
      .then(response => {
        const addressWithoutProtocolPrefix = address.substring(6);

        const removeNeighborEntriesWithAddress = db.prepare(`DELETE FROM neighbor where address=?`);
        removeNeighborEntriesWithAddress.run(addressWithoutProtocolPrefix);

        this.removeNeighborFromUserNameTable(address);

        res.status(200).send();
      })
      .catch(error => {
        console.log(`Couldn't remove neighbor`);
        res.status(500).send();
      });
    });

  }

}

const neighborResource = new NeighborResource();
module.exports = neighborResource;