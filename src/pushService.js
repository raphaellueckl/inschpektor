import firebase from 'firebase';

export const initializeFirebase = () => {
  firebase.initializeApp({
    messagingSenderId: '1008642879795'
  });
};

export const askForPermissioToReceiveNotifications = async () => {
  try {
    console.log('hi');
    const messaging = firebase.messaging();
    await messaging.requestPermission();
    const token = await messaging.getToken();
    console.log('Registered Token:', token);

    return token;
  } catch (error) {
    console.error(error);
  }
};
