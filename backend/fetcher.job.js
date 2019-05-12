const fetchNodeInfo = require('./observer/fetchNodeInfo');
const fetchNeighbors = require('./observer/fetchNeighbors');
const assertNodeInSync = require('./observer/assertNodeInSync');
const assertPremiumNeighborsSynced = require('./observer/assertPremiumNeighborsSynced');
const assertNeighborsActive = require('./observer/assertNeighborsActive');
const assertNeighborsHealthy = require('./observer/assertNeighborsHealthy');

const theFetcher = async () => {
  while (true) {
    fetchNeighbors();
    fetchNodeInfo();

    assertNodeInSync();
    assertNeighborsActive();
    assertNeighborsHealthy();
    assertPremiumNeighborsSynced();

    let timekeeper = new Promise((resolve, reject) => {
      setTimeout(() => resolve(), 15000);
    });

    await timekeeper;
  }
};

module.exports = theFetcher;
