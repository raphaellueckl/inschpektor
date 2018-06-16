/* eslint-disable no-param-reassign */
const express = require('express');
const axios = require('axios');
const history = require('connect-history-api-fallback');

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

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db');

app.get(`${BASE_URL}/insertdb`, function (req, res) {

  db.serialize(function () {
    // db.run('CREATE TABLE lorem (info TEXT)')
    const stmt = db.prepare('INSERT INTO lorem VALUES (?)')

    for (let i = 0; i < 10; i++) {
      stmt.run('Ipsum ' + i)
    }

    stmt.finalize()

    db.each('SELECT rowid AS id, info FROM lorem', function (err, row) {
      console.log(row.id + ': ' + row.info)
    })
  })

  res.json({})

});

app.get(`${BASE_URL}/getdb`, function (req, res) {

  db.serialize(function () {
    db.each('SELECT rowid AS id, info FROM lorem', function (err, row) {
      console.log(row.id + ': ' + row.info)
    })
  })

  res.json({})

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
  }