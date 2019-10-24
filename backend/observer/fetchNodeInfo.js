const axios = require('axios');

const NODE_STATE = require('../state/node.state');
const IRI_SERVICE = require('../service/iri.service');

const fetchNodeInfo = async () => {
  try {
    NODE_STATE.currentOwnNodeInfo = await axios(
      IRI_SERVICE.createIriRequest('getNodeInfo')
    ).data;
  } catch (e) {
    console.log('Failed to fetch own node info.', e.message);
  }
};

module.exports = fetchNodeInfo;
