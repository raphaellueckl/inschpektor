const exec = require('child_process').exec;
const bcrypt = require('bcrypt');
const axios = require('axios');
const IRI_SERVICE = require('../util/iri.util');
const USER_RESOURCE = require('./user.resource');
const NEIGHBOR_RESOURCE = require('./neighbor.resource');
const NODE_STATE = require('../state/node.state');

const BASE_URL = '/api';
const SALT = 11;

class NodeResource {
  init(app, db) {
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

      if (!USER_RESOURCE.hashedPw && password)
        USER_RESOURCE.hashedPw = bcrypt.hashSync(password, SALT);

      if (password && bcrypt.compareSync(password, USER_RESOURCE.hashedPw)) {
        IRI_SERVICE.protocol = protocol;
        IRI_SERVICE.iriIp = newIriIp;
        IRI_SERVICE.iriPort = port;
        IRI_SERVICE.iriFileLocation = iriFileLocation;
        NODE_STATE.loginToken = new Date()
          .toString()
          .split('')
          .reverse()
          .join('');

        const updateHostIp = db.prepare(
          'REPLACE INTO host_node (id, protocol, ip, port, hashed_pw, iri_path, login_token, restart_node_command) VALUES(?, ?, ?, ?, ?, ?, ?, ?)'
        );
        updateHostIp.run(
          0,
          IRI_SERVICE.protocol,
          IRI_SERVICE.iriIp,
          IRI_SERVICE.iriPort,
          USER_RESOURCE.hashedPw,
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
        const updateHostIp = db.prepare(
          `UPDATE host_node SET protocol = ?, ip = ?, port = ? WHERE id = ?`
        );
        updateHostIp.run(
          IRI_SERVICE.protocol,
          IRI_SERVICE.iriIp,
          IRI_SERVICE.iriPort,
          0
        );

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
      NEIGHBOR_RESOURCE.persistedNeighbors = persistedNeighbors;
      res.send(persistedNeighbors);
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
        NEIGHBOR_RESOURCE.deleteNeighborHistory();
        res.status(200).send();
      });
    });
  }
}

const nodeResource = new NodeResource();
module.exports = nodeResource;
