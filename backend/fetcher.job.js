const axios = require('axios');

const NODE_STATE = require('./state/node.state');
const IRI_SERVICE = require('./service/iri.service');
const DB_SERVICE = require('./service/db.service');

const theFetcher = async () => {
  function fetchNeighborsAndNodeInfo() {
    if (NODE_STATE.iriIp) {
      axios(IRI_SERVICE.createIriRequest('getNeighbors'))
        .then(response => {
          const neighbors = response.data.neighbors;

          DB_SERVICE.addNeighborStates(neighbors);

          DB_SERVICE.deleteOutdatedNeighborEntries();
        })
        .catch(error =>
          console.log('Failed to fetch neighbors of own node.', error.message)
        );

      axios(IRI_SERVICE.createIriRequest('getNodeInfo'))
        .then(nodeInfoResponse => {
          NODE_STATE.currentOwnNodeInfo = nodeInfoResponse.data;
        })
        .catch(error =>
          console.log('Failed to fetch own node info.', error.message)
        );
    }
  }

  while (true) {
    fetchNeighborsAndNodeInfo();

    let timekeeper = new Promise((resolve, reject) => {
      setTimeout(() => resolve(), 15000);
    });

    await timekeeper;
  }
};

module.exports = theFetcher;
