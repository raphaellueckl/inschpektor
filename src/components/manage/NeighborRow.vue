<template>
  <div class="columns">
    <div class="column is-one-fifth">
      <div class="horizontal-grid">
        <input v-model="neighbor.name" placeholder="N/A" class="input" type="text">
        <span class="icon is-small is-right center-checkmark" :key="0" v-on:click="addNeighborNick(neighbor)">
          <font-awesome-icon icon="check" />
        </span>
      </div>
    </div>
    <div class="column is-two-fifths">
      {{neighbor.address}}
    </div>
    <div class="column">
      {{neighbor.isActive === null ? 'N/A' : neighbor.isActive ? '✔️' : '❌' }}
    </div>
    <div class="column">
      {{neighbor.isSynced === null ? 'N/A'
      : neighbor.isSynced ? '✔' : '❌'}}️
    </div>
    <div class="column">
      <a class="button is-danger is-rounded" :class="{'is-loading': submitted}" @click="remove">
        <font-awesome-icon icon="trash-alt" />
      </a>
    </div>
  </div>
</template>

<script>
  import {mapActions} from 'vuex';

  export default {
    name: 'NeighborRow',
    props: ['neighbor'],
    data: () => {
      return {
        submitted: false
      };
    },
    methods: {
      ...mapActions(['addNeighborNick']),
      remove() {
        this.submitted = true;
        this.$store.dispatch('removeNeighbor', this.neighbor);
      }
    }
  };
</script>

<style scoped>
  .columns {
    background-color: rgb(0, 159, 255, 0.85);
    color: #fff;
    margin-top: 4px;
    border-radius: 4px;
  }

  .horizontal-grid {
    display: grid;
    grid-template-columns: 10fr 1fr;
    grid-gap: 10px;
  }

  .center-checkmark {
    padding-top: 100%;
  }
</style>