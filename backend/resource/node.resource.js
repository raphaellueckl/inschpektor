const bcrypt = require('bcrypt');
const axios = require('axios');
const IRI_SERVICE = require('../util/iri.util.js');
const USER_RESOURCE = require('./user.resource.js');

const BASE_URL = '/api';
const SALT = 11;

class NodeResource {

  constructor() {
    this.loginToken = null;
  }

  init(app, db) {
    app.get(`${BASE_URL}/node-info`, (req, res) => {
      let auth = req.get('Authorization');

      if (!IRI_SERVICE.iriIp) {
        res.status(404).send('NODE_NOT_SET');
      }
      axios(IRI_SERVICE.createIriRequest('getNodeInfo'))
      .then(response => {
        res.json(response.data);
      })
      .catch(error => {
        res.status(500).send('NODE_INFO_INANCCESSIBLE');
      });
    });

    app.post(`${BASE_URL}/host-node-ip`, (req, res) => {
      const protocol = req.body.protocol;
      const newIriIp = req.body.nodeIp;
      const port = req.body.port;
      const password = req.body.password;
      const iriFileLocation = req.body.iriPath;

      if (!newIriIp || !port) res.status(404).send();

      if (!USER_RESOURCE.hashedPw && password) USER_RESOURCE.hashedPw = bcrypt.hashSync(password, SALT);

      if (password && bcrypt.compareSync(password, USER_RESOURCE.hashedPw)) {
        IRI_SERVICE.protocol = protocol;
        IRI_SERVICE.iriIp = newIriIp;
        IRI_SERVICE.iriPort = port;
        IRI_SERVICE.iriFileLocation = iriFileLocation;
        this.loginToken = new Date().toString().split('').reverse().join('');

        const updateHostIp = db.prepare('REPLACE INTO host_node (id, protocol, ip, port, hashed_pw, iri_path, login_token) VALUES(?, ?, ?, ?, ?, ?, ?)');
        updateHostIp.run(0, IRI_SERVICE.protocol, IRI_SERVICE.iriIp, IRI_SERVICE.iriPort, USER_RESOURCE.hashedPw, IRI_SERVICE.iriFileLocation, this.loginToken);

        res.json({
          token: this.loginToken
        });
      } else if (!password) {
        IRI_SERVICE.protocol = protocol;
        IRI_SERVICE.iriIp = newIriIp;
        IRI_SERVICE.iriPort = port;
        const updateHostIp = db.prepare(`UPDATE host_node SET protocol = ?, ip = ?, port = ? WHERE id = ?`);
        updateHostIp.run(IRI_SERVICE.protocol, IRI_SERVICE.iriIp, IRI_SERVICE.iriPort, 0);

        res.status(200).send();
      } else {
        res.status(403).send();
      }
    });

    app.get(`${BASE_URL}/iri-ip`, (req, res) => {
      res.send({
        protocol: IRI_SERVICE.protocol,
        ip: IRI_SERVICE.iriIp,
        port: IRI_SERVICE.iriPort
      });
    });
  }

}

const nodeResource = new NodeResource();
module.exports = nodeResource;
