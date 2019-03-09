import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import axios from 'axios';

axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');

axios.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    if (401 === error.response.status) {
      state.authenticated = false;
    } else {
      return Promise.reject(error);
    }
  }
);

const state = {
  hostNode: null,
  iriFileLocation: null,
  token: null,
  loading: false,
  nodeInfo: null,
  iriIp: null,
  neighbors: null,
  nodeError: null,
  authenticated: null,
  password: null,
  persistedNeighbors: null,
  latestInschpektorVersion: null
};

const mutations = {
  SET_TOKEN(state, token) {
    axios.defaults.headers.common['Authorization'] = token;
    localStorage.setItem('token', token);
    state.token = token;
  },
  SET_NODE_INFO(state, info) {
    state.nodeInfo = info;
  },
  SET_IRI_DETAILS(state, iriDetails) {
    state.iriIp = iriDetails.nodeIp;
    state.hostNode = iriDetails.nodeIp
      ? `${iriDetails.nodeIp}:${iriDetails.port}`
      : null;
    state.iriFileLocation = iriDetails.iriFileLocation;
  },
  SET_NEIGHBORS(state, neighbors) {
    state.neighbors = neighbors;
  },
  SET_ERROR(state, nodeError) {
    state.nodeError = nodeError;
  },
  SET_PASSWORD(state, password) {
    state.password = password;
  },
  USER_AUTHENTICATED(state, authenticated) {
    state.authenticated = authenticated;
  },
  SET_PERSISTED_IRI_NEIGHBORS(state, persistedNeighbors) {
    state.persistedNeighbors = persistedNeighbors;
  },
  DELETE_STATE(state) {
    Object.entries(state).forEach(([key, value]) => (state[key] = null));
  },
  SET_INSCHPEKTOR_LATEST_VERSION(state, latestVersion) {
    state.latestInschpektorVersion = latestVersion;
  }
};

