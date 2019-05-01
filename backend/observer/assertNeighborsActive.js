const axios = require('axios');

const NODE_STATE = require('../state/node.state');
const NOTIFICATION_SERVICE = require('../service/notification.service');
const isAllowedToSendNotification = require('./gatekepper');

const assertNeighborsActive = () => {
  if (
    isAllowedToSendNotification() &&
    NODE_STATE.currentNeighbors &&
    NODE_STATE.currentNeighbors.filter(n => !n.isActive).length > 0
  ) {
    NOTIFICATION_SERVICE.sendNotification('A neighbor turned inactive!');
  }
};

module.exports = assertNeighborsActive;
