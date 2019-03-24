const bcrypt = require('bcrypt');

class UserResource {
  constructor() {
    this.loginToken = undefined;
    this.hashedPw = undefined;
    this.notificationTokens = [];
  }

  init(app, db) {
    app.post('/api/login', (req, res) => {
      const deliveredPasswordOrToken = req.body.passwordOrToken;

      if (
        deliveredPasswordOrToken &&
        deliveredPasswordOrToken === this.loginToken
      ) {
        res.json({
          token: this.loginToken
        });
      } else if (
        deliveredPasswordOrToken &&
        this.hashedPw &&
        bcrypt.compareSync(deliveredPasswordOrToken, this.hashedPw)
      ) {
        this.loginToken = new Date()
          .toString()
          .split('')
          .reverse()
          .join('');

        const updateHostIp = db.prepare(
          `UPDATE host_node SET login_token = ? WHERE id = ?`
        );
        updateHostIp.run(this.loginToken, 0);

        res.json({
          token: this.loginToken
        });
      } else {
        res.status(404).send();
      }
    });

    app.post('/api/notification', (req, res) => {
      const token = req.body.token;
      this.notificationTokens.push(token);

      res.status(200).send();
    });
  }

  initializeNotificationTokens(token) {
    this.notificationTokens.push(token);
  }
}

const userResource = new UserResource();
module.exports = userResource;
