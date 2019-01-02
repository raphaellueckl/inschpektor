#!/usr/bin/env node

require('console-stamp')(console, { pattern: 'dd/mm/yyyy HH:MM:ss.l' });
const fs = require('fs');

const express = require('express');
const axios = require('axios');
const history = require('connect-history-api-fallback');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const IRI_SERVICE = require('./util/iri.util.js');
const DB_UTIL = require('./util/db.util.js');
const AUTH_UTIL = require('./util/auth.util.js');
const USER_RESOURCE = require('./resource/user.resource.js');
const NODE_RESOURCE = require('./resource/node.resource.js');
const NEIGHBOR_RESOURCE = require('./resource/neighbor.resource.js');

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
        NODE_RESOURCE.currentOwnNodeInfo = nodeInfoResponse.data;
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