const actions = {
  login({ commit }, passwordOrToken) {
    if (!passwordOrToken) passwordOrToken = localStorage.getItem('token');
    if (!passwordOrToken) return;
    return axios
      .post('/api/login', { passwordOrToken })
      .then(response => {
        commit('SET_TOKEN', response.data.token);
        commit('USER_AUTHENTICATED', true);
      })
      .catch(error => {
        commit('USER_AUTHENTICATED', false);
        console.log('Unsuccessful login attempt.', error.message);
      });
  },
  fetchNodeInfo({ commit }) {
    axios('/api/node-info')
      .then(response => {
        commit('SET_NODE_INFO', response.data);
        commit('SET_ERROR', null);
      })
      .catch(error => {
        commit('SET_NODE_INFO', null);
        commit('SET_ERROR', error.response.data);
      });
  },
  fetchIriDetails({ commit }) {
    axios('/api/iri-details')
      .then(response => {
        commit('SET_IRI_DETAILS', response.data);
      })
      .catch(error => {
        console.log('Error fetching iri details.');
      });
  },
  fetchNeighbors({ commit }) {
    axios('/api/neighbors')
      .then(response => {
        commit('SET_NEIGHBORS', response.data);
        commit('SET_ERROR', null);
      })
      .catch(error => {
        commit('SET_ERROR', error.response.data);
      });
  },
  setHostNodeIp({ dispatch, commit }, nodeSubmission) {
    let protocol = nodeSubmission.isHttps ? 'https' : 'http';
    let nodeIp = nodeSubmission.nodeIp;
    let port = '14265';
    if (nodeIp.includes(':')) {
      port = nodeIp.substring(nodeIp.indexOf(':') + 1);
      nodeIp = nodeIp.substring(0, nodeIp.indexOf(':'));
    }
    axios
      .post('/api/host-node-ip', {
        protocol,
        nodeIp,
        port,
        password: nodeSubmission.password,
        iriPath: nodeSubmission.iriFileLocation,
        restartNodeCommand: nodeSubmission.restartNodeCommand
      })
      .then(response => {
        iriIp = nodeIp;
        iriPort = port;
        if (response.data.token) {
          commit('SET_TOKEN', response.data.token);
          commit('USER_AUTHENTICATED', true);
          commit('SET_IRI_DETAILS', nodeSubmission);
        } else {
          commit('USER_AUTHENTICATED', false);
        }
        commit('SET_ERROR', null);
        dispatch('fetchNeighbors');
        dispatch('fetchNodeInfo');
      })
      .catch(error => console.log('error setting node ip'));
  },
  addNeighbor({ dispatch, commit }, neighborSubmission) {
    axios
      .post('/api/neighbor', {
        name: neighborSubmission.name,
        address: neighborSubmission.address,
        writeToIriConfig: neighborSubmission.writeToIriConfig,
        port: neighborSubmission.port
      })
      .then(response => {
        dispatch('fetchNeighbors');
      })
      .catch(error => console.log('Error adding neighbor'));
  },
  setNeighborName({ commit }, neighbor) {
    axios
      .post('/api/neighbor/name', {
        name: neighbor.name,
        fullAddress: `${neighbor.protocol}://${neighbor.address}`
      })
      .then(response => {})
      .catch(error => console.log('Error when setting nick for neighbor'));
  },
  setNeighborPort({ commit }, neighbor) {
    axios
      .post('/api/neighbor/port', {
        port: neighbor.port,
        fullAddress: `${neighbor.protocol}://${neighbor.address}`
      })
      .then(response => {})
      .catch(error => console.log('Error when setting port for neighbor'));
  },
  removeNeighbor({ dispatch, commit }, neighbor) {
    const address = `${neighbor.protocol}://${neighbor.address}`;
    axios
      .delete('/api/neighbor', { data: { address } })
      .then(response => {
        dispatch('fetchNeighbors');
      })
      .catch(error => console.log('Error deleting neighbor'));
  },
  fetchPersistedIriNeighbors({ commit }) {
    axios('/api/persisted-neighbors')
      .then(response => {
        commit('SET_PERSISTED_IRI_NEIGHBORS', response.data);
      })
      .catch(error => {
        console.log('Error fetching persisted iri neighbors');
      });
  },
  resetDatabase({ commit }) {
    return axios
      .post('/api/reset-database')
      .then(response => {
        commit('USER_AUTHENTICATED', false);
        commit('SET_ERROR', 'NODE_NOT_SET');
        commit('DELETE_STATE');
      })
      .catch(error => console.log('Unsuccessful reset-database attempt.'));
  },
  restartNode({ commit }) {
    return axios
      .post('/api/restart-node')
      .catch(error => console.log('Unsuccessful restart-node attempt.'));
  },
  loadPeriodically({ dispatch }) {
    dispatch('fetchNeighbors');
    dispatch('fetchNodeInfo');
  },
  saveDatabase({ commit }) {
    const neighborsToBackup = JSON.stringify(state.neighbors);
    const blob = new Blob([neighborsToBackup], { type: 'text/json' });
    const fileName = 'inschpektor-backup.json';

    const tempElement = document.createElement('a');
    const url = URL.createObjectURL(blob);
    tempElement.href = url;
    tempElement.download = fileName;
    document.body.appendChild(tempElement);
    tempElement.click();

    setTimeout(function() {
      document.body.removeChild(tempElement);
      window.URL.revokeObjectURL(url);
    });
  },
  loadDatabase({ commit }, restoredNeighbors) {
    axios
      .post('/api/neighbor/additional-data', restoredNeighbors)
      .catch(error =>
        console.log('Error when trying to restore neighbor additional data.')
      );
  },
  checkForVersionUpdate({ commit }) {
    axios
      .get(
        'https://cors-anywhere.herokuapp.com/http://registry.npmjs.org/-/package/inschpektor/dist-tags'
      )
      .then(response => {
        if (response && response.data) {
          commit('SET_INSCHPEKTOR_LATEST_VERSION', response.data.latest);
        }
      })
      .catch(error =>
        console.log(
          'Could not receive information about latest inschpektor version.'
        )
      );
  }
};

const getters = {
  token: state => state.token,
  loading: state => state.loading,
  nodeInfo: state => state.nodeInfo,
  iriFileLocation: state => state.iriFileLocation,
  iriIp: state => state.iriIp,
  hostNode: state => state.hostNode,
  neighbors: state => state.neighbors,
  nodeError: state => state.nodeError,
  authenticated: state => state.authenticated,
  persistedNeighbors: state => state.persistedNeighbors,
  latestInschpektorVersion: state => state.latestInschpektorVersion
};

const storeModule = {
  state,
  mutations,
  actions,
  getters
};

export default new Vuex.Store({
  modules: {
    storeModule
  }
});
