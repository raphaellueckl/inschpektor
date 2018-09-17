#!/usr/bin/env node

const IRI_SERVICE = require('./util/iri.service.js');

const express = require('express');
const axios = require('axios');
const history = require('connect-history-api-fallback');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const app = express();
app.set('port', (process.env.PORT || 8732));

if (process.env.NODE_ENV === 'dev') {
  console.log('Environment: DEV');
} else {
  console.log('Environment: PROD');
  app.use(history());
  app.use(express.static(__dirname + '/../dist'));
}

const neighborUsernames = new Map();

app.use(express.json());

let iriIp = null;
let hashedPw = null;
let loginToken = null;
const IRI_PORT = '14265';
const BASE_URL = '/api';
const MAX_MILESTONES_BEHIND_BEFORE_UNSYNCED = 50;
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
    iriIp = row ? row.ip : null;
    hashedPw = row ? row.hashed_pw : null;
    loginToken = row ? row.login_token : null;
  });

  db.all('select * from neighbor_data', [], (err, rows) => {
    rows.forEach(r => {
      neighborUsernames.set(r.address, r.name ? r.name : null);
    });
  });
})();

function removeNeighborFromUserNameTable(address) {
  neighborUsernames.delete(address);

  const removeNeighborEntriesWithAddress = db.prepare(`DELETE FROM neighbor_data where address=?`);
  removeNeighborEntriesWithAddress.run(address);
}

function addNeighborUserName(fullAddress, name) {
  neighborUsernames.set(fullAddress, name);

  const stmt = db.prepare('REPLACE INTO neighbor_data (address, name) VALUES (?, ?)');
  stmt.run(fullAddress, name);
}

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

app.post('/api/neighbor/nick', (req, res) => {
  const name = req.body.name;
  const fullAddress = req.body.fullAddress;

  addNeighborUserName(fullAddress, name);

  res.json({});
});

app.get('/api/neighbors', (req, res) => {
  const resultNeighbors = [];

  axios(createIriRequest(iriIp, 'getNeighbors'))
  .then(iriNeighborsResponse => {
    const activeNeighbors = iriNeighborsResponse.data.neighbors;

    db.all('SELECT * FROM neighbor ORDER BY timestamp ASC', [], (err, rows) => {
      function doCallAndPrepareCallForNext(activeNeighbors, currentIndex) {
        const activeNeighbor = activeNeighbors[currentIndex];

        axios(createIriRequest(activeNeighbor.address.split(':')[0], 'getNodeInfo'))
        .then(nodeInfoResponse => {
          let nodeInfo = nodeInfoResponse.data;
          const oldestEntry = rows.find(row => activeNeighbor.address === row.address);

          const resultNeighbor = {
            address: activeNeighbor.address,
            iriVersion: nodeInfo.appVersion,
            isSynced: nodeInfo.latestSolidSubtangleMilestoneIndex >= currentOwnNodeInfo.latestMilestoneIndex - MAX_MILESTONES_BEHIND_BEFORE_UNSYNCED,
            isActive: oldestEntry ? activeNeighbor.numberOfNewTransactions > oldestEntry.numberOfNewTransactions : null,
            protocol: activeNeighbor.connectionType,
            onlineTime: nodeInfo.time,
            isFriendlyNode: activeNeighbor.numberOfInvalidTransactions < activeNeighbor.numberOfAllTransactions / 200
          };

          const name = neighborUsernames.get(`${resultNeighbor.protocol}://${resultNeighbor.address}`);
          resultNeighbor.name = name ? name : null;

          resultNeighbors.push(resultNeighbor);

          if (++currentIndex < activeNeighbors.length) {
            doCallAndPrepareCallForNext(activeNeighbors, currentIndex);
          } else {
            res.json(resultNeighbors);
          }
        })
        .catch(error => {
          const oldestEntry = rows.find(row => activeNeighbor.address === row.address);

          const resultNeighbor = {
            address: activeNeighbor.address,
            iriVersion: null,
            isSynced: null,
            isActive: oldestEntry ? activeNeighbor.numberOfNewTransactions > oldestEntry.numberOfNewTransactions : null,
            protocol: activeNeighbor.connectionType,
            onlineTime: null,
            isFriendlyNode: activeNeighbor.numberOfInvalidTransactions < activeNeighbor.numberOfAllTransactions / 200
          };

          const name = neighborUsernames.get(`${resultNeighbor.protocol}://${resultNeighbor.address}`);
          resultNeighbor.name = name ? name : null;

          resultNeighbors.push(resultNeighbor);

          if (++currentIndex < activeNeighbors.length) {
            doCallAndPrepareCallForNext(activeNeighbors, currentIndex);
          } else {
            res.json(resultNeighbors);
          }
        });
      }

      doCallAndPrepareCallForNext(activeNeighbors, 0);
    });
  })
  .catch(error => {
    console.log('failed to get neighbors');
  });
});

