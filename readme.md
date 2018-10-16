## INSCHPEKTOR - Status: Early-Alpha (not officially released)

This is a vuejs app that helps you managing your IOTA node neighbors.

The app isn't officially released yet, so I don't write a big readme here.

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

## Tips

- If you get some permission errors in the console, you could either change the access-rights of your iri.config or start inschpektor with `sudo`.  

### Features/Improves on the roadmap

- Add 'reset db' functionality
- Restart node
- Unit tests
- Mock data
- Restart node when out of sync
- Highlight static neighbors (compared to nelson ones)
- Try to get rid of the --unsafe-perm flag
- User authentication
- User authorization
- Notifications
- Fix manage-neighbor mobile table
- Proper error component routing
- Improve further for mobile (currently desktop has prio)

### Bugs

- When you are entering a nickname for a node, it can vanish because the regular "getNeighbors"-call resets the list (including what the user already typed).

### Supported
- ✓ Https node support
- ✓ View neighbors
- ✓ Add / Remove neighbors
- ✓ Write directly to iri config
- ✓ NPM runnable app
- ✓ Fetch info about hosted node

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
