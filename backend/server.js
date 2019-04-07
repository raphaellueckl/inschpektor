#!/usr/bin/env node

require('../node_modules/console-stamp')(console, {
  pattern: 'dd/mm/yyyy HH:MM:ss.l'
});

const express = require('express');
const axios = require('axios');
const history = require('connect-history-api-fallback');

const NODE_STATE = require('./state/node.state');
const DB_SERVICE = require('./service/db.service');
const IRI_SERVICE = require('./service/iri.service');
const AUTH_SERVICE = require('./service/auth.service');
const AUTH_RESOURCE = require('./resource/auth.resource');
const NEIGHBOR_RESOURCE = require('./resource/neighbor.resource');
const NODE_RESOURCE = require('./resource/node.resource');

const app = express();
app.set('port', process.env.PORT || 8732);
app.use(express.json());
if (process.env.NODE_ENV === 'dev') {
  console.log('Environment: DEV');
} else {
  console.log('Environment: PROD');
  app.use(history());
  app.use(express.static(__dirname + '/../dist'));
}

AUTH_RESOURCE.init(app);
NEIGHBOR_RESOURCE.init(app);
NODE_RESOURCE.init(app);

DB_SERVICE.createTables();
DB_SERVICE.initializeState();

app.post(`/api/reset-database`, async (req, res) => {
  if (!AUTH_SERVICE.isUserAuthenticated(NODE_STATE.loginToken, req)) {
    res.status(401).send();
    return;
  }
  await DB_SERVICE.dropAllTables();
  DB_SERVICE.createTables();
  DB_SERVICE.initializeState();
  res.status(200).send();
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`);
});

// async function theFetcher() {
//   function fetchNeighborsAndNodeInfo() {
//     if (NODE_STATE.iriIp) {
//       axios(IRI_SERVICE.createIriRequest('getNeighbors'))
//         .then(response => {
//           const neighbors = response.data.neighbors;

//           const stmt = db.prepare(
//             'INSERT INTO neighbor (address, numberOfAllTransactions, numberOfRandomTransactionRequests, numberOfNewTransactions, numberOfInvalidTransactions, numberOfSentTransactions, connectionType) VALUES (?, ?, ?, ?, ?, ?, ?)'
//           );
//           neighbors.forEach(neighbor => {
//             stmt.run(
//               neighbor.address,
//               neighbor.numberOfAllTransactions,
//               neighbor.numberOfRandomTransactionRequests,
//               neighbor.numberOfNewTransactions,
//               neighbor.numberOfInvalidTransactions,
//               neighbor.numberOfSentTransactions,
//               neighbor.connectionType
//             );
//           });
//           stmt.finalize();

//           db.run(
//             `DELETE FROM neighbor WHERE timestamp <= datetime('now', '-30 minutes')`
//           );
//         })
//         .catch(error =>
//           console.log('Failed to fetch neighbors of own node.', error.message)
//         );

//       axios(IRI_SERVICE.createIriRequest('getNodeInfo'))
//         .then(nodeInfoResponse => {
//           NODE_STATE.currentOwnNodeInfo = nodeInfoResponse.data;
//         })
//         .catch(error =>
//           console.log('Failed to fetch own node info.', error.message)
//         );
//     }
//   }

//   while (true) {
//     fetchNeighborsAndNodeInfo();

//     let timekeeper = new Promise((resolve, reject) => {
//       setTimeout(() => resolve(), 15000);
//     });

//     await timekeeper;
//   }
// }

// theFetcher();
