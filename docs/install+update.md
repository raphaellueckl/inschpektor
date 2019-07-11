# Installation

## 1. Precondition

**People with a debian linux system:**
If you are on a debian linux system (Ubuntu for example), all you need to do is run this command: `sudo apt install -y build-essential && sudo apt install -y curl && sudo apt-get purge nodejs -y && curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash - && sudo apt-get update -yqq --fix-missing && sudo apt-get install -y nodejs && sudo npm i npm@latest -g`
If you are not on a debian system, check this link and install nodejs for your system: https://nodejs.org/en/download/

**People without a debian linux system:**

- You need a recent version of node to successfully run this app (10.8+). Check https://nodejs.org/en/download/ and download & install the version for your system.
- Install `curl`
- Install `make`
- Install `build-essential`

All of the things in this list are unconfirmed. I do not know if those are all the packages you need on other systems and I also do not know if they all are needed.

## 2. Prepare iri configuration

An optimal iri configuration looks like the following. If you are coming from https://iota.partners, please study it closely, since there are vital steps you need to take for it to work!

```bash
[IRI]
PORT = 14265 # This is the actual default (non-critical)
API_PORT = 14265 # This is the actual default (non-critical)
API_HOST = 0.0.0.0 # This is necessary
NEIGHBORING_SOCKET_PORT = 15600
NEIGHBORING_SOCKET_ADDRESS = 0.0.0.0 # This is necessary
AUTO_TETHERING_ENABLED = false
MAX_NEIGHBORS = 10
REMOTE_LIMIT_API = ""   # If you mess with the stuff here, always check if the calls in inschpektor still work
ZMQ_ENABLED = true
ZMQ_PORT = 5556


#------------------------------------------------------------------------
# Local Snapshots Settings
#------------------------------------------------------------------------
LOCAL_SNAPSHOTS_ENABLED = true
LOCAL_SNAPSHOTS_PRUNING_ENABLED = true
LOCAL_SNAPSHOTS_DEPTH = 200
LOCAL_SNAPSHOTS_PRUNING_DELAY = 30000
LOCAL_SNAPSHOTS_INTERVAL_SYNCED = 10
LOCAL_SNAPSHOTS_INTERVAL_UNSYNCED = 1000


#------------------------------------------------------------------------
# Static Neighbors
#------------------------------------------------------------------------
NEIGHBORS = # Your neighbors...

```

## 3. Install inschpektor

Run `sudo npm i -g inschpektor --unsafe-perm`

`--unsafe-perm` is needed on linux. It was not needed on my MacOS and I'm not sure about windows. The reason are the npm submodules that need to run with sudo permissions too (the bcrypt dependency leads to this necessity).