app.get(`${BASE_URL}/node-info`, (req, res) => {
  let auth = req.get('Authorization');
  
  if (!iriIp) {
    res.status(404).send('NODE_NOT_SET');
  }
  axios(createIriRequest(iriIp, 'getNodeInfo'))
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

  if (!hashedPw && password) hashedPw = bcrypt.hashSync(password, SALT);

  if (password && bcrypt.compareSync(password, hashedPw)) {
    iriIp = newIriIp;
    loginToken = new Date().toString().split('').reverse().join('');
    const updateHostIp = db.prepare(`REPLACE INTO host_node (id, ip, hashed_pw, login_token) VALUES(?, ?, ?, ?)`);
    updateHostIp.run(0, iriIp, hashedPw, loginToken);

    res.json({
      token: loginToken
    });
  } else if (!password) {
    iriIp = newIriIp;
    const updateHostIp = db.prepare(`REPLACE INTO host_node (id, ip) VALUES(?, ?)`);
    updateHostIp.run(0, iriIp);

    res.status(200).send();
  } else {
    res.status(403).send();
  }
});

app.post(`${BASE_URL}/neighbor`, (req, res) => {
  const name = req.body.name;
  const fullAddress = req.body.address;

  const addNeighborRequest = createIriRequest(iriIp, 'addNeighbors');
  addNeighborRequest.data.uris = [fullAddress];

  axios(addNeighborRequest)
  .then(response => {
    const removeNeighborEntriesWithAddress = db.prepare(`DELETE FROM neighbor where address=?`);
    removeNeighborEntriesWithAddress.run(fullAddress);

    addNeighborUserName(fullAddress, name);

    res.status(200).send();
  })
  .catch(error => {
    console.log(`Couldn't add neighbor`);
    res.status(500).send();
  });
});

app.delete(`${BASE_URL}/neighbor`, (req, res) => {
  const address = req.body.address;
  const removeNeighborRequest = createIriRequest(iriIp, 'removeNeighbors');
  removeNeighborRequest.data.uris = [address];

  axios(removeNeighborRequest)
  .then(response => {
    const addressWithoutProtocolPrefix = address.substring(6);

    const removeNeighborEntriesWithAddress = db.prepare(`DELETE FROM neighbor where address=?`);
    removeNeighborEntriesWithAddress.run(addressWithoutProtocolPrefix);

    removeNeighborFromUserNameTable(address);

    res.status(200).send();
  })
  .catch(error => {
    console.log(`Couldn't remove neighbor`);
    res.status(500).send();
  });

});

app.get(`${BASE_URL}/iri-ip`, (req, res) => {
  res.send(iriIp);
});

function createIriRequest(nodeIp, command) {
  return IRI_SERVICE.createIriRequest(nodeIp, IRI_PORT, command);
}

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`);
});

async function theFetcher() {
  function fetch() {
    if (iriIp) {
      axios(createIriRequest(iriIp, 'getNeighbors'))
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

      axios(createIriRequest(iriIp, 'getNodeInfo'))
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