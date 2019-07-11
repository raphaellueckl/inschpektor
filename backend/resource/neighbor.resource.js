require('../../node_modules/console-stamp')(console, {
  pattern: 'dd/mm/yyyy HH:MM:ss.l'
});
const axios = require('axios');

const IRI_SERVICE = require('../service/iri.service');
const AUTH_SERVICE = require('../service/auth.service');
const NODE_STATE = require('../state/node.state');
const DB_SERVICE = require('../service/db.service');
const GLOBALS = require('../state/globals');

class NeighborResource {
  constructor() {
    NODE_STATE.persistedNeighbors = undefined;
  }

  init(app) {
    app.post(`${GLOBALS.BASE_URL}/neighbor/name`, (req, res) => {
      if (!AUTH_SERVICE.isUserAuthenticated(NODE_STATE.loginToken, req)) {
        res.status(401).send();
        return;
      }
      const name = req.body.name;
      const fullAddress = req.body.fullAddress;

      this.setNeighborName(fullAddress, name);

      res.status(200).send();
    });

    app.post(`${GLOBALS.BASE_URL}/neighbor/port`, (req, res) => {
      if (!AUTH_SERVICE.isUserAuthenticated(NODE_STATE.loginToken, req)) {
        res.status(401).send();
        return;
      }
      const port = req.body.port;
      const fullAddress = req.body.fullAddress;

      this.setNeighborPort(fullAddress, port);

      res.status(200).send();
    });

    app.post(`${GLOBALS.BASE_URL}/neighbor/additional-data`, (req, res) => {
      if (!AUTH_SERVICE.isUserAuthenticated(NODE_STATE.loginToken, req)) {
        res.status(401).send();
        return;
      }
      const neighbors = req.body;
      neighbors.forEach(n =>
        this.setNeighborAdditionalData(`tcp://${n.address}`, n.name, n.port)
      );

      res.status(200).send();
    });

    app.get(`${GLOBALS.BASE_URL}/neighbors`, (req, res) => {
      if (!NODE_STATE.iriIp) {
        res.status(404).send('NODE_NOT_SET');
        return;
      }
      res.json(NODE_STATE.currentNeighbors);
    });

    app.post(`${GLOBALS.BASE_URL}/neighbor`, (req, res) => {
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

    app.delete(`${GLOBALS.BASE_URL}/neighbor`, (req, res) => {
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
}

const neighborResource = new NeighborResource();
module.exports = neighborResource;
