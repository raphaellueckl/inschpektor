const axios = require('axios');

const NODE_STATE = require('../state/node.state');
const NOTIFICATION_SERVICE = require('../service/notification.service');
const GLOBALS = require('../state/globals');
const isAllowedToSendNotification = require('./gatekepper');

const assertNodeInSync = () => {
  if (
    isAllowedToSendNotification() &&
    NODE_STATE.currentOwnNodeInfo &&
    NODE_STATE.currentOwnNodeInfo.latestMilestoneIndex -
      GLOBALS.MAX_MILESTONES_BEHIND_BEFORE_UNSYNCED >=
      NODE_STATE.currentOwnNodeInfo.latestSolidSubtangleMilestoneIndex
  ) {
    lastTimeAlarmTriggered = new Date();
    NOTIFICATION_SERVICE.sendNotification('Out of Sync!');
  }
};

module.exports = assertNodeInSync;
