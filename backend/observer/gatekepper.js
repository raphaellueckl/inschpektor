const ONE_DAY_IN_MILIS = 1000 * 60 * 60 * 24;
let lastTimeAlarmTriggered = new Date().getTime() - ONE_DAY_IN_MILIS;

// Only send a notification once a day
const isAllowedToSendNotification = () => {
  if (new Date().getTime() - ONE_DAY_IN_MILIS > lastTimeAlarmTriggered) {
    lastTimeAlarmTriggered = new Date().getTime();
    return true;
  }
  return false;
};

module.exports = isAllowedToSendNotification;
