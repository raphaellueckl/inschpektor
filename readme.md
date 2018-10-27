## INSCHPEKTOR - Status: Early-Alpha (not officially released)

This is a vuejs app that helps you managing your IOTA node neighbors.

The app isn't officially released yet, so I don't write a big readme here.

### Features

For the features, head over to my medium article: <coming soon>

### Installation

You need a recent version of node to successfully run this app (10.8+):

Check https://nodejs.org/en/download/ and download & install the version for your system.

Run `sudo npm i -g inschpektor --unsafe-perm`

### Running after installation

Always run this command: `inschpektor`.

As soon as it is running, you find it in your browser @ <http://localhost:8732> (only Chrome and Firefox due to very leading edge features. If you sucessfully run it on other browsers, please hit me up on telegram).

### Update

To get the newest version (or ignore, if you already have it), you can just run the installation command again and it will do the rest for you.

### Donations

You can get an address within the "About" section or use this one:

IPXS9YLKJMODKUBHOXRHSUOMWYCBAKYGRCNLH9RAEP9NXRXXYPGBZBVQQWCMLNOHZQRTOGIRMTISGXAVAGASBFLAUB

I'm not poor and I have a job. But if you want to show some love, I always appreciate it. :)

## Tips & Help

- Permission errors: When you get permission errors on the console, it might be that your iota.ini file has wrong access rights or that your node runs as a service and only the root user can change it without a password prompt. If you want to restart your node over inschpektor, I advise you to use your root user to start inschpektor (type `sudo -s` into the console, pass your password and type `inschpektor` afterwards to start it as root user). Running inschpektor as a normal user is also possible, but depending on your system configuration, without the extra features like writing neighbors directly to the iri file or restarting the node. This is risky and you should never run any application as root user, just as a general remark! This is the easy way out and should be your last option.
- If you want to increase the performance, serve inschpektor over HTTPS. This way, the service worker will get enabled and be able to put a lot of calls and the site skeleton into the cache.

### Features/Improves on the roadmap

- Export database to not always re-setup after update
- Support for multiple nodes
- Unit tests
- Mock data
- Try to get rid of the --unsafe-perm flag
- Notifications
- Fix manage-neighbor mobile table
- Proper error component routing
- Improve further for mobile (currently desktop has prio)

### Bugs

- When you are entering a nickname for a node, it can vanish because the regular "getNeighbors"-call resets the list (including what you already typed).

-------

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

#### Run your tests
```
npm run test
```

#### Lints and fixes files
```
npm run lint
```

#### Run your end-to-end tests
```
npm run test:e2e
```

#### Run your unit tests
```
npm run test:unit
```
