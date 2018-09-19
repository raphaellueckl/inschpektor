const bcrypt = require('bcrypt');

let loginToken;
let hashedPw;

class UserResource {

  get loginToken() {
    return loginToken;
  }

  get hashedPw() {
    return hashedPw;
  }

  set hashedPw(newHashedPw) {
    hashedPw = newHashedPw;
  }

  init(app, db) {
    app.post('/api/login', (req, res) => {
      const deliveredPasswordOrToken = req.body.passwordOrToken;

      if (deliveredPasswordOrToken && deliveredPasswordOrToken === loginToken) {
        // TODO maybe create a new token here
        res.json({
          token: loginToken
        });
      } else if (deliveredPasswordOrToken && hashedPw && bcrypt.compareSync(deliveredPasswordOrToken, hashedPw)) {
        loginToken = new Date().toString().split('').reverse().join('');

        // const updateHostIp = db.prepare(`UPDATE host_node (id, login_token) VALUES(?, ?)`);
        const updateHostIp = db.prepare(`UPDATE host_node SET login_token = ? WHERE id = ?`);
        updateHostIp.run(loginToken, 0);

        res.json({
          token: loginToken
        });
      } else {
        res.status(404).send();
      }
    });
  }

}

const userResource = new UserResource();
module.exports = userResource;