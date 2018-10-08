## INSCHPEKTOR - Status: Early-Alpha (not officially released)

This is a vuejs app that helps you managing your IOTA node neighbors.

The app isn't officially released yet, so I don't write a big readme here.

### Installation

You need a recent version of node to successfully run this app (10.8+):

Check https://nodejs.org/en/download/ and download & install the version for your system.

Run `sudo npm i -g inschpektor --unsafe-perm`

(Keep in mind that this is a very early stage of development and the boot process will be subject to change.)

### Running after installation

Always run this command: `inschpektor`.

As soon as it is running, you find it in your browser @ <http://localhost:8732>

### Update

To get the newest version (or ignore, if you already have it), you can just run the installation command again and it will do the rest for you.

### Donations

You can get an address within the "About" section or use this one:

IPXS9YLKJMODKUBHOXRHSUOMWYCBAKYGRCNLH9RAEP9NXRXXYPGBZBVQQWCMLNOHZQRTOGIRMTISGXAVAGASBFLAUB

I'm not poor and I have a job. But if you want to show some love, I always appreciate it. :)

### Features/Improves on the roadmap

- Add 'reset db' functionality
- Only write to iri if iri was set
- Notifiy the user when calls fail. For instance 'getNeighbors', because users will only see an empty app
- Unit tests
- Mock data
- Mark 'quality neighbors'
- Make it clear what 'Password' means when setting the node
- Restart node when out of sync
- Highlight static neighbors (compared to nelson ones)
- Update dependencies to remove the --unsafe-perm form the installation command
- User authentication
- User authorization
- Notifications
- Fix manage-neighbor mobile table
- Proper error component routing
- Improve further for mobile (currently desktop has prio)

### Bugs

- If node is not reachable once, then it can't get back into a "healthy" state. A the prompt requesting another IP won't go away after following successful calls.
- When you are entering a nickname for a node, it can vanish because the regular "getNeighbors"-call resets the list (including what the user already typed).

### Small improves

- Only give the option to write to iri config, if it was provided initially

### Supported
✓ Https node support
✓ View neighbors
✓ Add / Remove neighbors
✓ Write directly to iri config
✓ NPM runnable app
✓ Fetch info about hosted node
