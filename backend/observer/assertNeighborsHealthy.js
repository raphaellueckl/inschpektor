const axios = require('axios');

const NODE_STATE = require('../state/node.state');
const NOTIFICATION_SERVICE = require('../service/notification.service');
const isAllowedToSendNotification = require('./gatekepper');

const assertNeighborsHealthy = () => {
  //   if (isAllowedToSendNotification()) {
  //     NOTIFICATION_SERVICE.sendNotification('A neighbor is out of sync!');
  //   }
};

module.exports = assertNeighborsHealthy;
