import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import axios from 'axios';

const iri_ip = '192.168.188.20';
const iri_port = '14265';

const state = {
  hostNode: `${iri_ip}:${iri_port}`,
  token: null,
  loading: false,
  nodeInfo: null,
  neighbors: null
};

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token;
  },
  LOGIN_PENDING(state) {
    state.loading = true;
  },
  LOGIN_SUCCESS(state) {
    state.loading = false;
  },
  SET_NODE_INFO(state, info) {
    state.nodeInfo = info;
  },
  SET_NEIGHBORS(state, neighbors) {
    state.neighbors = neighbors;
  }
};

const actions = {
  login({commit}) {
    return axios.post('/api/login').then(response => {
      localStorage.setItem('token', response.data.token);
      commit('SET_TOKEN', response.data.token);
    });
  },
  logout({commit}) {
    return new Promise((resolve) => {
      localStorage.removeItem('token');
      commit('SET_TOKEN', null);
      resolve();
    });
  },
  fetchNodeInfo({commit}) {
    axios(createIriRequest('getNodeInfo')).then(response => {
      commit('SET_NODE_INFO', response.data);
    });
  },
  fetchNeighbors({commit}) {
    axios(createIriRequest('getNeighbors'))
      .then(response => {
        commit('SET_NEIGHBORS', response.data.neighbors);
      })
      .catch(error => {
        commit('SET_NEIGHBORS', mockData.neighbors);
      });
  }
};

const getters = {
  token: state => state.token,
  loading: state => state.loading,
  nodeInfo: state => state.nodeInfo,
  hostNode: state => state.hostNode,
  neighbors: state => state.neighbors,
};

const storeModule = {
  state,
  mutations,
  actions,
  getters
};

function createIriRequest(command) {
  return {
    url: `http://${iri_ip}:${iri_port}`,
    data: {'command': command},
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'X-IOTA-API-Version': '1'
    }
  };
}

export default new Vuex.Store({
  modules: {
    storeModule
  }
});

const mockData =
  {
    'neighbors': [
      {
        'address': 'MOCK_173.249.39.22:14600',
        'numberOfAllTransactions': 29145,
        'numberOfRandomTransactionRequests': 8382,
        'numberOfNewTransactions': 12575,
        'numberOfInvalidTransactions': 0,
        'numberOfSentTransactions': 49310,
        'connectionType': 'udp'
      },
      {
        'address': 'MOCK_104.225.220.47:14600',
        'numberOfAllTransactions': 17782,
        'numberOfRandomTransactionRequests': 2208,
        'numberOfNewTransactions': 4027,
        'numberOfInvalidTransactions': 0,
        'numberOfSentTransactions': 43203,
        'connectionType': 'udp'
      },
      {
        'address': 'MOCK_vmi173376.contaboserver.net:14600',
        'numberOfAllTransactions': 31250,
        'numberOfRandomTransactionRequests': 7608,
        'numberOfNewTransactions': 14194,
        'numberOfInvalidTransactions': 0,
        'numberOfSentTransactions': 48576,
        'connectionType': 'udp'
      },
      {
        'address': 'MOCK_iotahosting.org:14600',
        'numberOfAllTransactions': 22654,
        'numberOfRandomTransactionRequests': 4202,
        'numberOfNewTransactions': 5189,
        'numberOfInvalidTransactions': 0,
        'numberOfSentTransactions': 45221,
        'connectionType': 'udp'
      },
      {
        'address': 'MOCK_188.165.203.172:14600',
        'numberOfAllTransactions': 1903,
        'numberOfRandomTransactionRequests': 284,
        'numberOfNewTransactions': 368,
        'numberOfInvalidTransactions': 0,
        'numberOfSentTransactions': 2538,
        'connectionType': 'udp'
      },
      {
        'address': 'MOCK_78.46.248.142:14600',
        'numberOfAllTransactions': 210,
        'numberOfRandomTransactionRequests': 44,
        'numberOfNewTransactions': 23,
        'numberOfInvalidTransactions': 0,
        'numberOfSentTransactions': 2206,
        'connectionType': 'udp'
      },
      {
        'address': 'MOCK_71.206.23.175:14600',
        'numberOfAllTransactions': 1077,
        'numberOfRandomTransactionRequests': 128,
        'numberOfNewTransactions': 44,
        'numberOfInvalidTransactions': 0,
        'numberOfSentTransactions': 1507,
        'connectionType': 'udp'
      },
      {
        'address': 'MOCK_195.201.24.253:14600',
        'numberOfAllTransactions': 701,
        'numberOfRandomTransactionRequests': 13,
        'numberOfNewTransactions': 197,
        'numberOfInvalidTransactions': 0,
        'numberOfSentTransactions': 907,
        'connectionType': 'udp'
      },
      {
        'address': 'MOCK_111.231.86.86:14600',
        'numberOfAllTransactions': 496,
        'numberOfRandomTransactionRequests': 13,
        'numberOfNewTransactions': 24,
        'numberOfInvalidTransactions': 0,
        'numberOfSentTransactions': 576,
        'connectionType': 'udp'
      }
    ],
    'duration': 0
  }