const axios = require('axios');

const NODE_STATE = require('../state/node.state');
const NOTIFICATION_SERVICE = require('../service/notification.service');
const isAllowedToSendNotification = require('./gatekepper');

const assertNeighborsHealthy = () => {
  if (
    isAllowedToSendNotification() &&
    NODE_STATE.currentNeighbors &&
    NODE_STATE.currentNeighbors.filter(
      n => !n.isFriendlyNode && n.milestone.latestSolidSubtangleMilestoneIndex
    ).length > 0
  ) {
    NOTIFICATION_SERVICE.sendNotification('A neighbor turned foul!');
  }
};

module.exports = assertNeighborsHealthy;
