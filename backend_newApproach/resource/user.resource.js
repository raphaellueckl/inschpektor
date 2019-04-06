const bcrypt = require('bcrypt');

const NODE_STATE = require('../state/node.state');
const DB_SERVICE = require('../service/db.service');

console.log('user');
// console.log(DB_SERVICE);
// console.log(NODE_STATE);

class UserResource {
  init(app) {
    app.post('/api/login', (req, res) => {
      console.log('here');
      const deliveredPasswordOrToken = req.body.passwordOrToken;
      console.log(deliveredPasswordOrToken);
      console.log(NODE_STATE.loginToken);
      console.log(NODE_STATE.hashedPw);

      // deliveredPasswordOrToken === token => auto-login
      if (
        deliveredPasswordOrToken &&
        deliveredPasswordOrToken === NODE_STATE.loginToken
      ) {
        res.json({
          token: NODE_STATE.loginToken
        });
        // Login over the login mask
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

        DB_SERVICE.updateHostNodeIp();

        console.log('ok');
        res.json({
          token: NODE_STATE.loginToken
        });
      } else {
        console.log('crap');
        res.status(404).send();
      }
    });

    app.post('/api/notification', (req, res) => {
      const token = req.body.token;
      NODE_STATE.notificationTokens.push(token);

      DB_SERVICE.addNotificationToken(token);

      res.status(200).send();
    });
  }

  isUserAuthenticated(validToken, request) {
    return request && validToken === request.header('Authorization');
  }
}

const userResource = new UserResource();
module.exports = userResource;
