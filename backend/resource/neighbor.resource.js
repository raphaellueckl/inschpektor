require('../../node_modules/console-stamp')(console, {
  pattern: 'dd/mm/yyyy HH:MM:ss.l'
});
const axios = require('axios');

const IRI_SERVICE = require('../service/iri.service');
const AUTH_SERVICE = require('../service/auth.service');
const NODE_STATE = require('../state/node.state');
const DB_SERVICE = require('../service/db.service');

const MAX_MILESTONES_BEHIND_BEFORE_UNSYNCED = 50;
// TODO move to a config or something, since redundant
const BASE_URL = '/api';

class NeighborResource {
  constructor() {
    NODE_STATE.persistedNeighbors = undefined;
  }

  init(app) {
    app.post(`${BASE_URL}/neighbor/name`, (req, res) => {
      if (!AUTH_SERVICE.isUserAuthenticated(NODE_STATE.loginToken, req)) {
        res.status(401).send();
        return;
      }
      const name = req.body.name;
      const fullAddress = req.body.fullAddress;

      this.setNeighborName(fullAddress, name);

      res.status(200).send();
    });

    app.post(`${BASE_URL}/neighbor/port`, (req, res) => {
      if (!AUTH_SERVICE.isUserAuthenticated(NODE_STATE.loginToken, req)) {
        res.status(401).send();
        return;
      }
      const port = req.body.port;
      const fullAddress = req.body.fullAddress;

      this.setNeighborPort(fullAddress, port);

      res.status(200).send();
    });

    app.post(`${BASE_URL}/neighbor/additional-data`, (req, res) => {
      if (!AUTH_SERVICE.isUserAuthenticated(NODE_STATE.loginToken, req)) {
        res.status(401).send();
        return;
      }
      const neighbors = req.body;
      neighbors.forEach(n =>
        this.setNeighborAdditionalData(
          `${n.protocol}://${n.address}`,
          n.name,
          n.port
        )
      );

      res.status(200).send();
    });

    app.get(`${BASE_URL}/neighbors`, (req, res) => {
      const resultNeighbors = [];
      axios(IRI_SERVICE.createIriRequest('getNeighbors'))
        .then(async iriNeighborsResponse => {
          const activeNeighbors = iriNeighborsResponse.data.neighbors;

          const rows = await DB_SERVICE.getAllNeighborEntries();

          const allRequests = [];

          for (let neighbor of activeNeighbors) {
            const additionalDataOfNeighbor = NODE_STATE.neighborAdditionalData.get(
              `${neighbor.connectionType}://${neighbor.address}`
            );

            allRequests.push(
              new Promise((resolve, reject) => {
                let startDate = new Date();
                const oldestEntry = rows.find(
                  row => neighbor.address === row.address
                );

                axios(
                  IRI_SERVICE.createIriRequestForNeighborNode(
                    'getNodeInfo',
                    neighbor,
                    additionalDataOfNeighbor
                      ? additionalDataOfNeighbor.port
                      : null
                  )
                )
                  .then(nodeInfoResponse => {
                    let ping = new Date() - startDate;
                    let nodeInfo = nodeInfoResponse.data;

                    const resultNeighbor = this.createResultNeighbor(
                      neighbor,
                      oldestEntry,
                      additionalDataOfNeighbor,
                      nodeInfo,
                      ping
                    );

                    resultNeighbors.push(resultNeighbor);
                    resolve(resultNeighbor);
                  })
                  .catch(error => {
                    const resultNeighbor = this.createResultNeighbor(
                      neighbor,
                      oldestEntry,
                      additionalDataOfNeighbor
                    );

                    resultNeighbors.push(resultNeighbor);
                    resolve(resultNeighbor);
                  });
              })
            );
          }

          Promise.all(allRequests)
            .then(evaluatedNeighbors => {
              // Sort Priority: Persisted neighbors, premium neighbors, neighbor address
              evaluatedNeighbors.sort((a, b) => {
                if (
                  NODE_STATE.persistedNeighbors &&
                  !!(
                    (NODE_STATE.persistedNeighbors.includes(a.address) !==
                      null) ^
                    NODE_STATE.persistedNeighbors.includes(b.address)
                  )
                ) {
                  return NODE_STATE.persistedNeighbors.includes(a.address)
                    ? -1
                    : 1;
                }
                if (!!((a.iriVersion !== null) ^ (b.iriVersion !== null))) {
                  return a.iriVersion ? -1 : 1;
                }
                return a.address.localeCompare(b.address);
              });
              res.json(evaluatedNeighbors);
            })
            .catch(e => console.log(e.message));
        })
        .catch(error => {
          console.log('failed to get neighbors', error.message);
          if (!NODE_STATE.iriIp) {
            res.status(404).send('NODE_NOT_SET');
          } else {
            res.status(500).send('NODE_INACCESSIBLE');
          }
        });
    });

    app.post(`${BASE_URL}/neighbor`, (req, res) => {
      if (!AUTH_SERVICE.isUserAuthenticated(NODE_STATE.loginToken, req)) {
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
          DB_SERVICE.deleteNeighborHistory(fullAddress);

          this.setNeighborAdditionalData(fullAddress, name, port);

          if (writeToIriConfig)
            IRI_SERVICE.writeNeighborToIriConfig(fullAddress);

          res.status(200).send();
        })
        .catch(error => {
          console.log(`Couldn't add neighbor`, error.message);
          res.status(500).send();
        });
    });

