#!/usr/bin/env node

const express = require('express');
const axios = require('axios');
const history = require('connect-history-api-fallback');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.set('port', (process.env.PORT || 8732));

if (process.env.NODE_ENV === 'prod') {
  console.log('Environment: PROD');
  app.use(history());
  app.use(express.static(__dirname + '/dist'));
} else {
  console.log('Environment: DEV');
}

app.use(express.json());

let iriIp = null;
const IRI_PORT = '14265';
const BASE_URL = '/api';
const MAX_MILESTONES_BEHIND_BEFORE_UNSYNCED = 50;

let currentOwnNodeInfo = {};

// Fake API token for login
const API_TOKEN = 'D6W69PRgCoDKgHZGJmRUNA';

const db = new sqlite3.Database('db');
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
        ID INTEGER PRIMARY KEY,
        ip TEXT
      )`
    );

    // db.run(
    //   `CREATE TRIGGER IF NOT EXISTS after_insertion_trigger
    //   AFTER INSERT ON neighbor
    //   BEGIN
    //     DELETE FROM neighbor WHERE rowid in (
    //       SELECT rowid FROM neighbor
    //       INNER JOIN (
    //         SELECT rowid, address, timestamp, ROW_NUMBER() OVER (PARTITION BY address ORDER BY timestamp
    //       ) as LegacyNr
    //       FROM neighbor
    //       ) as oldest_allowed_tmstmp_per_adress
    //       ON
    //       oldest_tmstmp_per_adress.id = neighbor.rowid
    //       and oldest_tmstmp_per_adress.LegacyNr > 100
    //     );
    //     END;`
    // );
  });
})();

(function initializeState() {
  const sql = 'select * from host_node';
  db.get(sql, [], (err, row) => {
    iriIp = row ? row.ip : null;
  });
})();

const FAKE_DELAY = 500; // ms
app.post('/api/login', (req, res) => {
    res.json({
      success: true,
      token: API_TOKEN,
    })
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

app.get(`${BASE_URL}/neighbors`, function (req, res) {
  axios(createIriRequest(iriIp, 'getNeighbors'))
  .then(response => {
    res.json(response.data.neighbors);
  })
  .catch(error => {
    // res.json(mockData.neighbors);
  });
});

app.get(`${BASE_URL}/node-info`, (req, res) => {
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
  iriIp = req.body.nodeIp;

  const updateHostIp = db.prepare(`REPLACE INTO host_node (ID, ip) VALUES(?, ?)`);

  updateHostIp.run(0, iriIp);

  res.status(200).send();
});

app.delete(`${BASE_URL}/neighbor`, (req, res) => {
  const address = req.body.address;
  console.log('incoming address: ' + address);

  const removeNeighborRequest = createIriRequest(iriIp, 'removeNeighbors');
  removeNeighborRequest.data.uris = [`udp://${address}:14600`];

  axios(removeNeighborRequest)
  .then(response => {
    console.log('Removed neighbor, status: ', response.status);

    const removeNeighborEntriesWithAddress = db.prepare(`DELETE FROM neighbor where address=?`);
    removeNeighborEntriesWithAddress.run(address + ':14265');

    res.status(200).send();
  })
  .catch(error => {
    console.log(`Couldn't remove neighbor`);
    res.status(500).send();
  });

});

app.post(`${BASE_URL}/neighbor`, (req, res) => {
  const name = req.body.name;
  const address = req.body.address;
  console.log(name, address);

  const removeNeighborRequest = createIriRequest(iriIp, 'addNeighbors');
  removeNeighborRequest.data.uris = [address];

  axios(removeNeighborRequest)
  .then(response => {
    console.log('Added neighbor, status: ', response.status);

    const removeNeighborEntriesWithAddress = db.prepare(`DELETE FROM neighbor where address=?`);
    removeNeighborEntriesWithAddress.run(address + ':14265');

    res.status(200).send();
  })
  .catch(error => {
    console.log(`Couldn't add neighbor`);
    res.status(500).send();
  });
});

// app.get(`${BASE_URL}/glimpse`, function (req, res) {
//   db.all('SELECT * FROM neighbor as ne GROUP BY ne.address', [], (err, rows) => {
//     console.log(rows);
//     res.json(rows.length);
//   });
// });

function createIriRequest(nodeIp, command) {
  return {
    url: `http://${nodeIp}:${IRI_PORT}`,
    data: {command},
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'X-IOTA-API-Version': '1'
    },
    timeout: 250
  };
}

app.get('/', function(req, res) {
  res.sendfile('./dist/index.html');
});

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