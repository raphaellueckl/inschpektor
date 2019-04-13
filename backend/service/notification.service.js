require('../../node_modules/console-stamp')(console, {
  pattern: 'dd/mm/yyyy HH:MM:ss.l'
});
const axios = require('axios');

const DB_SERVICE = require('../service/db.service');
const NODE_STATE = require('../state/node.state');

class NotificationService {
  sendNotification(title, body) {
    NODE_STATE.notificationTokens.forEach(token => {
      const notificationBody = {
        notification: {
          title,
          body
        },
        to: token
      };

      axios({
        url: 'https://fcm.googleapis.com/fcm/send',
        data: notificationBody,
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'key=AAAA6tfM8TM:APA91bHvnph-hi7zFvdJU3JybjKnVPYqQth4kaS_b5x-Nr0OpJJ7t6lOtkUN84YCnqfh4RAa4-tyXFCoWUEvPE76iNEbGypyISytlYWUv4JxBeOIfK84ot-sM8BSi5tom9bUTeBaz3JC'
        },
        timeout: 5000
      })
        .then(response => {
          if (response.data.failure && response.data.success < 1) {
            DB_SERVICE.removeNotificationToken(token);
            NODE_STATE.notificationTokens.delete(token);
          }
        })
        .catch(error =>
          console.log('Error sending notification', error.message)
        );
    });
  }
}

const notificationService = new NotificationService();
module.exports = notificationService;
