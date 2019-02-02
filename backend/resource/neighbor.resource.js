require('../../node_modules/console-stamp')(console, {pattern: 'dd/mm/yyyy HH:MM:ss.l'});
const IRI_SERVICE = require('../util/iri.util');
const USER_RESOURCE = require('./user.resource');
const AUTH_UTIL = require('../util/auth.util');
const NODE_STATE = require('../state/node.state');
const axios = require('axios');
const neighborAdditionalData = new Map();
const MAX_MILESTONES_BEHIND_BEFORE_UNSYNCED = 50;
// TODO move to a config or something, since redundant
const BASE_URL = '/api';

let db;

class NeighborResource {

  init(app, database) {
    db = database;

    app.post(`${BASE_URL}/neighbor/name`, (req, res) => {
      if (!AUTH_UTIL.isUserAuthenticated(USER_RESOURCE.loginToken, req)) {
        res.status(401).send();
        return;
      }
      const name = req.body.name;
      const fullAddress = req.body.fullAddress;

      this.setNeighborName(fullAddress, name);

      res.status(200).send();
    });

    app.post(`${BASE_URL}/neighbor/port`, (req, res) => {
      if (!AUTH_UTIL.isUserAuthenticated(USER_RESOURCE.loginToken, req)) {
        res.status(401).send();
        return;
      }
      const port = req.body.port;
      const fullAddress = req.body.fullAddress;

      this.setNeighborPort(fullAddress, port);

      res.status(200).send();
    });

    app.post(`${BASE_URL}/neighbor/additional-data`, (req, res) => {
      if (!AUTH_UTIL.isUserAuthenticated(USER_RESOURCE.loginToken, req)) {
        res.status(401).send();
        return;
      }
      const neighbors = req.body;
      neighbors.forEach(n => this.setNeighborAdditionalData(`${n.protocol}://${n.address}`, n.name, n.port));

      res.status(200).send();
    });

    app.get(`${BASE_URL}/neighbors`, (req, res) => {
      const resultNeighbors = [];

      axios(IRI_SERVICE.createIriRequest('getNeighbors'))
      .then(iriNeighborsResponse => {
        const activeNeighbors = iriNeighborsResponse.data.neighbors;

        db.all('SELECT * FROM neighbor ORDER BY timestamp ASC', [], (err, rows) => {
          const allRequests = [];

          for (let neighbor of activeNeighbors) {

            const additionalDataOfNeighbor = neighborAdditionalData.get(`${neighbor.connectionType}://${neighbor.address}`);

            allRequests.push(new Promise((resolve) => {
              let startDate = new Date();
              const oldestEntry = rows.find(row => neighbor.address === row.address);

              // axios(IRI_SERVICE.createIriRequestForNeighborNode('getNodeInfo', neighbor.address.split(':')[0], ))
              axios(IRI_SERVICE.createIriRequestForNeighborNode('getNodeInfo', neighbor, additionalDataOfNeighbor ? additionalDataOfNeighbor.port : null))
              .then(nodeInfoResponse => {
                let ping = new Date() - startDate;
                let nodeInfo = nodeInfoResponse.data;

                const resultNeighbor = this.createResultNeighbor(neighbor, oldestEntry, additionalDataOfNeighbor, nodeInfo, ping);

                resultNeighbors.push(resultNeighbor);
                resolve(resultNeighbor);
              })
              .catch(error => {
                const resultNeighbor = this.createResultNeighbor(neighbor, oldestEntry, additionalDataOfNeighbor);

                resultNeighbors.push(resultNeighbor);
                resolve(resultNeighbor);
              });

            }));

          }

          Promise.all(allRequests)
          .then(evaluatedNeighbors => {
            evaluatedNeighbors.sort((a, b) => a.address.localeCompare(b.address));
            res.json(evaluatedNeighbors);
          })
          .catch(e => console.log(e.message));
        });
      })
      .catch(error => {
        console.log('failed to get neighbors', error.message);
        if (!IRI_SERVICE.iriIp) {
          res.status(404).send('NODE_NOT_SET');
        } else {
          res.status(500).send('NODE_INACCESSIBLE');
        }
      });
    });

    app.post(`${BASE_URL}/neighbor`, (req, res) => {
      if (!AUTH_UTIL.isUserAuthenticated(USER_RESOURCE.loginToken, req)) {
        res.status(401).send();
        return;
      }
      const name = req.body.name ? req.body.name : null;
      const port = req.body.port ? req.body.port : null;
      const fullAddress = req.body.address;
      const writeToIriConfig = req.body.writeToIriConfig;

      const addNeighborRequest = IRI_SERVICE.createIriRequest('addNeighbors');
      addNeighborRequest.data.uris = [fullAddress];

      axios(addNeighborRequest)
      .then(response => {
        // Remove old entries to not confuse outdated data with new one, if neighbor was already added in the past.
        const removeNeighborEntriesWithAddress = db.prepare(`DELETE FROM neighbor where address=?`);
        removeNeighborEntriesWithAddress.run(fullAddress);

        this.setNeighborAdditionalData(fullAddress, name, port);

        if (writeToIriConfig) IRI_SERVICE.writeNeighborToIriConfig(fullAddress);

        res.status(200).send();
      })
      .catch(error => {
        console.log(`Couldn't add neighbor`, error.message);
        res.status(500).send();
      });
    });

    app.delete(`${BASE_URL}/neighbor`, (req, res) => {
      if (!AUTH_UTIL.isUserAuthenticated(USER_RESOURCE.loginToken, req)) {
        res.status(401).send();
        return;
      }
      const fullAddress = req.body.address;
      const removeNeighborRequest = IRI_SERVICE.createIriRequest('removeNeighbors');
      removeNeighborRequest.data.uris = [fullAddress];

      axios(removeNeighborRequest)
      .then(response => {
        const addressWithoutProtocolPrefix = fullAddress.substring(6);

        const removeNeighborEntriesWithAddress = db.prepare(`DELETE FROM neighbor where address=?`);
        removeNeighborEntriesWithAddress.run(addressWithoutProtocolPrefix);

        this.removeNeighborFromUserNameTable(fullAddress);

        IRI_SERVICE.removeNeighborFromIriConfig(fullAddress);

        res.status(200).send();
      })
      .catch(error => {
        console.log(`Couldn't remove neighbor`, error.message);
        res.status(500).send();
      });
    });
  }

