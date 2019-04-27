const axios = require('axios');

const NODE_STATE = require('../state/node.state');
const IRI_SERVICE = require('../service/iri.service');
const DB_SERVICE = require('../service/db.service');
const NOTIFICATION_SERVICE = require('../service/notification.service');

const MAX_MILESTONES_BEHIND_BEFORE_UNSYNCED = 50;

// Only send a notification once a day
const ONE_DAY_IN_MILIS = 1000 * 60 * 60 * 24;
const lastTimeAlarmTriggered = new Date() - ONE_DAY_IN_MILIS;

const assertNodeInSync = () => {
  if (
    NODE_STATE.currentOwnNodeInfo &&
    NODE_STATE.currentOwnNodeInfo.latestMilestoneIndex -
      MAX_MILESTONES_BEHIND_BEFORE_UNSYNCED >=
      NODE_STATE.currentOwnNodeInfo.latestSolidSubtangleMilestoneIndex &&
    new Date() - ONE_DAY_IN_MILIS > lastTimeAlarmTriggered
  ) {
    lastTimeAlarmTriggered = new Date();
    NOTIFICATION_SERVICE.sendNotification('Out of Sync!');
  }
};

module.exports = assertNodeInSync;
