## INSCHPEKTOR

This is a vuejs app that helps you managing your IOTA node neighbors.

The app isn't officially released yet, so I don't write a big readme here. To get it flying it needs some manual tweaks.
As soon as this is handled, I would put it into an alpha state.

### Installation

You need a recent version of node to successfully run this app (10.8+):

Check https://nodejs.org/en/download/ and download&install the version for your system.

Run `sudo npm i -g inschpektor --unsafe-perm && cd ~ && mkdir -p inschpektor`.

(Keep in mind that this is a very early stage of development and the installation process will be subject to change.)

### Running after installation

Always run this command: `cd ~ && cd inschpektor && inschpektor`.

As soon as it is running, you find it in your browser @ <http://localhost:8732>

(Keep in mind that this is a very early stage of development and the boot process will be subject to change.)

### Features/Improves on the roadmap:

- AddNeighbor functionality
- Manage non-UDP neighbors
- Keep database slim by removing the oldest entries
- "Current IP" in node error view
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
