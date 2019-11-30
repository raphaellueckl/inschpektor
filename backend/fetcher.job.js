const fetchNodeInfo = require('./observer/fetchNodeInfo');
const fetchNeighbors = require('./observer/fetchNeighbors');
const fetchSystemInfo = require('./observer/fetchSystemInfo');
const assertNodeInSync = require('./observer/assertNodeInSync');
const assertPremiumNeighborsSynced = require('./observer/assertPremiumNeighborsSynced');
const assertNeighborsActive = require('./observer/assertNeighborsActive');
const assertNeighborsHealthy = require('./observer/assertNeighborsHealthy');
const NODE_STATE = require('./state/node.state');

const theFetcher = async () => {
  while (true) {
    if (NODE_STATE.iriIp) {
      fetchNeighbors();
      fetchNodeInfo();
      fetchSystemInfo();

      assertNodeInSync();
      assertNeighborsActive();
      assertNeighborsHealthy();
      assertPremiumNeighborsSynced();
    }
    let timekeeper = new Promise(resolve => {
      setTimeout(() => resolve(), 4500);
    });

    await timekeeper;
  }
};

module.exports = theFetcher;
