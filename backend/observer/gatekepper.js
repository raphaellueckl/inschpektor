const ONE_DAY_IN_MILIS = 1000 * 60 * 60 * 24;
let lastTimeAlarmTriggered = new Date() - ONE_DAY_IN_MILIS;

// Only send a notification once a day
const isAllowedToSendNotification = () => {
  if (new Date() - ONE_DAY_IN_MILIS > lastTimeAlarmTriggered) {
    lastTimeAlarmTriggered = new Date();
    return true;
  }
  return false;
};

module.exports = isAllowedToSendNotification;
