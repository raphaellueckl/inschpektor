let loginToken;

class UserResource {

  get loginToken() {
    return loginToken;
  }

  init(app) {
    app.post('/api/login', (req, res) => {
      const deliveredPasswordOrToken = req.body.passwordOrToken;

      if (deliveredPasswordOrToken && deliveredPasswordOrToken === loginToken) {
        // TODO maybe create a new token here
        res.json({
          token: loginToken
        });
      } else if (deliveredPasswordOrToken && hashedPw && bcrypt.compareSync(deliveredPasswordOrToken, hashedPw)) {
        loginToken = new Date().toString().split('').reverse().join('');

        const updateHostIp = db.prepare(`REPLACE INTO host_node (id, login_token) VALUES(?, ?)`);
        updateHostIp.run(0, loginToken);

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