import firebase from 'firebase/app';
import 'firebase/messaging';

export const initializeFirebase = () => {
  firebase.initializeApp({
    messagingSenderId: '1008642879795'
  });
};
