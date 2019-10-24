const fetchNodeInfo = require('./observer/fetchNodeInfo');
const fetchNeighbors = require('./observer/fetchNeighbors');
const fetchSystemInfo = require('./observer/fetchSystemInfo');
const assertNodeInSync = require('./observer/assertNodeInSync');
const assertPremiumNeighborsSynced = require('./observer/assertPremiumNeighborsSynced');
const assertNeighborsActive = require('./observer/assertNeighborsActive');
const assertNeighborsHealthy = require('./observer/assertNeighborsHealthy');

const theFetcher = async () => {
  while (true) {
    fetchNeighbors();
    fetchNodeInfo();
    fetchSystemInfo();

    assertNodeInSync();
    assertNeighborsActive();
    assertNeighborsHealthy();
    assertPremiumNeighborsSynced();

    let timekeeper = new Promise((resolve, reject) => {
      setTimeout(() => resolve(), 5000);
    });

    await timekeeper;
  }
};

module.exports = theFetcher;
