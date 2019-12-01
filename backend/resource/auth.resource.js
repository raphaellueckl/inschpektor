const NODE_STATE = require('../state/node.state');
const DB_SERVICE = require('../service/db.service');
const AUTH_SERVICE = require('../service/auth.service');
const GLOBALS = require('../state/globals');

class AuthResource {
  init(app) {
    app.post(`${GLOBALS.BASE_URL}/login`, (req, res) => {
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
        AUTH_SERVICE.isPasswordCorrect(
          deliveredPasswordOrToken,
          NODE_STATE.hashedPw
        )
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
        res.status(400).send();
      }
    });

    app.post(`${GLOBALS.BASE_URL}/notification`, (req, res) => {
      if (!AUTH_SERVICE.isUserAuthenticated(NODE_STATE.loginToken, req)) {
        res.status(401).send();
        return;
      }
      const token = req.body.token;
      NODE_STATE.notificationTokens.add(token);

      DB_SERVICE.setNotificationToken(token);

      res.status(200).send();
    });
  }
}

const authResource = new AuthResource();
module.exports = authResource;
