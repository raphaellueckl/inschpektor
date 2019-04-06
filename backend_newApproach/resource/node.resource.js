const exec = require('child_process').exec;
const bcrypt = require('bcrypt');
const axios = require('axios');

const USER_RESOURCE = require('./user.resource');
const DB_SERVICE = require('../service/db.service');
const IRI_SERVICE = require('../service/iri.service');
const NODE_STATE = require('../state/node.state');

console.log('###node');
console.log(IRI_SERVICE);
console.log(DB_SERVICE);
console.log(USER_RESOURCE);
console.log(NODE_STATE);

const BASE_URL = '/api';
const SALT = 11;

class NodeResource {
  init(app) {
    app.get(`${BASE_URL}/node-info`, (req, res) => {
      if (!IRI_SERVICE.iriIp) {
        res.status(404).send('NODE_NOT_SET');
        return;
      }
      const pingStart = new Date();
      axios(IRI_SERVICE.createIriRequest('getNodeInfo'))
        .then(response => {
          const ping = new Date() - pingStart;
          NODE_STATE.currentOwnNodeInfo = response.data;
          NODE_STATE.currentOwnNodeInfo.ping = ping;
          res.json(NODE_STATE.currentOwnNodeInfo);
        })
        .catch(error => {
          if (!IRI_SERVICE.iriIp) {
            res.status(500).send('NODE_NOT_SET');
          } else {
            res.status(500).send('NODE_INACCESSIBLE');
          }
        });
    });

    app.post(`${BASE_URL}/host-node-ip`, (req, res) => {
      const protocol = req.body.protocol;
      const newIriIp = req.body.nodeIp;
      const port = req.body.port;
      const password = req.body.password;
      const iriFileLocation = req.body.iriPath;
      NODE_STATE.restartNodeCommand = req.body.restartNodeCommand;

      if (!newIriIp || !port) {
        res.status(404).send();
        return;
      }

      if (!NODE_STATE.hashedPw && password)
        NODE_STATE.hashedPw = bcrypt.hashSync(password, SALT);

      if (password && bcrypt.compareSync(password, NODE_STATE.hashedPw)) {
        IRI_SERVICE.protocol = protocol;
        IRI_SERVICE.iriIp = newIriIp;
        IRI_SERVICE.iriPort = port;
        IRI_SERVICE.iriFileLocation = iriFileLocation;
        NODE_STATE.loginToken = new Date()
          .toString()
          .split('')
          .reverse()
          .join('');

        DB_SERVICE.updateHostIp(
          IRI_SERVICE.protocol,
          IRI_SERVICE.iriIp,
          IRI_SERVICE.iriPort,
          NODE_STATE.hashedPw,
          IRI_SERVICE.iriFileLocation,
          NODE_STATE.loginToken,
          NODE_STATE.restartNodeCommand
        );

        res.json({
          token: NODE_STATE.loginToken
        });
      } else if (!password) {
        IRI_SERVICE.protocol = protocol;
        IRI_SERVICE.iriIp = newIriIp;
        IRI_SERVICE.iriPort = port;

        DB_SERVICE.updateHostIpMinimalInfo();

        res.status(200).send();
      } else {
        res.status(403).send();
      }
    });

    app.get(`${BASE_URL}/iri-details`, (req, res) => {
      if (!USER_RESOURCE.isUserAuthenticated(NODE_STATE.loginToken, req)) {
        res.status(401).send();
        return;
      }
      res.send({
        protocol: IRI_SERVICE.protocol,
        nodeIp: IRI_SERVICE.iriIp,
        port: IRI_SERVICE.iriPort,
        iriFileLocation: IRI_SERVICE.iriFileLocation
      });
    });

    app.get(`${BASE_URL}/persisted-neighbors`, async (req, res) => {
      if (!USER_RESOURCE.isUserAuthenticated(NODE_STATE.loginToken, req)) {
        res.status(401).send();
        return;
      }
      const persistedNeighbors = await IRI_SERVICE.readPersistedNeighbors();
      NODE_STATE.persistedNeighbors = persistedNeighbors;
      res.send(NODE_STATE.persistedNeighbors);
    });

    app.post(`${BASE_URL}/restart-node`, async (req, res) => {
      if (!USER_RESOURCE.isUserAuthenticated(NODE_STATE.loginToken, req)) {
        res.status(401).send();
        return;
      }
      exec(NODE_STATE.restartNodeCommand, (error, stdout, stderr) => {
        if (error || stderr) {
          res.status(500).send();
          return;
        }
        DB_SERVICE.deleteNeighborHistory();
        res.status(200).send();
      });
    });

    app.post(`/api/reset-database`, async (req, res) => {
      if (!USER_RESOURCE.isUserAuthenticated(NODE_STATE.loginToken, req)) {
        res.status(401).send();
        return;
      }
      await DB_SERVICE.dropAllTables();
      DB_SERVICE.createNewDatabase();
      DB_SERVICE.createTables();
      DB_SERVICE.initializeState(
        IRI_SERVICE.protocol,
        IRI_SERVICE.iriIp,
        IRI_SERVICE.iriPort,
        IRI_SERVICE.iriFileLocation
      );
      res.status(200).send();
    });
  }
}

const nodeResource = new NodeResource();
module.exports = nodeResource;
