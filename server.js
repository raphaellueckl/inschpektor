const express = require('express');
const axios = require('axios');
const history = require('connect-history-api-fallback');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.set('port', (process.env.PORT || 3000));

if (process.env.NODE_ENV === 'production') {
  app.use(history());
  app.use(express.static(path.join(__dirname, '/dist')));
}

app.use(express.json());

// const iriIp = '192.168.188.20';
let iriIp = null;
const IRI_PORT = '14265';
const BASE_URL = '/api';
const MAX_MILESTONES_BEHIND_BEFORE_UNSYNCED = 50;

let currentOwnNodeInfo = {};

// A fake API token our server validates
const API_TOKEN = 'D6W69PRgCoDKgHZGJmRUNA';

const db = new sqlite3.Database('db');
(function createTables() {
  db.serialize(() => {
    db.run(
      'CREATE TABLE IF NOT EXISTS neighbors (' +
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
      'CREATE TABLE IF NOT EXISTS host_node (' +
      'ID INTEGER' +
      'ip TEXT' +
      ')'
    );

    // db.run(
    //   `CREATE TRIGGER IF NOT EXISTS after_insertion_trigger
    //   AFTER INSERT ON neighbors
    //   BEGIN
    //     DELETE FROM neighbors WHERE rowid in (
    //       SELECT rowid FROM neighbors
    //       INNER JOIN (
    //         SELECT rowid, address, timestamp, ROW_NUMBER() OVER (PARTITION BY address ORDER BY timestamp
    //       ) as LegacyNr
    //       FROM neighbors
    //       ) as oldest_allowed_tmstmp_per_adress
    //       ON
    //       oldest_tmstmp_per_adress.id = neighbors.rowid
    //       and oldest_tmstmp_per_adress.LegacyNr > 100
    //     );
    //     END;`
    // );
  });
})();

// Make things more noticeable in the UI by introducing a fake delay
// to logins
const FAKE_DELAY = 500; // ms
app.post('/api/login', (req, res) => {
  setTimeout(() => (
    res.json({
      success: true,
      token: API_TOKEN,
    })
  ), FAKE_DELAY);
});

app.get('/api/neighbors', (req, res) => {
  const resultNeighbors = [];

  axios(createIriRequest(iriIp, 'getNeighbors'))
  .then(iriNeighborsResponse => {
    const activeNeighbors = iriNeighborsResponse.data.neighbors;

    db.all('SELECT * FROM neighbors ORDER BY timestamp ASC', [], (err, rows) => {
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

// set hostnode ip
app.post(`${BASE_URL}/host-node-ip`, (req, res) => {
  iriIp = req.body.nodeIp;

  const updateHostIp = db.prepare(`INSERT INTO host_node (ID, ip)
  VALUES(0, ?)
  ON CONFLICT(ID)
  DO UPDATE SET ip=iriIp`);

  updateHostIp.run(iriIp);

  updateHostIp.finalize();

  res.status(200).send();
});

app.put(`${BASE_URL}/new-node-ip`, (req, res) => {
  // req.json();
});

function createIriRequest(nodeIp, command) {
  return {
    url: `http://${nodeIp}:${IRI_PORT}`,
    data: {'command': command},
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'X-IOTA-API-Version': '1'
    },
    timeout: 250
  };
}

app.get(`${BASE_URL}/insertdb`, function (req, res) {

  db.serialize(function () {
    const stmt = db.prepare('INSERT INTO neighbors (address, numberOfAllTransactions, numberOfRandomTransactionRequests, numberOfNewTransactions, numberOfInvalidTransactions, numberOfSentTransactions, connectionType) VALUES (?, ?, ?, ?, ?, ?, ?)');

    // mockData.neighbors.forEach(neighbor => {
    //   stmt.run(
    //     neighbor.address,
    //     neighbor.numberOfAllTransactions,
    //     neighbor.numberOfRandomTransactionRequests,
    //     neighbor.numberOfNewTransactions,
    //     neighbor.numberOfInvalidTransactions,
    //     neighbor.numberOfSentTransactions,
    //     neighbor.connectionType);
    // });

    stmt.finalize();

    db.each('SELECT rowid as id, * FROM neighbors', function (err, row) {
      console.log(row.id + ': ' + row.address + ' time: ' + row.timestamp);
    });
  });

  res.json({});

});

app.get(`${BASE_URL}/getdb`, function (req, res) {
  db.all('SELECT * FROM neighbors ORDER BY timestamp ASC', [], (err, rows) => {
    res.json(rows);
  });
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});

async function theFetcher() {
  function fetch() {
    axios(createIriRequest(iriIp, 'getNeighbors'))
    .then(response => {
      const neighbors = response.data.neighbors;

      const stmt = db.prepare('INSERT INTO neighbors (address, numberOfAllTransactions, numberOfRandomTransactionRequests, numberOfNewTransactions, numberOfInvalidTransactions, numberOfSentTransactions, connectionType) VALUES (?, ?, ?, ?, ?, ?, ?)');
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

  while (true) {
    fetch();

    let timekeeper = new Promise((resolve, reject) => {
      setTimeout(() => resolve(), 15000);
    });

    let result = await timekeeper;
  }
}

theFetcher();