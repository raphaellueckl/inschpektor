#!/usr/bin/env node

const IRI_SERVICE = require('./util/iri.util.js');
const USER_RESOURCE = require('./resource/user.resource.js');
const NEIGHBOR_RESOURCE = require('./resource/neighbor.resource.js');

const express = require('express');
const axios = require('axios');
const history = require('connect-history-api-fallback');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const app = express();
app.set('port', (process.env.PORT || 8732));
app.use(express.json());

if (process.env.NODE_ENV === 'dev') {
  console.log('Environment: DEV');
} else {
  console.log('Environment: PROD');
  app.use(history());
  app.use(express.static(__dirname + '/../dist'));
}

const neighborUsernames = new Map();

let loginToken = null;
const BASE_URL = '/api';
const SALT = 11;

let currentOwnNodeInfo = {};

const db = new sqlite3.Database(__dirname + '/db');
(function createTables() {
  db.serialize(() => {
    db.run(
      'CREATE TABLE IF NOT EXISTS neighbor (' +
      'timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,' +
      'address TEXT,' +
      'numberOfAllTransactions INTEGER,' +
      'numberOfRandomTransactionRequests INTEGER,' +
      'numberOfNewTransactions INTEGER,' +
      'numberOfInvalidTransactions INTEGER,' +
      'numberOfSentTransactions INTEGER,' +
      'connectionType TEXT' +
      ')'
    );

    db.run(
        `CREATE TABLE IF NOT EXISTS host_node (
        id INTEGER PRIMARY KEY,
        ip TEXT,
        hashed_pw TEXT,
        login_token TEXT
      )`
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS neighbor_data (
        address TEXT PRIMARY KEY,
        name TEXT
      )`
    );
  });
})();

(function initializeState() {
  const sql = 'select * from host_node';
  db.get(sql, [], (err, row) => {
    IRI_SERVICE.iriIp = row ? row.ip : null;
    USER_RESOURCE.hashedPw = row ? row.hashed_pw : null;
    loginToken = row ? row.login_token : null;
  });

  db.all('select * from neighbor_data', [], (err, rows) => {
    rows.forEach(r => {
      neighborUsernames.set(r.address, r.name ? r.name : null);
    });
  });
})();

USER_RESOURCE.init(app, db);
NEIGHBOR_RESOURCE.init(app, db);

app.get(`${BASE_URL}/node-info`, (req, res) => {
  let auth = req.get('Authorization');

  if (!IRI_SERVICE.iriIp) {
    res.status(404).send('NODE_NOT_SET');
  }
  axios(IRI_SERVICE.createIriRequest(IRI_SERVICE.iriIp, IRI_SERVICE.IRI_PORT, 'getNodeInfo'))
  .then(response => {
    res.json(response.data);
  })
  .catch(error => {
    res.status(500).send('NODE_INFO_INANCCESSIBLE');
  });
});

app.post(`${BASE_URL}/host-node-ip`, (req, res) => {
  const newIriIp = req.body.nodeIp;
  const password = req.body.password;

  if (!newIriIp) res.status(404).send();

  if (!USER_RESOURCE.hashedPw && password) USER_RESOURCE.hashedPw = bcrypt.hashSync(password, SALT);

  if (password && bcrypt.compareSync(password, USER_RESOURCE.hashedPw)) {
    IRI_SERVICE.iriIp = newIriIp;
    loginToken = new Date().toString().split('').reverse().join('');

    const updateHostIp = db.prepare(`REPLACE INTO host_node (id, ip, hashed_pw, login_token) VALUES(?, ?, ?, ?)`);
    updateHostIp.run(0, IRI_SERVICE.iriIp, USER_RESOURCE.hashedPw, loginToken);

    res.json({
      token: loginToken
    });
  } else if (!password) {
    IRI_SERVICE.iriIp = newIriIp;
    const updateHostIp = db.prepare(`UPDATE host_node SET ip = ? WHERE id = ?`);
    updateHostIp.run(IRI_SERVICE.iriIp, 0);

    res.status(200).send();
  } else {
    res.status(403).send();
  }
});

app.get(`${BASE_URL}/iri-ip`, (req, res) => {
  res.send(IRI_SERVICE.iriIp);
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`);
});

async function theFetcher() {
  function fetch() {
    if (IRI_SERVICE.iriIp) {
      axios(IRI_SERVICE.createIriRequest(IRI_SERVICE.iriIp, IRI_SERVICE.IRI_PORT, 'getNeighbors'))
      .then(response => {
        const neighbors = response.data.neighbors;

        const stmt = db.prepare('INSERT INTO neighbor (address, numberOfAllTransactions, numberOfRandomTransactionRequests, numberOfNewTransactions, numberOfInvalidTransactions, numberOfSentTransactions, connectionType) VALUES (?, ?, ?, ?, ?, ?, ?)');
        neighbors.forEach((neighbor) => {
          stmt.run(
            neighbor.address,
            neighbor.numberOfAllTransactions,
            neighbor.numberOfRandomTransactionRequests,
            neighbor.numberOfNewTransactions,
            neighbor.numberOfInvalidTransactions,
            neighbor.numberOfSentTransactions,
            neighbor.connectionType);
        });
        stmt.finalize();

        db.run(`DELETE FROM neighbor WHERE timestamp <= datetime('now', '-30 minutes')`);
      })
      .catch(error => console.log('Failed to fetch neighbors of own node.'));

      axios(IRI_SERVICE.createIriRequest(IRI_SERVICE.iriIp, IRI_SERVICE.IRI_PORT, 'getNodeInfo'))
      .then(nodeInfoResponse => {
        currentOwnNodeInfo = nodeInfoResponse.data;
      })
      .catch(error => console.log('Failed to fetch own node info.'));
    }
  }

  while (true) {
    fetch();

    let timekeeper = new Promise((resolve, reject) => {
      setTimeout(() => resolve(), 15000);
    });

    let result = await timekeeper;
  }
}

theFetcher();