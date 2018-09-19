#!/usr/bin/env node

const IRI_SERVICE = require('./util/iri.util.js');
const USER_RESOURCE = require('./resource/user.resource.js');
const NEIGHBOR_RESOURCE = require('./resource/neighbor.resource.js');
const NODE_RESOURCE = require('./resource/node.resource.js');

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

let currentOwnNodeInfo = {};

const db = new sqlite3.Database(__dirname + '/db');

USER_RESOURCE.init(app, db);
NEIGHBOR_RESOURCE.init(app, db);
NODE_RESOURCE.init(app, db);

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
    NODE_RESOURCE.loginToken = row ? row.login_token : null;
  });

  db.all('select * from neighbor_data', [], (err, rows) => {
    rows.forEach(r => {
      neighborUsernames.set(r.address, r.name ? r.name : null);
    });
  });
})();

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