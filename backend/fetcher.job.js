const fetchNeighborsAndNodeInfo = require('./observer/fetchNeighborsAndNodeInfo');

const MAX_MILESTONES_BEHIND_BEFORE_UNSYNCED = 50;

const theFetcher = async () => {
  while (true) {
    fetchNeighborsAndNodeInfo();

    // assertNodeInSync();
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
