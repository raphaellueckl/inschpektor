const axios = require('axios');

const NODE_STATE = require('../state/node.state');
const IRI_SERVICE = require('../service/iri.service');
const DB_SERVICE = require('../service/db.service');
const GLOBALS = require('../state/globals');

function createResultNeighbor(
  neighbor,
  oldestEntry,
  additionalData,
  nodeInfo = null,
  ping = null
) {
  const resultNeighbor = {
    iriVersion: nodeInfo ? nodeInfo.appVersion : null,
    isSynced:
      nodeInfo &&
      NODE_STATE.currentOwnNodeInfo &&
      NODE_STATE.currentOwnNodeInfo.latestMilestoneIndex
        ? nodeInfo.latestSolidSubtangleMilestoneIndex >=
          NODE_STATE.currentOwnNodeInfo.latestMilestoneIndex -
            GLOBALS.MAX_MILESTONES_BEHIND_BEFORE_UNSYNCED
        : null,
    milestone: nodeInfo
      ? `${nodeInfo.latestSolidSubtangleMilestoneIndex} / ${
          NODE_STATE.currentOwnNodeInfo
            ? NODE_STATE.currentOwnNodeInfo.latestMilestoneIndex
            : '-'
        }`
      : null,
    isActive: oldestEntry
      ? neighbor.numberOfNewTransactions > oldestEntry.numberOfNewTransactions
        ? oldestEntry.numberOfNewTransactions
        : -1
      : null,
    onlineTime: nodeInfo ? nodeInfo.time : null,
    isFriendlyNode:
      neighbor.numberOfInvalidTransactions <
        neighbor.numberOfAllTransactions / 200 ||
      !neighbor.numberOfAllTransactions,
    ping: ping,
    name: additionalData && additionalData.name ? additionalData.name : null,
    port: additionalData && additionalData.port ? additionalData.port : null,
    ...neighbor
  };
  const additionalDataForNeighbor = NODE_STATE.neighborAdditionalData.get(
    resultNeighbor.domain
  );
  resultNeighbor.name =
    additionalDataForNeighbor && additionalDataForNeighbor.name
      ? additionalDataForNeighbor.name
      : null;

  return resultNeighbor;
}

const fetchNeighbors = () => {
  if (NODE_STATE.iriIp) {
    const resultNeighbors = [];
    axios(IRI_SERVICE.createIriRequest('getNeighbors'))
      .then(async response => {
        const activeNeighbors = response.data.neighbors;

        const rows = await DB_SERVICE.getAllNeighborEntries();

        const allRequests = [];

        for (let neighbor of activeNeighbors) {
          const additionalDataOfNeighbor = NODE_STATE.neighborAdditionalData.get(
            neighbor.domain
          );

          allRequests.push(
            new Promise((resolve, reject) => {
              let startDate = new Date();
              const oldestEntry = rows.find(
                row => neighbor.address === row.address
              );

              axios(
                IRI_SERVICE.createIriRequestForNeighborNode(
                  'http',
                  'getNodeInfo',
                  neighbor,
                  additionalDataOfNeighbor
                    ? additionalDataOfNeighbor.port
                    : null
                )
              )
                .then(nodeInfoResponse => {
                  let ping = new Date() - startDate;
                  let nodeInfo = nodeInfoResponse.data;

                  const resultNeighbor = createResultNeighbor(
                    neighbor,
                    oldestEntry,
                    additionalDataOfNeighbor,
                    nodeInfo,
                    ping
                  );

                  resultNeighbors.push(resultNeighbor);
                  resolve(resultNeighbor);
                })
                .catch(error => {
                  axios(
                    IRI_SERVICE.createIriRequestForNeighborNode(
                      'https',
                      'getNodeInfo',
                      neighbor,
                      additionalDataOfNeighbor
                        ? additionalDataOfNeighbor.port
                        : null
                    )
                  )
                    .then(nodeInfoResponse => {
                      let ping = new Date() - startDate;
                      let nodeInfo = nodeInfoResponse.data;

                      const resultNeighbor = createResultNeighbor(
                        neighbor,
                        oldestEntry,
                        additionalDataOfNeighbor,
                        nodeInfo,
                        ping
                      );

                      resultNeighbors.push(resultNeighbor);
                      resolve(resultNeighbor);
                    })
                    .catch(error => {
                      const resultNeighbor = createResultNeighbor(
                        neighbor,
                        oldestEntry,
                        additionalDataOfNeighbor
                      );

                      resultNeighbors.push(resultNeighbor);
                      resolve(resultNeighbor);
                    });
                });
            })
          );
        }

        Promise.all(allRequests)
          .then(evaluatedNeighbors => {
            // Sort Priority: Persisted neighbors, premium neighbors, neighbor address
            evaluatedNeighbors.sort((a, b) => {
              if (
                NODE_STATE.persistedNeighbors &&
                !!(
                  (NODE_STATE.persistedNeighbors.includes(a.address) !== null) ^
                  NODE_STATE.persistedNeighbors.includes(b.address)
                )
              ) {
                return NODE_STATE.persistedNeighbors.includes(a.address)
                  ? -1
                  : 1;
              }
              if (!!((a.iriVersion !== null) ^ (b.iriVersion !== null))) {
                return a.iriVersion ? -1 : 1;
              }
              return a.address.localeCompare(b.address);
            });

            NODE_STATE.currentNeighbors = evaluatedNeighbors;

            DB_SERVICE.addNeighborStates(evaluatedNeighbors);

            DB_SERVICE.deleteOutdatedNeighborEntries();
          })
          .catch(e => console.log(e.message));
      })
      .catch(error =>
        console.log('Failed to fetch neighbors of own node.', error.message)
      );
  }
};

module.exports = fetchNeighbors;
