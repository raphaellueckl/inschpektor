const bcrypt = require('bcrypt');

const NODE_STATE = require('../state/node.state');

class AuthResource {
  constructor() {
    this.hashedPw = undefined;
  }

  init(app, db) {
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
        this.hashedPw &&
        bcrypt.compareSync(deliveredPasswordOrToken, this.hashedPw)
      ) {
        NODE_STATE.loginToken = new Date()
          .toString()
          .split('')
          .reverse()
          .join('');

        const updateHostIp = db.prepare(
          `UPDATE host_node SET login_token = ? WHERE id = ?`
        );
        updateHostIp.run(NODE_STATE.loginToken, 0);

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

      const stmt = db.prepare('INSERT INTO notification (token) VALUES (?)');
      stmt.run(token);

      res.status(200).send();
    });
  }

  initializeNotificationToken(token) {
    NODE_STATE.notificationTokens.push(token);
  }

  isUserAuthenticated(validToken, request) {
    return request && validToken === request.header('Authorization');
  }
}

const authResource = new AuthResource();
module.exports = authResource;
