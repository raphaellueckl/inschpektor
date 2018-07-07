<template>
  <div v-if="neighbors">
    <article class="message is-success" :class="[issues(neighbors).length === 0 ? 'is-success' : 'is-warning']">
      <div class="message-header">
        <p>Summary - Neighbors: {{neighbors.length}}</p>
        <button class="delete" aria-label="delete"></button>
      </div>
      <div class="message-body">
        <p v-if="issues(neighbors).length === 0">Everything is fine! :)</p>
        <p v-for="issue in issues(neighbors)">• {{issue}}</p>
      </div>
    </article>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';

  export default {
    name: 'Summary',
    props: ['neighbors'],
    methods: {
      // ...mapGetters(['neighbors']),
      issues: (neighbors) => {
        const issueMsgs = [];

        const addIssueMessage = (neighbor, msg) => {
          issueMsgs.push(`Neighbor ${neighbor.address} ${msg}`);
        };
        neighbors.forEach(n => {
          if (!n.isFriendlyNode) addIssueMessage(n, 'has a lot of invalid transactions.');
          if (n.isSynced === false) addIssueMessage(n, 'does not seem to be in sync.');
          if (n.isActive === false) addIssueMessage(n, 'does not seem to be active anymore.');
        });

        return issueMsgs;
      }
    },
  };
</script>

<style scoped>
  div {
    padding-bottom: 10px;
  }
</style>