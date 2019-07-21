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
      const domain = req.body.domain;

      this.setNeighborName(domain, name);

      res.status(200).send();
    });

    app.post(`${GLOBALS.BASE_URL}/neighbor/port`, (req, res) => {
      if (!AUTH_SERVICE.isUserAuthenticated(NODE_STATE.loginToken, req)) {
        res.status(401).send();
        return;
      }
      const port = req.body.port;
      const domain = req.body.domain;

      this.setNeighborPort(domain, port);

      res.status(200).send();
    });

    app.post(`${GLOBALS.BASE_URL}/neighbor/additional-data`, (req, res) => {
      if (!AUTH_SERVICE.isUserAuthenticated(NODE_STATE.loginToken, req)) {
        res.status(401).send();
        return;
      }
      const neighbors = req.body;
      neighbors.forEach(n =>
        this.setNeighborAdditionalData(n.domain, n.name, n.port)
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
      const domain = req.body.domain;
      const writeToIriConfig = req.body.writeToIriConfig;

      const addNeighborRequest = IRI_SERVICE.createIriRequest('addNeighbors');
      addNeighborRequest.data.uris = [domain];

      axios(addNeighborRequest)
        .then(response => {
          // Remove old entries to not confuse outdated data with new one, if neighbor was already added in the past.
          DB_SERVICE.deleteNeighborHistory(domain);

          this.setNeighborAdditionalData(domain, name, port);

          if (writeToIriConfig)
            IRI_SERVICE.writeNeighborToIriConfig(domain);

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
      const domain = req.body.domain;
      const removeNeighborRequest = IRI_SERVICE.createIriRequest(
        'removeNeighbors'
      );
      removeNeighborRequest.data.uris = [domain];

      axios(removeNeighborRequest)
        .then(response => {
          DB_SERVICE.deleteNeighborHistory(domain);

          this.removeNeighborFromUserNameTable(domain);

          IRI_SERVICE.removeNeighborFromIriConfig(domain);

          res.status(200).send();
        })
        .catch(error => {
          console.log(`Couldn't remove neighbor`, error.message);
          res.status(500).send();
        });
    });
  }

  removeNeighborFromUserNameTable(domain) {
    NODE_STATE.neighborAdditionalData.delete(domain);

    DB_SERVICE.deleteNeighborData(domain);
  }

  setNeighborAdditionalData(domain, name, port) {
    const currentAdditionalDataForNeighbor = NODE_STATE.neighborAdditionalData.get(
      domain
    );
    const oldName =
      currentAdditionalDataForNeighbor && currentAdditionalDataForNeighbor.name
        ? currentAdditionalDataForNeighbor.name
        : null;
    const oldPort =
      currentAdditionalDataForNeighbor && currentAdditionalDataForNeighbor.port
        ? currentAdditionalDataForNeighbor.port
        : null;

    NODE_STATE.neighborAdditionalData.set(domain, {
      name: name ? name : oldName,
      port: port ? port : oldPort
    });

    DB_SERVICE.setNeighborAdditionalData(domain, name, port);
  }

  setNeighborName(domain, name) {
    const currentAdditionalDataForNeighbor = NODE_STATE.neighborAdditionalData.get(
      domain
    );
    const oldPort =
      currentAdditionalDataForNeighbor && currentAdditionalDataForNeighbor.port
        ? currentAdditionalDataForNeighbor.port
        : null;

    NODE_STATE.neighborAdditionalData.set(domain, { name, port: oldPort });

    DB_SERVICE.setNeighborAdditionalData(domain, name, oldPort);
  }

  setNeighborPort(domain, port) {
    const currentAdditionalDataForNeighbor = NODE_STATE.neighborAdditionalData.get(
      domain
    );
    const oldName =
      currentAdditionalDataForNeighbor && currentAdditionalDataForNeighbor.name
        ? currentAdditionalDataForNeighbor.name
        : null;

    NODE_STATE.neighborAdditionalData.set(domain, { name: oldName, port });

    DB_SERVICE.setNeighborAdditionalData(domain, oldName, port);
  }
}

const neighborResource = new NeighborResource();
module.exports = neighborResource;
