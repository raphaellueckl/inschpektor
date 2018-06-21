/* eslint-disable no-param-reassign */
const express = require('express');
const axios = require('axios');
const history = require('connect-history-api-fallback');
const sqlite3 = require('sqlite3').verbose();

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

    // db.run(
    //   'CREATE TRIGGER IF NOT EXISTS after_insertion_trigger' +
    //   'AFTER INSERT ON neighbors' +
    //   'BEGIN' +
    //   '    DELETE FROM neighbors' +
    //   '    WHERE uuid IN (' +
    //   '        SELECT * FROM table ORDER BY timestamp DESC, timestamp DESC LIMIT -1 OFFSET 100' +
    //   '    );' +
    //   'END;'
    // );
  })
})();

const app = express();

const iri_ip = '192.168.188.20';
const iri_port = '14265';

app.set('port', (process.env.PORT || 3000));

const BASE_URL = '/api';

if (process.env.NODE_ENV === 'production') {
  app.use(history());
  app.use(express.static(path.join(__dirname, '/dist')));
}

// A fake API token our server validates
const API_TOKEN = 'D6W69PRgCoDKgHZGJmRUNA';

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

app.get('/api/iri/getNeighbors', (req, res) => {
  axios.post(
    `http://${iri_ip}:${iri_port}`,
    {'command': 'getNodeInfo'},
    {
      headers: {
        'Content-Type': 'application/json',
        'X-IOTA-API-Version': '1'
      }
    }
  ).then(response => {
    res.json(response.data);
  });
});

app.get(`${BASE_URL}/neighbors`, function (req, res) {
  axios(createIriRequest('getNeighbors'))
  .then(response => {
    res.json(response.data.neighbors);
  })
  .catch(error => {
    res.json(mockData.neighbors);
  });
});

app.get(`${BASE_URL}/node-info`, (req, res) => {
  axios(createIriRequest('getNodeInfo'))
  .then(response => {
    res.json(response.data);
  })
  .catch(error => {
    res.json([]);
  });
});

function createIriRequest(command) {
  return {
    url: `http://${iri_ip}:${iri_port}`,
    data: {'command': command},
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'X-IOTA-API-Version': '1'
    }
  };
}

app.get(`${BASE_URL}/insertdb`, function (req, res) {

  db.serialize(function () {
    const stmt = db.prepare('INSERT INTO neighbors (address, numberOfAllTransactions, numberOfRandomTransactionRequests, numberOfNewTransactions, numberOfInvalidTransactions, numberOfSentTransactions, connectionType) VALUES (?, ?, ?, ?, ?, ?, ?)');

    mockData.neighbors.forEach(neighbor => {
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

    db.each('SELECT rowid as id, * FROM neighbors', function (err, row) {
      console.log(row.id + ': ' + row.address + ' time: ' + row.timestamp);
    });
  });

  res.json({});

});

app.get(`${BASE_URL}/getdb`, function (req, res) {

  // db.serialize(function () {
  //   const fetched = [];
  //   db.each('SELECT rowid AS id, address, timestamp FROM neighbors', function (err, row) {
  //     fetched.push(`${row.id}:${row.address}`);
  //     console.log(row.id + ' ' + row.address + ' time: ' + row.timestamp);
  //   });
  //   res.json(fetched);
  // });

  db.each('SELECT rowid AS id, address FROM neighbors', function (err, row) {
    // console.log(row.id + ': ' + row.address);
  });

  res.json({});

});


app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});

const mockData =
  {
    'neighbors': [
      {
        'address': 'MOCK_173.249.39.22:14600',
        'numberOfAllTransactions': 29145,
        'numberOfRandomTransactionRequests': 8382,
        'numberOfNewTransactions': 12575,
        'numberOfInvalidTransactions': 0,
        'numberOfSentTransactions': 49310,
        'connectionType': 'udp'
      },
      {
        'address': 'MOCK_104.225.220.47:14600',
        'numberOfAllTransactions': 17782,
        'numberOfRandomTransactionRequests': 2208,
        'numberOfNewTransactions': 4027,
        'numberOfInvalidTransactions': 0,
        'numberOfSentTransactions': 43203,
        'connectionType': 'udp'
      },
      {
        'address': 'MOCK_vmi173376.contaboserver.net:14600',
        'numberOfAllTransactions': 31250,
        'numberOfRandomTransactionRequests': 7608,
        'numberOfNewTransactions': 14194,
        'numberOfInvalidTransactions': 0,
        'numberOfSentTransactions': 48576,
        'connectionType': 'udp'
      },
      {
        'address': 'MOCK_iotahosting.org:14600',
        'numberOfAllTransactions': 22654,
        'numberOfRandomTransactionRequests': 4202,
        'numberOfNewTransactions': 5189,
        'numberOfInvalidTransactions': 0,
        'numberOfSentTransactions': 45221,
        'connectionType': 'udp'
      },
      {
        'address': 'MOCK_188.165.203.172:14600',
        'numberOfAllTransactions': 1903,
        'numberOfRandomTransactionRequests': 284,
        'numberOfNewTransactions': 368,
        'numberOfInvalidTransactions': 0,
        'numberOfSentTransactions': 2538,
        'connectionType': 'udp'
      },
      {
        'address': 'MOCK_78.46.248.142:14600',
        'numberOfAllTransactions': 210,
        'numberOfRandomTransactionRequests': 44,
        'numberOfNewTransactions': 23,
        'numberOfInvalidTransactions': 0,
        'numberOfSentTransactions': 2206,
        'connectionType': 'udp'
      },
      {
        'address': 'MOCK_71.206.23.175:14600',
        'numberOfAllTransactions': 1077,
        'numberOfRandomTransactionRequests': 128,
        'numberOfNewTransactions': 44,
        'numberOfInvalidTransactions': 0,
        'numberOfSentTransactions': 1507,
        'connectionType': 'udp'
      },
      {
        'address': 'MOCK_195.201.24.253:14600',
        'numberOfAllTransactions': 701,
        'numberOfRandomTransactionRequests': 13,
        'numberOfNewTransactions': 197,
        'numberOfInvalidTransactions': 0,
        'numberOfSentTransactions': 907,
        'connectionType': 'udp'
      },
      {
        'address': 'MOCK_111.231.86.86:14600',
        'numberOfAllTransactions': 496,
        'numberOfRandomTransactionRequests': 13,
        'numberOfNewTransactions': 24,
        'numberOfInvalidTransactions': 0,
        'numberOfSentTransactions': 576,
        'connectionType': 'udp'
      }
    ],
    'duration': 0
  };

async function theFetcher() {
  function fetch() {
    axios(createIriRequest('getNeighbors'))
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
    .catch(error => console.log(error));
  }

  while (true) {
    // fetch();

    let timekeeper = new Promise((resolve, reject) => {
      setTimeout(() => resolve(), 15000);
      // setTimeout(() => resolve());
    });

    let result = await timekeeper;
  }
}

theFetcher();