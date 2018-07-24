<template>
  <div>

    <h1 class="title">Hi :)</h1>
    <div v-if="code === 'NODE_NOT_SET'">
      <h2 class="subtitle">Looks like you didn't link your node yet. Please provide the IP / Domain below.</h2>
    </div>

    <div v-else>
      <h2 class="subtitle">There appears to be problems reaching your node. If the IP changed, please update it down
        below. Otherwise, you have to fix the node itself.</h2>
    </div>

    <br>

    <nav class="level">
      <div class="level-item has-text-centered">
        <div class="field">
          <label class="label">Host-Node IP:</label>
          <div class="control">
            <input v-model="nodeIp" class="input" type="text" placeholder="E.g. 192.168.1.111">
          </div>
        </div>
      </div>
    </nav>

    <nav class="level">
      <div class="level-item has-text-centered">
        <div class="control">
          <button class="button is-link" :class="{'is-loading': submitted}"
                  @click="setHostNodeIp(nodeIp); submitted = true">Submit
          </button>
        </div>
      </div>
    </nav>

  </div>
</template>

<script>
  import {mapActions} from 'vuex';

  export default {
    name: 'Error',
    props: ['code'],
    data: () => {
      return {
        nodeIp: undefined,
        submitted: false
      };
    },
    methods: {
      ...mapActions(['setHostNodeIp'])
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
</style>