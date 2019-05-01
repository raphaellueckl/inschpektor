const axios = require('axios');

const NODE_STATE = require('../state/node.state');
const NOTIFICATION_SERVICE = require('../service/notification.service');
const GLOBALS = require('../state/globals');
const isAllowedToSendNotification = require('./gatekepper');

const assertPremiumNeighborsSynced = () => {
  if (
    isAllowedToSendNotification() &&
    NODE_STATE.currentNeighbors &&
    NODE_STATE.currentNeighbors
      .filter(n => n.latestSolidSubtangleMilestoneIndex)
      .filter(
        n =>
          n.latestSolidSubtangleMilestoneIndex >=
          NODE_STATE.currentOwnNodeInfo.latestMilestoneIndex -
            GLOBALS.MAX_MILESTONES_BEHIND_BEFORE_UNSYNCED
      ).length > 0
  ) {
    NOTIFICATION_SERVICE.sendNotification('A neighbor is out of sync!');
  }
};

module.exports = assertPremiumNeighborsSynced;
