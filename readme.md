## INSCHPEKTOR

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

- Support https nodes
- Permanently add neighbor (by writing to iri file)
- Login concept does not fully work
- Unit tests
- Mock data
- Add 'reset db' functionality
- Mark 'quality neighbors'
- Restart node when out of sync
- Highlight static neighbors (compared to nelson ones)
- Improve db queries (promises, parallel fetching instead of serial => especially the getNeighbor queries)
- Update dependencies to remove the --unsafe-perm form the installation command
- Permanent AddNeighbor functionality (write to iri config file)
- User authentication
- User authorization
- Notifications
- Fix manage-neighbor mobile table
- Proper error component routing
- Improve further for mobile (currently desktop has prio)

### Bugs
- If node is not reachable once, then it can't get back into a "healthy" state. A the prompt requesting another IP won't go away after following successful calls.
- Usernames for neighbors disappear after a restart of inschpektor

### Supported
✓ View neighbors
✓ Add / Remove neighbors
✓ NPM runnable app
✓ Fetch info about hosted node