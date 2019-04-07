const bcrypt = require('bcrypt');

const NODE_STATE = require('../state/node.state');
const DB_SERVICE = require('../service/db.service');

class AuthResource {
  init(app) {
    app.post('/api/login', (req, res) => {
      const deliveredPasswordOrToken = req.body.passwordOrToken;

      if (
        deliveredPasswordOrToken &&
        deliveredPasswordOrToken === NODE_STATE.loginToken
      ) {
        res.json({
          token: NODE_STATE.loginToken
        });
      } else if (
        deliveredPasswordOrToken &&
        NODE_STATE.hashedPw &&
        bcrypt.compareSync(deliveredPasswordOrToken, NODE_STATE.hashedPw)
      ) {
        NODE_STATE.loginToken = new Date()
          .toString()
          .split('')
          .reverse()
          .join('');
        DB_SERVICE.updateHostIp();

        res.json({
          token: NODE_STATE.loginToken
        });
      } else {
        res.status(404).send();
      }
    });

    app.post('/api/notification', (req, res) => {
      const token = req.body.token;
      NODE_STATE.notificationTokens.push(token);

      DB_SERVICE.setNotificationToken();

      res.status(200).send();
    });
  }

  isUserAuthenticated(validToken, request) {
    return request && validToken === request.header('Authorization');
  }
}

const authResource = new AuthResource();
module.exports = authResource;
