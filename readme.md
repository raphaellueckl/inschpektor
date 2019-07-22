# INSCHPEKTOR

This is a manager for your IOTA node with focus on simplicity and user experience. It will take a lot of manual work off your shoulders. :)

## Contents

[Installation & Update](docs/install+update.md)

[Run](docs/run.md)

[Tips & Help](docs/tips+help.md)

## Features

For the features and future outlook, head over to my medium article: https://medium.com/@codepleb4/inschpektor-the-user-friendly-peer-manager-for-your-iota-node-c820d5243964

## Video Instructions

I recorded videos on how to install and use inschpektor. If you want, look them up here: https://www.youtube.com/watch?v=EjXs7kpBqjQ&list=PLAjtvx6a60HLvuLDphPaFRhD3Oe0NVn9J

## Installing inschpektor as an app

Inschpektor can be installed and used like a normal application. This is more than just a website bookmark!

**iOS:** Open Safari (only Safari will work), browse to your inschpektor URL, click on 'share', 'Add to Home Screen'.
**Android:** Open Chrome, browse to your inschpektor URL, clicke the three dots on the top right, 'Add to Home Screen' or 'Install Inschpektor'
**Windows/MacOs:** Open Chrome/Firefox, browse to your inschpektor URL, clicke the three dots on the top right, 'Install Inschpektor'

## Activate Notifications

For iOs, this sadly is not possible at this time, because Apple does not yet allow the 'push api' that is supposed to work cross-platform.

For all other devices, open inschpektor, go to 'Manage' and click on the 'Enable Notifications' button. You will have to accept the request that is popping up and you are set up!

Keep in mind, that whenever you reset inschpektor or update it, you have to register for notifications again. This might be obsolete in the future.

## Donations

If you want to show some love, I always appreciate it. :) Here are some crypto addresses.

**IOTA:** IZ99FQWJUQJCDLBSUOEDZIVROSARFYLXJWPZNAXQPCCGAHCUWKRE9RNHMGNHZTAIZHPUDV9HMSPNJLYSXPNEPTRHUW

**BTC:** 32o6kbgZqJ9nhT2aRsfEGcMtpThJ2za89T

**LTC:** LgfSNjqVpXFj9xN8ZWPR9qTZQJpcRRNXRZ

**XMR:** 4GdoN7NCTi8a5gZug7PrwZNKjvHFmKeV11L6pNJPgj5QNEHsN6eeX3DaAQFwZ1ufD4LYCZKArktt113W7QjWvQ7CWAjwVCr95LATLKqtxr

**XLM:** GA5XIGA5C7QTPTWXQHY6MCJRMTRZDOSHR6EFIBNDQTCQHG262N4GGKTM

**XRP:** rLHzPsX6oXkzU2qL12kHCH8G8cnZv1rBJh

## Feedback

Find me on Telegram @codepleb or on the iota discord codepleb.net#9990 for direct feedback.

Also keep in mind that I run channels where I post updates:

- Twitter: https://twitter.com/codepleb4
- Telegram Broadcast: https://t.me/inschpektor

### Improvements on the roadmap

- Go further down the PWA road and make the app more "native like"
- Make everything more stable
- Overhaul this overly fancy UI :)

### Known Issues

- Vague responses: You do an action, then a spinner appears, but the action is not yet fulfilled, or changes you do are shortly dropped and reappear later. That is a hug flaw in UX that I will pay attention to soon.
- A lot fo database operations currently do not come with error handling. If you ever see a 'Could not proxy...' error, that is because of this fact.

---

## Developer Info

### Project setup

```
npm install
```

#### Compiles and hot-reloads for development

```
npm run serve
```

#### Compiles and minifies for production

```
npm run build
```