  intitializeNeighborUsernname(fullAddress, name) {
    const currentAdditionalData = neighborAdditionalData.get(fullAddress);
    neighborAdditionalData.set(fullAddress, {name, port: currentAdditionalData && currentAdditionalData.port ? currentAdditionalData.port : null});
  }

  intitializeNeighborIriMainPort(fullAddress, port) {
    const currentAdditionalData = neighborAdditionalData.get(fullAddress);
    neighborAdditionalData.set(fullAddress, {name: currentAdditionalData && currentAdditionalData.name ? currentAdditionalData.name : null, port});
  }

  removeNeighborFromUserNameTable(fullAddress) {
    neighborAdditionalData.delete(fullAddress);

    const removeNeighborEntriesWithAddress = db.prepare('DELETE FROM neighbor_data where address=?');
    removeNeighborEntriesWithAddress.run(fullAddress);
  }

  setNeighborAdditionalData(fullAddress, name, port) {
    const currentAdditionalDataForNeighbor = neighborAdditionalData.get(fullAddress);
    const oldName = currentAdditionalDataForNeighbor && currentAdditionalDataForNeighbor.name ? currentAdditionalDataForNeighbor.name : null;
    const oldPort = currentAdditionalDataForNeighbor && currentAdditionalDataForNeighbor.port ? currentAdditionalDataForNeighbor.port : null;

    neighborAdditionalData.set(fullAddress, {name: name ? name : oldName, port: port ? port : oldPort});

    const stmt = db.prepare('REPLACE INTO neighbor_data (address, name, port) VALUES (?, ?, ?)');
    stmt.run(fullAddress, name, port);
  }

  setNeighborName(fullAddress, name) {
    const currentAdditionalDataForNeighbor = neighborAdditionalData.get(fullAddress);
    const oldPort = currentAdditionalDataForNeighbor && currentAdditionalDataForNeighbor.port ? currentAdditionalDataForNeighbor.port : null;

    neighborAdditionalData.set(fullAddress, {name, port: oldPort});

    const stmt = db.prepare('REPLACE INTO neighbor_data (address, name, port) VALUES (?, ?, ?)');
    stmt.run(fullAddress, name, oldPort);
  }

  setNeighborPort(fullAddress, port) {
    const currentAdditionalDataForNeighbor = neighborAdditionalData.get(fullAddress);
    const oldName = currentAdditionalDataForNeighbor && currentAdditionalDataForNeighbor.name ? currentAdditionalDataForNeighbor.name : null;

    neighborAdditionalData.set(fullAddress, {name: oldName, port});

    const stmt = db.prepare('REPLACE INTO neighbor_data (address, name, port) VALUES (?, ?, ?)');
    stmt.run(fullAddress, oldName, port);
  }

  deleteNeighborHistory() {
    db.run(`DELETE FROM neighbor`);
  }

  createResultNeighbor(neighbor, oldestEntry, additionalData, nodeInfo = null, ping = null) {
    const resultNeighbor = {
      // address: neighbor.address,
      iriVersion: nodeInfo ? nodeInfo.appVersion : null,
      isSynced: nodeInfo && NODE_STATE.currentOwnNodeInfo && NODE_STATE.currentOwnNodeInfo.latestMilestoneIndex ? nodeInfo.latestSolidSubtangleMilestoneIndex >= NODE_STATE.currentOwnNodeInfo.latestMilestoneIndex - MAX_MILESTONES_BEHIND_BEFORE_UNSYNCED : null,
      isActive: oldestEntry ? neighbor.numberOfNewTransactions > oldestEntry.numberOfNewTransactions : null,
      protocol: neighbor.connectionType,
      onlineTime: nodeInfo ? nodeInfo.time : null,
      isFriendlyNode: neighbor.numberOfInvalidTransactions < neighbor.numberOfAllTransactions / 200,
      ping: ping,
      name: additionalData && additionalData.name ? additionalData.name : null,
      port: additionalData && additionalData.port ? additionalData.port : null,
      ...neighbor
    };

    const additionalDataForNeighbor = neighborAdditionalData.get(`${resultNeighbor.protocol}://${resultNeighbor.address}`);
    resultNeighbor.name = additionalDataForNeighbor && additionalDataForNeighbor.name ? additionalDataForNeighbor.name : null;

    return resultNeighbor;
  }
}

const neighborResource = new NeighborResource();
module.exports = neighborResource;