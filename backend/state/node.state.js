class NodeState {
  constructor() {
    this.currentOwnNodeInfo = undefined;
    this.persistedNeighbors = undefined;
    this.restartNodeCommand = undefined;

    this.loginToken = undefined;
    this.hashedPw = undefined;
    this.notificationTokens = [];
    this.neighborAdditionalData = new Map();

    this.protocol = undefined;
    this.iriIp = undefined;
    this.iriPort = undefined;
    this.iriFileLocation = undefined;
  }
}

const nodeState = new NodeState();
module.exports = nodeState;
