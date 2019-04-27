const fetchNeighborsAndNodeInfo = require('./observer/fetchNeighborsAndNodeInfo');
const assertNodeInSync = require('./observer/assertNodeInSync');

const theFetcher = async () => {
  while (true) {
    fetchNeighborsAndNodeInfo();

    assertNodeInSync();
    // assertPremiumNeighborsSynced();
    // assertNeighborsActive();
    // assertNeighborsHealthy();

    // NOTIFICATION_SERVICE.sendNotification('title', 'and body');
    // console.log(NODE_STATE.notificationTokens);

    let timekeeper = new Promise((resolve, reject) => {
      setTimeout(() => resolve(), 15000);
    });

    await timekeeper;
  }
};

module.exports = theFetcher;
