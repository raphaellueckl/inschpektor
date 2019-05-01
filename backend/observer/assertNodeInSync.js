const axios = require('axios');

const NODE_STATE = require('../state/node.state');
const NOTIFICATION_SERVICE = require('../service/notification.service');
const GLOBALS = require('../state/globals');
const isAllowedToSendNotification = require('./gatekepper');

// Only send a notification once a day
const ONE_DAY_IN_MILIS = 1000 * 60 * 60 * 24;
let lastTimeAlarmTriggered = new Date() - ONE_DAY_IN_MILIS;

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
