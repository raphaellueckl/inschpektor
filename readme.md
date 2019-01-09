## INSCHPEKTOR - Status: Beta

This is a manager for your IOTA node with focus on simplicity and user experience. It will take a lot of manual work off your shoulders. :)

### Features

For the features, head over to my medium article: https://medium.com/@codepleb4/inschpektor-the-user-friendly-peer-manager-for-your-iota-node-c820d5243964

### Installation

You need a recent version of node to successfully run this app (10.8+):

Check https://nodejs.org/en/download/ and download & install the version for your system.

**Ubuntu users only:** You need to install the `build-essentail` package first, if you do not already have it: `sudo apt install build-essential`

**Install inschpektor:** Run `sudo npm i -g inschpektor --unsafe-perm`

`--unsafe-perm` is needed on linux. It was not needed on my MacOS and I'm not sure about windows. The reason are the npm submodules that need to run with sudo permissions too (because of the bcrypt dependency).

### Running after installation

Always run this command in a terminal: `sudo inschpektor` (it is recommended to start inschpektor with `sudo` permissions. The reason is, that depending on how you setup your IOTA node, inschpektor cannot restart your IOTA node and probably cannot write to your iri config file upon adding/removing neighbors).

After that, you will find it in your browser @ <http://{YOUR-IP}:8732> (tested on Google Chrome and Firefox, desktop and mobile).

### Register node

When you first open the webapp (or when you clicked the 'Reset Inschpektor' button), you can define your node and things related to it.

- HTTPS: If you DO NOT run inschpektor on the same machine, as the your iri runs, and you generally access it over https, then enable that toggle.
- Password: This password can be freely chosen and is not related to anything else than inschpektor.
- Path to iri config (Optional): Please provide the full path to your iri config file, if you want to have inschpektor edit your iri config (for instance, if you add a neighbor or remove one and want to have that persisted in the iri - no more manual work needed).
- Command to restart node (Optional): Any linux command. This will be executed upon clicking the button 'Restart Node' in the 'Manage' view in inschpektor. In my case, the command would be `systemctl restart iota`. NOTE: Don't write `sudo` or anything in here. As soon as this command triggers something like a password prompt, it will not work. If you started inschpektor with `sudo`, it will be sufficient.

### Update

To get the newest version (or ignore, if you already have it), you can just run the installation command again and it will do the rest for you.

### Donations

You can find an address within the 'About' section of inschpektor or use this one:

IPXS9YLKJMODKUBHOXRHSUOMWYCBAKYGRCNLH9RAEP9NXRXXYPGBZBVQQWCMLNOHZQRTOGIRMTISGXAVAGASBFLAUB

If you want to show some love, I always appreciate it. :)

### Feedback

Find me on Telegram @codepleb or on the iota discord codepleb.net#9990 for direct feedback.

Also keep in mind that I run channels where I post updates:

- Twitter: https://twitter.com/codepleb4
- Telegram Broadcast: https://twitter.com/codepleb4

## Tips & Help

- **Permission errors:** When you get permission errors on the console, it might be that your iota.ini file has wrong access rights or that your node runs as a service and only the root user can handle it without a password prompt (or various other permission reasons). You can just run `inschpektor` as root user (before running inschpektor, type `sudo -s` and enter your password) in this case. That will work, but I want to say that doing this is generally a very bad habit which can make your computer vulnerable. 
- **Performance:** If you want to increase the performance, serve inschpektor over HTTPS. This way, the service worker will get enabled and be able to put a lot of calls and the site skeleton into the cache.

### Features/Improves on the roadmap

- Support for multiple nodes
- Notifications
- Improve mobile layout
- Unit tests 😳

### Known Bugs

- [Currently none]

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
