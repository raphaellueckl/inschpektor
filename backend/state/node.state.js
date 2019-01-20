class NodeState {

    constructor() {
        this.currentOwnNodeInfo = undefined;
        this.persistedNeighbors = undefined;
        this.restartNodeCommand = undefined;
    }

}

const nodeState = new NodeState();
module.exports = nodeState;