    app.delete(`${BASE_URL}/neighbor`, (req, res) => {
      if (!AUTH_SERVICE.isUserAuthenticated(NODE_STATE.loginToken, req)) {
        res.status(401).send();
        return;
      }
      const fullAddress = req.body.address;
      const removeNeighborRequest = IRI_SERVICE.createIriRequest(
        'removeNeighbors'
      );
      removeNeighborRequest.data.uris = [fullAddress];

      axios(removeNeighborRequest)
        .then(response => {
          const addressWithoutProtocolPrefix = fullAddress.substring(6);

          DB_SERVICE.deleteNeighborHistory(addressWithoutProtocolPrefix);

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

  removeNeighborFromUserNameTable(fullAddress) {
    NODE_STATE.neighborAdditionalData.delete(fullAddress);

    DB_SERVICE.deleteNeighborData(fullAddress);
  }

  setNeighborAdditionalData(fullAddress, name, port) {
    const currentAdditionalDataForNeighbor = NODE_STATE.neighborAdditionalData.get(
      fullAddress
    );
    const oldName =
      currentAdditionalDataForNeighbor && currentAdditionalDataForNeighbor.name
        ? currentAdditionalDataForNeighbor.name
        : null;
    const oldPort =
      currentAdditionalDataForNeighbor && currentAdditionalDataForNeighbor.port
        ? currentAdditionalDataForNeighbor.port
        : null;

    NODE_STATE.neighborAdditionalData.set(fullAddress, {
      name: name ? name : oldName,
      port: port ? port : oldPort
    });

    DB_SERVICE.setNeighborAdditionalData(fullAddress, name, port);
  }

  setNeighborName(fullAddress, name) {
    const currentAdditionalDataForNeighbor = NODE_STATE.neighborAdditionalData.get(
      fullAddress
    );
    const oldPort =
      currentAdditionalDataForNeighbor && currentAdditionalDataForNeighbor.port
        ? currentAdditionalDataForNeighbor.port
        : null;

    NODE_STATE.neighborAdditionalData.set(fullAddress, { name, port: oldPort });

    DB_SERVICE.setNeighborAdditionalData(fullAddress, name, oldPort);
  }

  setNeighborPort(fullAddress, port) {
    const currentAdditionalDataForNeighbor = NODE_STATE.neighborAdditionalData.get(
      fullAddress
    );
    const oldName =
      currentAdditionalDataForNeighbor && currentAdditionalDataForNeighbor.name
        ? currentAdditionalDataForNeighbor.name
        : null;

    NODE_STATE.neighborAdditionalData.set(fullAddress, { name: oldName, port });

    DB_SERVICE.setNeighborAdditionalData(fullAddress, oldName, port);
  }

  createResultNeighbor(
    neighbor,
    oldestEntry,
    additionalData,
    nodeInfo = null,
    ping = null
  ) {
    const resultNeighbor = {
      iriVersion: nodeInfo ? nodeInfo.appVersion : null,
      isSynced:
        nodeInfo &&
        NODE_STATE.currentOwnNodeInfo &&
        NODE_STATE.currentOwnNodeInfo.latestMilestoneIndex
          ? nodeInfo.latestSolidSubtangleMilestoneIndex >=
            NODE_STATE.currentOwnNodeInfo.latestMilestoneIndex -
              MAX_MILESTONES_BEHIND_BEFORE_UNSYNCED
          : null,
      milestone: nodeInfo
        ? `${nodeInfo.latestSolidSubtangleMilestoneIndex} / ${
            NODE_STATE.currentOwnNodeInfo.latestMilestoneIndex
          }`
        : null,
      isActive: oldestEntry
        ? neighbor.numberOfNewTransactions > oldestEntry.numberOfNewTransactions
        : null,
      protocol: neighbor.connectionType,
      onlineTime: nodeInfo ? nodeInfo.time : null,
      isFriendlyNode:
        neighbor.numberOfInvalidTransactions <
        neighbor.numberOfAllTransactions / 200,
      ping: ping,
      name: additionalData && additionalData.name ? additionalData.name : null,
      port: additionalData && additionalData.port ? additionalData.port : null,
      ...neighbor
    };

    const additionalDataForNeighbor = NODE_STATE.neighborAdditionalData.get(
      `${resultNeighbor.protocol}://${resultNeighbor.address}`
    );
    resultNeighbor.name =
      additionalDataForNeighbor && additionalDataForNeighbor.name
        ? additionalDataForNeighbor.name
        : null;

    return resultNeighbor;
  }
}

const neighborResource = new NeighborResource();
module.exports = neighborResource;
