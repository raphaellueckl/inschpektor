require('../../node_modules/console-stamp')(console, { pattern: 'dd/mm/yyyy HH:MM:ss.l' });
const IRI_SERVICE = require('./iri.util');
const USER_RESOURCE = require('../resource/user.resource');
const NODE_STATE = require('../state/node.state');
const NEIGHBOR_RESOURCE = require('../resource/neighbor.resource');

class DbUtil {

  createTables(db) {
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
        protocol TEXT,
        ip TEXT,
        port TEXT,
        hashed_pw TEXT,
        iri_path TEXT,
        login_token TEXT,
        restart_node_command TEXT
      )`
      );

      db.run(
        `CREATE TABLE IF NOT EXISTS neighbor_data (
        address TEXT PRIMARY KEY,
        name TEXT
      )`
      );
    });
  }

  initializeState(db) {
    const sql = 'select * from host_node';
    db.get(sql, [], (err, row) => {
      IRI_SERVICE.protocol = row ? row.protocol : null;
      IRI_SERVICE.iriIp = row ? row.ip : null;
      IRI_SERVICE.iriPort = row ? row.port : null;
      USER_RESOURCE.hashedPw = row ? row.hashed_pw : null;
      USER_RESOURCE.loginToken = row ? row.login_token : null;
      IRI_SERVICE.iriFileLocation = row ? row.iri_path : null;
      NODE_STATE.restartNodeCommand = row ? row.restart_node_command : null;
    });

    db.all('select * from neighbor_data', [], (err, rows) => {
      rows.forEach(r => {
        NEIGHBOR_RESOURCE.intitializeNeighborUsernname(r.address, r.name ? r.name : null);
      });
    });
  }

  dropAllTables(db) {
    return new Promise((resolve, reject) => {
      db.run('drop table IF EXISTS neighbor', (err) => {
        if (err) {
          console.log('Error deleting neighbor table', err.message);
          reject();
          return;
        }
        db.run('drop table IF EXISTS host_node', (err) => {
          if (err) {
            console.log('Error deleting host_node table', err.message);
            reject();
            return;
          }
          db.run('drop table IF EXISTS neighbor_data', (err) => {
            if (err) {
              console.log('Error deleting host_node table', err.message);
              reject();
              return;
            }
            resolve();
          });
        });
      });
    });
  }

}

const dbUtil = new DbUtil();
module.exports = dbUtil;