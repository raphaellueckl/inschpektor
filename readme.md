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

- Restart node when out of sync
- Highlight static neighbors (compared to nelson ones)
- Allow neighor usernames
- Improve db query to fetch neighbors (promises, parallel fetching instead of serial)
- Update dependencies to remove the --unsafe-perm form the installation command
- Permanent AddNeighbor functionality (write to iri config file)
- Fetch regularly
- User authentication
- User authorization
- Manage non-UDP neighbors
- Permanently add neighbor (by writing to iri file)
- Notifications
- Fix manage-neighbor mobile table
- Proper error component routing
- Add 'reset db' functionality
- Improve further for mobile (currently desktop has prio)
- Improve database queries
- Mark 'quality neighbors'

### Supported
✓ View neighbors
✓ Add / Remove neighbors
✓ NPM runnable app
✓ Fetch info about hosted node