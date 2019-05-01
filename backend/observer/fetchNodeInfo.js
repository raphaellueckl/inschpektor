const axios = require('axios');

const NODE_STATE = require('../state/node.state');
const IRI_SERVICE = require('../service/iri.service');

const fetchNodeInfo = () => {
  axios(IRI_SERVICE.createIriRequest('getNodeInfo'))
    .then(nodeInfoResponse => {
      NODE_STATE.currentOwnNodeInfo = nodeInfoResponse.data;
    })
    .catch(error =>
      console.log('Failed to fetch own node info.', error.message)
    );
};

module.exports = fetchNodeInfo;
