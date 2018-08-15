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

You can get an address within the "About" section or use this one: IPXS9YLKJMODKUBHOXRHSUOMWYCBAKYGRCNLH9RAEP9NXRXXYPGBZBVQQWCMLNOHZQRTOGIRMTISGXAVAGASBFLAUB

I'm not poor and I have a job. But if you want to show some love, I always appreciate it. :)

### Features/Improves on the roadmap:

- 'inschpektor' should always use the same db path
- Restart node when out of sync
- Highlight static neighbors (compared to nelson ones)
- Update dependencies to remove the --unsafe-perm form the installation command
- Improve db query to fetch neighbors
- Add timestamp to entries and delete regularly
- Add 'reset db' functionality
- Permanent AddNeighbor functionality
- Manage non-UDP neighbors
- Keep database slim by removing the oldest entries
- Improve fetchneighbors algorithm (introcude promises)
- Improve database queries
- Create DB trigger for a limited amount of inserts into neighbors
- Create a node app and list it on NPM
- Permanently add neighbor (by writing to iri file)
- Notifications
- Fix manage-neighbor mobile table
- Proper error component routing
- User authentication
- Improve node module process
- Improve further for mobile (currently desktop has prio)
