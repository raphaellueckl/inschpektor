importScripts('https://www.gstatic.com/firebasejs/5.9.4/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.9.4/firebase-messaging.js');
firebase.initializeApp({
  messagingSenderId: '1008642879795'
});
const messaging = firebase.messaging();
