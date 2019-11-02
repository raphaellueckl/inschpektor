const axios = require('axios');

const AUTH_SERVICE = require('../service/auth.service');
const NODE_STATE = require('../state/node.state');
const GLOBALS = require('../state/globals');

class HostResource {
  init(app) {
    app.get(`${GLOBALS.BASE_URL}/versions`, (req, res) => {
      if (!AUTH_SERVICE.isUserAuthenticated(NODE_STATE.loginToken, req)) {
        res.status(401).send();
        return;
      }

      const installedVersion = require('../../package.json').version;
      axios
        .get('http://registry.npmjs.org/-/package/inschpektor/dist-tags')
        .then(response => {
          if (response && response.data) {
            const newestVersion = response.data.latest;
            res.json({ installed: installedVersion, newest: newestVersion });
          } else {
            res.json({ installed: installedVersion });
          }
        })
        .catch(error => {
          console.log(
            'Could not receive information about latest inschpektor version.'
          );
          res.json({ installed: installedVersion });
        });
    });

    app.get(`${GLOBALS.BASE_URL}/system-info`, (req, res) => {
      if (!AUTH_SERVICE.isUserAuthenticated(NODE_STATE.loginToken, req)) {
        res.status(401).send();
        return;
      }
      res.json(NODE_STATE.systemInfo || []);
    });
  }
}

const hostResource = new HostResource();
module.exports = hostResource;
