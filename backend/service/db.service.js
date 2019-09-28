require('console-stamp')(console, {
  pattern: 'dd/mm/yyyy HH:MM:ss.l'
});
const NODE_STATE = require('../state/node.state');

class DbService {
  constructor() {
    const sqlite3 = require('sqlite3').verbose();
    this.db = new sqlite3.Database(__dirname + '/../db');
  }

  createAndInitializeTables(initHostData) {
    const db = this.db;
    db.serialize(() => {
      db.run(
        'CREATE TABLE IF NOT EXISTS neighbor (' +
        'timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,' +
        'address TEXT,' +
        'domain TEXT,' +
        'numberOfAllTransactions INTEGER,' +
        'numberOfRandomTransactionRequests INTEGER,' +
        'numberOfNewTransactions INTEGER,' +
        'numberOfInvalidTransactions INTEGER,' +
        'numberOfStaleTransactions INTEGER,' +
        'numberOfSentTransactions INTEGER,' +
        'numberOfDroppedSentPackets INTEGER,' +
        'connected INTEGER,' + // Boolean is INTEGER in Sqlite3
          'iriVersion TEXT,' +
          'isActive INTEGER,' +
          'isFriendlyNode INTEGER,' +
          'isSynced INTEGER,' +
          'milestone TEXT,' +
          'name TEXT,' +
          'onlineTime INTEGER,' +
          'ping INTEGER,' +
          'port TEXT' +
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
        domainWithConnectionPort TEXT PRIMARY KEY,
        name TEXT,
        port INTEGER
      )`
      );

      db.run(
        `CREATE TABLE IF NOT EXISTS notification (token TEXT, UNIQUE(token))`
      );

      const sql = 'select * from host_node';
      db.get(sql, [], (err, row) => {
        NODE_STATE.protocol = row ? row.protocol : null;
        NODE_STATE.iriIp = row ? row.ip : null;
        NODE_STATE.iriPort = row ? row.port : null;
        NODE_STATE.hashedPw = row ? row.hashed_pw : null;
        NODE_STATE.loginToken = row ? row.login_token : null;
        NODE_STATE.iriFileLocation = row ? row.iri_path : null;
        NODE_STATE.restartNodeCommand = row ? row.restart_node_command : null;
      });

      db.all('select * from neighbor_data', [], (err, rows) => {
        if (err) {
          console.log('select * from neighbor_data failed', err.message);
          return;
        }
        if (rows) {
          rows.forEach(r => {
            this.intitializeNeighborUsernname(
              r.domainWithConnectionPort,
              r.name ? r.name : null
            );
            this.intitializeNeighborIriMainPort(
              r.domain,
              r.port ? r.port : null
            );
          });
        }
      });

      db.all('select * from notification', [], (err, rows) => {
        if (err) {
          console.log('select * from notification failed', err.message);
          return;
        }
        if (rows) {
          rows.forEach(r => {
            NODE_STATE.notificationTokens.add(r.token);
          });
        }
      });

      if (initHostData) {
        const hashedPassword = AUTH_SERVICE.hashPassword(initHostData.PASSWORD);
        const initHostStatement = this.db.prepare(
          'REPLACE INTO host_node (id, protocol, ip, port, hashed_pw, iri_path, login_token, restart_node_command) VALUES(?, ?, ?, ?, ?, ?, ?, ?)'
        );
        initHostStatement.run(
          0,
          initHostData.IRI_PROTOCOL,
          initHostData.IRI_ADDRESS,
          initHostData.IRI_PORT,
          hashedPassword,
          initHostData.IRI_CONFIG_PATH,
          NODE_STATE.loginToken,
          initHostData.RESTART_IRI_COMMAND
        );
        initHostStatement.finalize();

        NODE_STATE.protocol = initHostData.IRI_PROTOCOL;
        NODE_STATE.iriIp = initHostData.IRI_ADDRESS;
        NODE_STATE.iriPort = initHostData.IRI_PORT;
        NODE_STATE.hashedPw = hashedPassword;
        NODE_STATE.iriFileLocation = initHostData.IRI_CONFIG_PATH;
        NODE_STATE.restartNodeCommand = initHostData.RESTART_IRI_COMMAND;
      }
    });
  }

  intitializeNeighborUsernname(domainWithConnectionPort, name) {
    const currentAdditionalData = NODE_STATE.neighborAdditionalData.get(
      domainWithConnectionPort
    );
    NODE_STATE.neighborAdditionalData.set(domainWithConnectionPort, {
      name,
      port:
        currentAdditionalData && currentAdditionalData.port
          ? currentAdditionalData.port
          : null
    });
  }

  intitializeNeighborIriMainPort(domainWithConnectionPort, port) {
    const currentAdditionalData = NODE_STATE.neighborAdditionalData.get(
      domainWithConnectionPort
    );
    NODE_STATE.neighborAdditionalData.set(domainWithConnectionPort, {
      name:
        currentAdditionalData && currentAdditionalData.name
          ? currentAdditionalData.name
          : null,
      port
    });
  }

  dropAllTables() {
    const db = this.db;
    return new Promise((resolve, reject) => {
      db.run('drop table IF EXISTS neighbor', err => {
        if (err) {
          console.log('Error deleting neighbor table', err.message);
          reject();
          return;
        }
        db.run('drop table IF EXISTS host_node', err => {
          if (err) {
            console.log('Error deleting host_node table', err.message);
            reject();
            return;
          }
          db.run('drop table IF EXISTS neighbor_data', err => {
            if (err) {
              console.log('Error deleting host_node table', err.message);
              reject();
              return;
            }
            db.run('drop table IF EXISTS notification', err => {
              if (err) {
                console.log('Error deleting notification table', err.message);
                reject();
                return;
              }
              resolve();
            });
          });
        });
      });
    });
  }

  updateHostIp() {
    const updateHostIp = this.db.prepare(
      `UPDATE host_node SET login_token = ? WHERE id = ?`
    );
    updateHostIp.run(NODE_STATE.loginToken, 0);
  }

  setNotificationToken(token) {
    const stmt = this.db.prepare(
      'INSERT OR IGNORE INTO notification (token) VALUES (?)'
    );
    stmt.run(token);
  }

  removeNotificationToken(token) {
    const removeNotificationToken = this.db.prepare(
      'DELETE FROM notification where token=?'
    );
    removeNotificationToken.run(token);
  }

  deleteNeighborHistory(domainWithConnectionPort) {
    const removeNeighborEntriesWithDomain = this.db.prepare(
      'DELETE FROM neighbor WHERE domain = $domain AND address LIKE $port'
    );
    removeNeighborEntriesWithDomain.run({
      $domain: domainWithConnectionPort.split(':')[0],
      $port: `%:${domainWithConnectionPort.split(':')[1]}`
    });
  }

  deleteNeighborData(domainWithConnectionPort) {
    const removeNeighborDataEntriesWithDomain = this.db.prepare(
      'DELETE FROM neighbor_data WHERE domainWithConnectionPort = ?'
    );
    removeNeighborDataEntriesWithDomain.run(domainWithConnectionPort);
  }

  setNeighborAdditionalData(domainWithConnectionPort, name, iriPort) {
    const stmt = this.db.prepare(
      'REPLACE INTO neighbor_data (domainWithConnectionPort, name, port) VALUES (?, ?, ?)'
    );
    stmt.run(domainWithConnectionPort, name, iriPort);
  }

  deleteWholeNeighborHistory() {
    this.db.run(`DELETE FROM neighbor`);
  }

  setupHost(
    protocol,
    iriIp,
    iriPort,
    hashedPw,
    iriFileLocation,
    loginToken,
    restartNodeCommand
  ) {
    const updateHostIp = this.db.prepare(
      'REPLACE INTO host_node (id, protocol, ip, port, hashed_pw, iri_path, login_token, restart_node_command) VALUES(?, ?, ?, ?, ?, ?, ?, ?)'
    );
    updateHostIp.run(
      0,
      protocol,
      iriIp,
      iriPort,
      hashedPw,
      iriFileLocation,
      loginToken,
      restartNodeCommand
    );
  }

  changeHostAddress(protocol, iriIp, iriPort) {
    const updateHostIp = this.db.prepare(
      `UPDATE host_node SET protocol = ?, ip = ?, port = ? WHERE id = ?`
    );
    updateHostIp.run(protocol, iriIp, iriPort, 0);
  }

  async getAllNeighborEntries() {
    return await new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM neighbor ORDER BY timestamp ASC',
        [],
        (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });
  }

  addNeighborStates(richNeighbors) {
    if (richNeighbors) {
      const stmt = this.db.prepare(
        `INSERT INTO neighbor (
        address,
        domain,
        numberOfAllTransactions,
        numberOfRandomTransactionRequests,
        numberOfNewTransactions,
        numberOfInvalidTransactions,
        numberOfStaleTransactions,
        numberOfSentTransactions,
        numberOfDroppedSentPackets,
        connected,
        iriVersion,
        isActive,
        isFriendlyNode,
        isSynced,
        milestone,
        name,
        onlineTime,
        ping,
        port
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      );
      richNeighbors.forEach(neighbor => {
        stmt.run(
          neighbor.address,
          neighbor.domain,
          neighbor.numberOfAllTransactions,
          neighbor.numberOfRandomTransactionRequests,
          neighbor.numberOfNewTransactions,
          neighbor.numberOfInvalidTransactions,
          neighbor.numberOfStaleTransactions,
          neighbor.numberOfSentTransactions,
          neighbor.numberOfDroppedSentPackets,
          neighbor.connected,
          neighbor.iriVersion,
          neighbor.isActive,
          neighbor.isFriendlyNode,
          neighbor.isSynced,
          neighbor.milestone,
          neighbor.name,
          neighbor.onlineTime,
          neighbor.ping,
          neighbor.port
        );
      });
      stmt.finalize();
    }
  }

  deleteOutdatedNeighborEntries() {
    this.db.run(
      `DELETE FROM neighbor WHERE timestamp <= datetime('now', '-30 minutes')`
    );
  }
}

const dbService = new DbService();
module.exports = dbService;
