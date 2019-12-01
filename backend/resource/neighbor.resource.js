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
  init(app) {
    app.post(`${GLOBALS.BASE_URL}/neighbor/name`, (req, res) => {
      if (!AUTH_SERVICE.isUserAuthenticated(NODE_STATE.loginToken, req)) {
        res.status(401).send();
        return;
      }
      const { domainWithConnectionPort, name } = req.body;

      this._setNeighborName(domainWithConnectionPort, name);

      res.status(200).send();
    });

    app.post(`${GLOBALS.BASE_URL}/neighbor/port`, (req, res) => {
      if (!AUTH_SERVICE.isUserAuthenticated(NODE_STATE.loginToken, req)) {
        res.status(401).send();
        return;
      }
      const { domainWithConnectionPort, iriPort } = req.body;

      this._setNeighborPort(domainWithConnectionPort, iriPort);

      res.status(200).send();
    });

    app.post(`${GLOBALS.BASE_URL}/neighbor/additional-data`, (req, res) => {
      if (!AUTH_SERVICE.isUserAuthenticated(NODE_STATE.loginToken, req)) {
        res.status(401).send();
        return;
      }
      const neighbors = req.body;
      neighbors.forEach(n =>
        this._setNeighborAdditionalData(
          `${n.domain}:${n.address.split(':')[1]}`,
          n.name,
          n.port
        )
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
      const iriPort = req.body.port ? req.body.port : null;
      const domainWithConnectionPort = req.body.domain;
      const writeToIriConfig = req.body.writeToIriConfig;
      const fullAddress = `tcp://${domainWithConnectionPort}`;

      const addNeighborRequest = IRI_SERVICE.createIriRequest('addNeighbors');
      addNeighborRequest.data.uris = [fullAddress];

      axios(addNeighborRequest)
        .then(response => {
          // Remove old entries to not confuse outdated data with new one, if neighbor was already added in the past.
          DB_SERVICE.deleteNeighborHistory(domainWithConnectionPort);

          this._setNeighborAdditionalData(
            domainWithConnectionPort,
            name,
            iriPort
          );

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
      const { domainWithConnectionPort } = req.body;
      const fullAddress = `tcp://${domainWithConnectionPort}`;
      const removeNeighborRequest = IRI_SERVICE.createIriRequest(
        'removeNeighbors'
      );
      removeNeighborRequest.data.uris = [fullAddress];

      axios(removeNeighborRequest)
        .then(response => {
          DB_SERVICE.deleteNeighborHistory(domainWithConnectionPort);

          this._removeNeighborFromUserNameTable(domainWithConnectionPort);

          IRI_SERVICE.removeNeighborFromIriConfig(fullAddress);

          res.status(200).send();
        })
        .catch(error => {
          console.log(`Couldn't remove neighbor`, error.message);
          res.status(500).send();
        });
    });
  }

  _removeNeighborFromUserNameTable(domainWithConnectionPort) {
    NODE_STATE.neighborAdditionalData.delete(domainWithConnectionPort);

    DB_SERVICE.deleteNeighborData(domainWithConnectionPort);
  }

  _setNeighborAdditionalData(domainWithConnectionPort, name, iriPort) {
    const currentAdditionalDataForNeighbor = NODE_STATE.neighborAdditionalData.get(
      domainWithConnectionPort
    );
    const oldName =
      currentAdditionalDataForNeighbor && currentAdditionalDataForNeighbor.name
        ? currentAdditionalDataForNeighbor.name
        : null;
    const oldIriPort =
      currentAdditionalDataForNeighbor && currentAdditionalDataForNeighbor.port
        ? currentAdditionalDataForNeighbor.port
        : null;

    NODE_STATE.neighborAdditionalData.set(domainWithConnectionPort, {
      name: name ? name : oldName,
      port: iriPort ? iriPort : oldIriPort
    });

    DB_SERVICE.setNeighborAdditionalData(
      domainWithConnectionPort,
      name,
      iriPort
    );
  }

  _setNeighborName(domainWithConnectionPort, name) {
    const currentAdditionalDataForNeighbor = NODE_STATE.neighborAdditionalData.get(
      domainWithConnectionPort
    );
    const oldIriPort =
      currentAdditionalDataForNeighbor && currentAdditionalDataForNeighbor.port
        ? currentAdditionalDataForNeighbor.port
        : null;

    NODE_STATE.neighborAdditionalData.set(domainWithConnectionPort, {
      name,
      port: oldIriPort
    });

    DB_SERVICE.setNeighborAdditionalData(
      domainWithConnectionPort,
      name,
      oldIriPort
    );
  }

  _setNeighborPort(domainWithConnectionPort, iriPort) {
    const currentAdditionalDataForNeighbor = NODE_STATE.neighborAdditionalData.get(
      domainWithConnectionPort
    );
    const oldName =
      currentAdditionalDataForNeighbor && currentAdditionalDataForNeighbor.name
        ? currentAdditionalDataForNeighbor.name
        : null;

    NODE_STATE.neighborAdditionalData.set(domainWithConnectionPort, {
      name: oldName,
      port: iriPort
    });

    DB_SERVICE.setNeighborAdditionalData(
      domainWithConnectionPort,
      oldName,
      iriPort
    );
  }
}

const neighborResource = new NeighborResource();
module.exports = neighborResource;
