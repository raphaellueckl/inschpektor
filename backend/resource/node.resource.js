const exec = require('child_process').exec;
const bcrypt = require('bcrypt');
const axios = require('axios');

const IRI_SERVICE = require('../service/iri.service');
const DB_SERVICE = require('../service/db.service');
const AUTH_SERVICE = require('../service/auth.service');
const NODE_STATE = require('../state/node.state');
const GLOBALS = require('../state/globals');

const SALT = 11;

class NodeResource {
  init(app) {
    app.get(`${GLOBALS.BASE_URL}/node-info`, (req, res) => {
      if (!NODE_STATE.iriIp) {
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
          if (!NODE_STATE.iriIp) {
            res.status(500).send('NODE_NOT_SET');
          } else {
            res.status(500).send('NODE_INACCESSIBLE');
          }
        });
    });

    app.post(`${GLOBALS.BASE_URL}/host-node-ip`, (req, res) => {
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
        NODE_STATE.protocol = protocol;
        NODE_STATE.iriIp = newIriIp;
        NODE_STATE.iriPort = port;
        NODE_STATE.iriFileLocation = iriFileLocation;
        NODE_STATE.loginToken = new Date()
          .toString()
          .split('')
          .reverse()
          .join('');
        DB_SERVICE.setupHost(
          NODE_STATE.protocol,
          NODE_STATE.iriIp,
          NODE_STATE.iriPort,
          NODE_STATE.hashedPw,
          NODE_STATE.iriFileLocation,
          NODE_STATE.loginToken,
          NODE_STATE.restartNodeCommand
        );

        res.json({
          token: NODE_STATE.loginToken
        });
      } else if (!password) {
        NODE_STATE.protocol = protocol;
        NODE_STATE.iriIp = newIriIp;
        NODE_STATE.iriPort = port;

        DB_SERVICE.changeHostAddress(
          NODE_STATE.protocol,
          NODE_STATE.iriIp,
          NODE_STATE.iriPort
        );
        res.status(200).send();
      } else {
        res.status(403).send();
      }
    });

    app.get(`${GLOBALS.BASE_URL}/iri-details`, (req, res) => {
      if (!AUTH_SERVICE.isUserAuthenticated(NODE_STATE.loginToken, req)) {
        res.status(401).send();
        return;
      }
      res.send({
        protocol: NODE_STATE.protocol,
        nodeIp: NODE_STATE.iriIp,
        port: NODE_STATE.iriPort,
        iriFileLocation: NODE_STATE.iriFileLocation
      });
    });

    app.get(`${GLOBALS.BASE_URL}/persisted-neighbors`, async (req, res) => {
      if (!AUTH_SERVICE.isUserAuthenticated(NODE_STATE.loginToken, req)) {
        res.status(401).send();
        return;
      }
      const persistedNeighbors = await IRI_SERVICE.readPersistedNeighbors();
      NODE_STATE.persistedNeighbors = persistedNeighbors;
      res.send(NODE_STATE.persistedNeighbors);
    });

    app.post(`${GLOBALS.BASE_URL}/restart-node`, async (req, res) => {
      if (!AUTH_SERVICE.isUserAuthenticated(NODE_STATE.loginToken, req)) {
        res.status(401).send();
        return;
      }
      exec(NODE_STATE.restartNodeCommand, (error, stdout, stderr) => {
        if (error || stderr) {
          res.status(500).send();
          return;
        }
        DB_SERVICE.deleteWholeNeighborHistory();
        res.status(200).send();
      });
    });

    app.post(`/api/reset-database`, async (req, res) => {
      if (!AUTH_SERVICE.isUserAuthenticated(NODE_STATE.loginToken, req)) {
        res.status(401).send();
        return;
      }
      await DB_SERVICE.dropAllTables();
      DB_SERVICE.createTables();
      DB_SERVICE.initializeState();
      res.status(200).send();
    });
  }
}

const nodeResource = new NodeResource();
module.exports = nodeResource;
