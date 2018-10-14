<template>
  <div>

    <h1 class="title">Hi :)</h1>
    <div v-if="code === 'NODE_NOT_SET'">
      <h2 class="subtitle">Looks like you didn't link your node yet. Please provide the IP / Domain below.</h2>
    </div>

    <div v-else>
      <h2 class="subtitle">There appears to be problems reaching your node. If the IP changed, please update it down
        below. Otherwise, you have to fix the node itself.</h2>
      <h2 class="subtitle">Currently set IP: {{iriIp}}</h2>
    </div>

    <br>

    <nav class="level">
      <div class="level-item has-text-centered">
        <div class="columns">
          <div class="column">
            <label class="label">Host-Node IP / Domain (Port only if non-default):</label>
            <div class="columns">
              <div class="column is-4">
                <input id="switchRoundedSuccess" v-model="isHttps" type="checkbox" class="switch is-rounded is-success">
                <label for="switchRoundedSuccess">https?</label>
              </div>
              <div class="column is-8">
                <input v-model="nodeIp" class="input" type="text"
                       placeholder="E.g. 192.168.1.111 or my-domain.com:12345">
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <nav v-if="code === 'NODE_NOT_SET'" class="level">
      <div class="level-item has-text-centered">
        <div class="field">
          <label class="label">Define a Password (for node interactions):</label>
          <div class="control">
            <input v-model="password" class="input" type="text" placeholder="Choose wisely...">
          </div>
        </div>
      </div>
    </nav>
    <nav v-if="code === 'NODE_NOT_SET'" class="level">
      <div class="level-item has-text-centered">
        <div class="field">
          <label class="label">Path to iri config (optional, but recommended):</label>
          <div class="control">
            <input v-model="iriFileLocation" class="input" type="text" placeholder="E.g. /home/user/iri.txt">
          </div>
        </div>
      </div>
    </nav>

    <nav class="level">
      <div class="level-item has-text-centered">
        <div class="control">
          <button class="button is-link"
                  :class="{'is-loading': submitted}"
                  @click="setHostNodeIp({isHttps, nodeIp, password, iriFileLocation}); submitted = true"
                  :disabled="code === 'NODE_NOT_SET' ? !password || !nodeIp : !nodeIp">
            Submit
          </button>
        </div>
      </div>
    </nav>

  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import {mapActions} from 'vuex';

  export default {
    name: 'Error',
    props: ['code'],
    data: () => {
      return {
        isHttps: false,
        nodeIp: undefined,
        password: undefined,
        iriFileLocation: undefined,
        submitted: false
      };
    },
    methods: {
      ...mapActions(['setHostNodeIp'])
    },
    computed: {
      ...mapGetters(['iriIp'])
    },
    created() {
      this.$store.dispatch('fetchIriDetails');
    }
  };
</script>

<style scoped>
  input {
    max-width: 400px;
  }

  button {
    margin-top: 20px;
  }

  .is-4 {
    display: flex;
    align-items: center;
  }

  .limit {
    width: 60%
  }
</style>