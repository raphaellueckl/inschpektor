#!/usr/bin/env node

require('../node_modules/console-stamp')(console, { pattern: 'dd/mm/yyyy HH:MM:ss.l' });

const express = require('express');
const axios = require('axios');
const history = require('connect-history-api-fallback');
const sqlite3 = require('sqlite3').verbose();

const IRI_SERVICE = require('./util/iri.util');
const DB_UTIL = require('./util/db.util');
const AUTH_UTIL = require('./util/auth.util');
const USER_RESOURCE = require('./resource/user.resource');
const NODE_RESOURCE = require('./resource/node.resource');
const NODE_STATE = require('./state/node.state');
const NEIGHBOR_RESOURCE = require('./resource/neighbor.resource');

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

let db = new sqlite3.Database(__dirname + '/db');

USER_RESOURCE.init(app, db);
NODE_RESOURCE.init(app, db);
NEIGHBOR_RESOURCE.init(app, db);

DB_UTIL.createTables(db);
DB_UTIL.initializeState(db);

app.post(`/api/reset-database`, async (req, res) => {
  if (!AUTH_UTIL.isUserAuthenticated(USER_RESOURCE.loginToken, req)) {
    res.status(401).send();
    return;
  }
  await DB_UTIL.dropAllTables(db);
  db = new sqlite3.Database(__dirname + '/db');
  DB_UTIL.createTables(db);
  DB_UTIL.initializeState(db);
  res.status(200).send();
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`);
});

async function theFetcher() {
  function fetch() {
    if (IRI_SERVICE.iriIp) {
      axios(IRI_SERVICE.createIriRequest('getNeighbors'))
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
      .catch(error => console.log('Failed to fetch neighbors of own node.', error.message));

      axios(IRI_SERVICE.createIriRequest('getNodeInfo'))
      .then(nodeInfoResponse => {
        NODE_STATE.currentOwnNodeInfo = nodeInfoResponse.data;
      })
      .catch(error => console.log('Failed to fetch own node info.', error.message));
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