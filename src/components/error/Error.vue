<template>
  <div>
    <h1 class="title">Hi :)</h1>
    <h2 class="subtitle">Looks like you didn't link your node yet. Please provide the IP / Domain below.</h2>

    <input v-model="nodeIp" class="input" type="text" placeholder="IP / Domain of your node">

    <nav class="level">
      <div class="level-item has-text-centered">
        <div class="control">
          <button class="button is-link" :class="{'is-loading': submitted}" @click="setHostNodeIp(nodeIp)">Submit</button>
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