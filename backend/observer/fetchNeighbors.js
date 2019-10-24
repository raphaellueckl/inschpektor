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
    `${resultNeighbor.domain}:${resultNeighbor.address.split(':')[1]}`
  );
  resultNeighbor.name =
    additionalDataForNeighbor && additionalDataForNeighbor.name
      ? additionalDataForNeighbor.name
      : null;

  return resultNeighbor;
}

const fetchNeighbors = async () => {
  if (NODE_STATE.iriIp) {
    const resultNeighbors = [];

    const {
      data: { neighbors }
    } = await axios(IRI_SERVICE.createIriRequest('getNeighbors'));
    const activeNeighbors = neighbors;

    const rows = await DB_SERVICE.getAllNeighborEntries();

    const allRequests = [];

    for (let neighbor of activeNeighbors) {
      const additionalDataOfNeighbor = NODE_STATE.neighborAdditionalData.get(
        `${neighbor.domain}:${neighbor.address.split(':')[1]}`
      );

      allRequests.push(
        new Promise(async resolve => {
          let startDate = new Date();
          const oldestEntry = rows.find(
            row => neighbor.address === row.address
          );

          try {
            const { data } = await axios(
              IRI_SERVICE.createIriRequestForNeighborNode(
                'http',
                'getNodeInfo',
                neighbor,
                additionalDataOfNeighbor ? additionalDataOfNeighbor.port : null
              )
            );
            let ping = new Date() - startDate;
            let nodeInfo = data;

            const resultNeighbor = createResultNeighbor(
              neighbor,
              oldestEntry,
              additionalDataOfNeighbor,
              nodeInfo,
              ping
            );

            resultNeighbors.push(resultNeighbor);
            resolve(resultNeighbor);
          } catch (e) {
            try {
              const { data } = await axios(
                IRI_SERVICE.createIriRequestForNeighborNode(
                  'https',
                  'getNodeInfo',
                  neighbor,
                  additionalDataOfNeighbor
                    ? additionalDataOfNeighbor.port
                    : null
                )
              );
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
            } catch (error) {
              const resultNeighbor = createResultNeighbor(
                neighbor,
                oldestEntry,
                additionalDataOfNeighbor
              );

              resultNeighbors.push(resultNeighbor);
              resolve(resultNeighbor);
            }
          }
        })
      );
    }

    try {
      const evaluatedNeighbors = await Promise.all(allRequests);
      // Sort Priority: Persisted neighbors, premium neighbors, neighbor address
      evaluatedNeighbors.sort((a, b) => {
        if (
          // Persisted neighbors priority
          (NODE_STATE.persistedNeighbors &&
            NODE_STATE.persistedNeighbors.includes(
              `tcp://${a.domain}:${a.address.split(':')[1]}`
            )) ^
          (NODE_STATE.persistedNeighbors &&
            NODE_STATE.persistedNeighbors.includes(
              `tcp://${b.domain}:${b.address.split(':')[1]}`
            ))
        ) {
          return NODE_STATE.persistedNeighbors.includes(
            `tcp://${a.domain}:${a.address.split(':')[1]}`
          )
            ? -1
            : 1;
        }
        if (!!a.iriVersion ^ !!b.iriVersion) {
          return a.iriVersion ? -1 : 1;
        }
        return a.domain ? a.domain.localeCompare(b.domain) : 1;
      });

      NODE_STATE.currentNeighbors = evaluatedNeighbors;

      DB_SERVICE.addNeighborStates(evaluatedNeighbors);

      DB_SERVICE.deleteOutdatedNeighborEntries();
    } catch (e) {
      console.log(e.message);
    }
  }
};

module.exports = fetchNeighbors;
